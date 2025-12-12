import { useState, useEffect, useRef, Suspense, lazy } from "react";
import "./App.css";
import type { DimensionType } from "./data/types";
import {
  BASE_EMOTIONS,
  BASE_EMOTION_COLORS,
  BASE_EMOTION_SHAPES,
  DEFAULT_EMOTION_COLOR,
  UI_COLORS,
  type FilterType,
} from "./constants/emotions";
import {
  getDimensionDisplayName,
  formatDimensionTooltip,
  getDimensionValueLabel,
} from "./utils/dimensions";
import {
  getEmotionDimension,
  generateGradientFromRatios,
} from "./utils/emotions";
import { LoadingScreen } from "./components/LoadingScreen";
import { Header } from "./components/Header";
import { StickyCraftingBar } from "./components/StickyCraftingBar";

// Helper function to render a single shape
const renderSingleShape = (
  shape: string,
  fill: string,
  stroke: string,
  strokeWidth: number,
  opacity: number = 1,
  transform?: string,
  emotion?: string
) => {
  const style = { fill, stroke, strokeWidth, opacity };

  switch (shape) {
    case "circle":
      return <circle cx="12" cy="12" r="8" {...style} />;
    case "square":
      return (
        <rect
          x="6"
          y="6"
          width="12"
          height="12"
          {...style}
          transform={transform}
        />
      );
    case "triangleDown":
      return <path d="M12 4 L20 20 L4 20 Z" {...style} transform={transform} />;
    case "star":
      return (
        <path
          d="M12 2 L14.5 8.5 L21 9.5 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.5 L9.5 8.5 Z"
          {...style}
          transform={transform}
        />
      );
    case "droplet":
      // Scale up droplet to match other shapes better
      const dropletScale = 1.25;
      const baseTransform = transform || "";

      if (emotion === "Sadness") {
        // For sadness: fatter teardrop shape, scale up, center, then flip vertically
        return (
          <g
            transform={`translate(12, 12) scale(${dropletScale}) translate(-12, -12) ${baseTransform} scale(1, -1) translate(0, -24)`}
          >
            <path
              d="M12 2 C9 2 7 4 7 6.5 C7 9 8.5 11.5 10.5 13.5 C11.2 14.5 12 15 12 20 C12 15 12.8 14.5 13.5 13.5 C15.5 11.5 17 9 17 6.5 C17 4 15 2 12 2 Z"
              {...style}
            />
          </g>
        );
      } else {
        // For other emotions using droplet: just scale up
        return (
          <g
            transform={`translate(12, 12) scale(${dropletScale}) translate(-12, -12) ${baseTransform}`}
          >
            <path
              d="M12 2 C10 2 8.5 4 8.5 6.5 C8.5 9 9.5 11.5 11 13.5 C11.5 14.5 12 15 12 20 C12 15 12.5 14.5 13 13.5 C14.5 11.5 15.5 9 15.5 6.5 C15.5 4 14 2 12 2 Z"
              {...style}
            />
          </g>
        );
      }
    case "hexagon":
      // Larger, more prominent regular hexagon with radius ~9.5
      return (
        <path
          d="M12 2.5 L19.8 7.2 L19.8 16.8 L12 21.5 L4.2 16.8 L4.2 7.2 Z"
          {...style}
          transform={transform}
        />
      );
    case "triangleUp":
      return <path d="M12 20 L4 4 L20 4 Z" {...style} transform={transform} />;
    case "diamond":
      return (
        <path
          d="M12 2 L22 12 L12 22 L2 12 Z"
          {...style}
          transform={transform}
        />
      );
    case "oval":
      // Horizontal oval (wider than tall)
      return (
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="7"
          {...style}
          transform={transform}
        />
      );
    default:
      return null;
  }
};

// EmotionShape component to render shape icons for base emotions
interface EmotionShapeProps {
  emotion: string;
  color: string;
  size?: number;
}

const EmotionShape = ({ emotion, color, size = 16 }: EmotionShapeProps) => {
  const shape = BASE_EMOTION_SHAPES[emotion];
  if (!shape) return null;

  const viewBox = "0 0 24 24";
  const fill = color;
  const stroke = color;
  const strokeWidth = 1.5;

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className="emotion-shape-icon"
      style={{ flexShrink: 0 }}
    >
      {renderSingleShape(
        shape,
        fill,
        stroke,
        strokeWidth,
        1,
        undefined,
        emotion
      )}
    </svg>
  );
};

// BlendedEmotionShape component to render blended shapes for mixed emotions
interface BlendedEmotionShapeProps {
  emotion: string;
  color: string;
  size?: number;
  getBaseEmotionRatios: (
    emotion: string
  ) => Array<{ emotion: string; ratio: number }>;
}

const BlendedEmotionShape = ({
  emotion,
  color,
  size = 16,
  getBaseEmotionRatios,
}: BlendedEmotionShapeProps) => {
  const ratios = getBaseEmotionRatios(emotion);
  if (ratios.length === 0) return null;

  const viewBox = "0 0 24 24";
  const strokeWidth = 1.5;

  // Get dominant emotion (first in sorted ratios)
  const dominant = ratios[0];
  const dominantShape = BASE_EMOTION_SHAPES[dominant.emotion];
  if (!dominantShape) return null;

  // Get dominant color
  const dominantColor = BASE_EMOTION_COLORS[dominant.emotion] || color;

  // Render dominant shape as base
  const dominantFill = dominantColor;
  const dominantStroke = dominantColor;

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className="emotion-shape-icon"
      style={{ flexShrink: 0 }}
    >
      {/* Render dominant shape at full opacity */}
      {renderSingleShape(
        dominantShape,
        dominantFill,
        dominantStroke,
        strokeWidth,
        1,
        undefined,
        dominant.emotion
      )}

      {/* Render secondary shapes with reduced opacity based on ratio */}
      {ratios
        .slice(1)
        .map((ratioData: { emotion: string; ratio: number }, index: number) => {
          const shape = BASE_EMOTION_SHAPES[ratioData.emotion];
          if (!shape || ratioData.ratio < 0.1) return null; // Skip very small contributions

          const secondaryColor =
            BASE_EMOTION_COLORS[ratioData.emotion] || color;
          // Opacity based on ratio, with minimum of 0.2 and maximum of 0.6 for secondary shapes
          const opacity = Math.max(0.2, Math.min(0.6, ratioData.ratio * 2));

          // Offset secondary shapes slightly for visual blending
          const offsetX = (index % 2 === 0 ? 1 : -1) * (ratioData.ratio * 2);
          const offsetY = (index % 3 === 0 ? 1 : -1) * (ratioData.ratio * 1.5);
          const transform = `translate(${offsetX}, ${offsetY})`;

          return (
            <g key={ratioData.emotion} opacity={opacity}>
              {renderSingleShape(
                shape,
                secondaryColor,
                secondaryColor,
                strokeWidth,
                1,
                transform,
                ratioData.emotion
              )}
            </g>
          );
        })}
    </svg>
  );
};

export const App = () => {
  const [discoveredEmotions, setDiscoveredEmotions] = useState<Set<string>>(
    new Set(BASE_EMOTIONS)
  );
  const [craftingSlots, setCraftingSlots] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [lastCombination, setLastCombination] = useState<string[]>([]);
  const [isNewDiscovery, setIsNewDiscovery] = useState(false);
  const [totalDiscoveries, setTotalDiscoveries] = useState<number>(
    BASE_EMOTIONS.length
  );
  const [highlightedEmotion, setHighlightedEmotion] = useState<string | null>(
    null
  );
  const [combinableEmotions, setCombinableEmotions] = useState<Set<string>>(
    new Set()
  );
  const [unexploredEmotions, setUnexploredEmotions] = useState<Set<string>>(
    new Set()
  );
  const [selectedEmotionPopup, setSelectedEmotionPopup] = useState<
    string | null
  >(null);
  const [triedCombinations, setTriedCombinations] = useState<Set<string>>(
    new Set()
  );
  const [hasAttemptedCombine, setHasAttemptedCombine] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCombining, setIsCombining] = useState(false);
  const [selectedDimensionValues, setSelectedDimensionValues] = useState<{
    [dimension in DimensionType]?: string;
  }>({});
  const [selectedDimensionModal, setSelectedDimensionModal] =
    useState<DimensionType | null>(null);
  const [dimensionsExpanded, setDimensionsExpanded] = useState(false);
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [showTypeFilterModal, setShowTypeFilterModal] = useState(false);
  const [showEmotionsModal, setShowEmotionsModal] = useState(false);
  const [showFeelingsModal, setShowFeelingsModal] = useState(false);
  const [showStatesModal, setShowStatesModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [sortOrder, setSortOrder] = useState<"alphabetical" | "available">(
    "alphabetical"
  );
  const [showCombinableIndicators, setShowCombinableIndicators] =
    useState<boolean>(true);
  const autoCombineTriggered = useRef(false);
  const craftingAreaRef = useRef<HTMLDivElement>(null);
  const resultDisplayRef = useRef<HTMLDivElement>(null);
  const [recentlyAddedEmotion, setRecentlyAddedEmotion] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);

  // Lazy load data structures
  const [feelingDescriptions, setFeelingDescriptions] = useState<{
    [key: string]: string;
  } | null>(null);
  const [emotionDimensions, setEmotionDimensions] = useState<{
    [key: string]: { [dimension in DimensionType]?: string };
  } | null>(null);
  const [dimensionTooltips, setDimensionTooltips] = useState<
    { [key in DimensionType]: string } | null
  >(null);
  const [dimensionValues, setDimensionValues] = useState<
    { [key in DimensionType]: string[] } | null
  >(null);
  const [showFinderModal, setShowFinderModal] = useState(false);
  const [finderSelections, setFinderSelections] = useState<
    Partial<Record<DimensionType, string>>
  >({});
  const [finderResults, setFinderResults] = useState<string[]>([]);
  const [finderTypeFilter, setFinderTypeFilter] = useState<FilterType>("all");
  const [finderMode, setFinderMode] = useState<"dimensions" | "text">(
    "dimensions"
  );
  const [finderTextSearch, setFinderTextSearch] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(
    new Set()
  );

  // Lazy-loaded modals chunk
  const Modals = lazy(() => import("./components/Modals"));
  // Lazy load emotion graph - built after first render to show loading screen first
  const [emotionGraph, setEmotionGraph] = useState<any>(null);

  // Load data files dynamically
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          { FEELING_DESCRIPTIONS },
          { EMOTION_DIMENSIONS },
          { DIMENSION_TOOLTIPS, DIMENSION_VALUES },
          { buildFeelingGraph },
        ] = await Promise.all([
          import("./data/feelingDescriptions"),
          import("./data/emotionDimensions"),
          import("./data/dimensionTooltips"),
          import("./buildFeelingGraph"),
        ]);

        setFeelingDescriptions(FEELING_DESCRIPTIONS);
        setEmotionDimensions(EMOTION_DIMENSIONS);
        setDimensionTooltips(DIMENSION_TOOLTIPS);
        setDimensionValues(DIMENSION_VALUES);

        // Build graph after data is loaded
        const graph = buildFeelingGraph(BASE_EMOTIONS);
        setEmotionGraph(graph);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Cache for base emotion ratios to avoid repeated deep traversals
  const baseRatioCache = useRef<
    Map<string, Array<{ emotion: string; ratio: number }>>
  >(new Map());

  // Clear caches when graph changes
  useEffect(() => {
    baseRatioCache.current.clear();
  }, [emotionGraph]);

  // Helper functions that use the emotion graph
  const getEmotionCombination = (
    emotion1: string,
    emotion2: string
  ): string | null => {
    if (!emotionGraph) return null;
    return emotionGraph.getCombination(emotion1, emotion2);
  };

  const getBaseEmotionComponents = (emotion: string): string[] => {
    if (!emotionGraph) return [];
    return emotionGraph.getBaseComponents(emotion);
  };

  const getBaseEmotionRatios = (
    emotion: string
  ): Array<{ emotion: string; ratio: number }> => {
    const cached = baseRatioCache.current.get(emotion);
    if (cached) return cached;

    if (!emotionGraph) return [];

    if (BASE_EMOTIONS.includes(emotion)) {
      const ratios = [{ emotion, ratio: 1 }];
      baseRatioCache.current.set(emotion, ratios);
      return ratios;
    }

    // Count weighted contributions of each base emotion
    // Weight decreases with depth to prioritize direct contributions
    const counts = new Map<string, number>();
    const maxDepth = 5; // Limit depth for performance

    const countContributions = (
      current: string,
      depth: number = 0,
      weight: number = 1.0
    ): void => {
      if (depth > maxDepth) return;

      if (BASE_EMOTIONS.includes(current)) {
        // Base emotion: add weighted contribution
        counts.set(current, (counts.get(current) || 0) + weight);
        return;
      }

      if (!emotionGraph) return;
      const parents = emotionGraph.getParents(current);
      if (parents.length === 0) return;

      // Split weight across all parent pairs, then across each parent in the pair
      const pairWeight = weight / parents.length;
      parents.forEach(([p1, p2]: [string, string]) => {
        const childWeight = pairWeight * 0.5;
        countContributions(p1, depth + 1, childWeight);
        countContributions(p2, depth + 1, childWeight);
      });
    };

    countContributions(emotion, 0, 1.0);

    // Convert to ratios
    const total = Array.from(counts.values()).reduce(
      (sum, count) => sum + count,
      0
    );
    if (total === 0) {
      // Fallback: equal distribution among base components
      const baseComponents = getBaseEmotionComponents(emotion);
      return baseComponents.map((comp) => ({
        emotion: comp,
        ratio: 1 / baseComponents.length,
      }));
    }

    const ratios = Array.from(counts.entries())
      .map(([emotion, count]) => ({
        emotion,
        ratio: count / total,
      }))
      .sort((a, b) => b.ratio - a.ratio);

    baseRatioCache.current.set(emotion, ratios);
    return ratios;
  };

  // Emotion Finder helpers
  const finderDimensions: DimensionType[] = [
    "valence",
    "arousal",
    "dominance",
    "temporalFocus",
    "motivationalDirection",
    "certainty",
    "intensity",
    "socialContext",
    "cognitiveAppraisal",
    "embodiment",
  ];

  const runEmotionFinder = () => {
    if (finderMode === "text") {
      // Description search mode
      if (!finderTextSearch.trim()) {
        setFinderResults([]);
        return;
      }

      const searchQuery = finderTextSearch.toLowerCase().trim();
      let results: string[] = [];

      // Search through all emotions/feelings/states
      if (emotionGraph) {
        const allItems = new Set<string>();

        // Add base emotions
        BASE_EMOTIONS.forEach((emotion) => allItems.add(emotion));

        // Add all discovered emotions
        discoveredEmotions.forEach((emotion) => allItems.add(emotion));

        // Add all emotions from the graph
        Object.keys(emotionGraph).forEach((emotion) => allItems.add(emotion));

        results = Array.from(allItems).filter((item) => {
          // Search in name
          if (item.toLowerCase().includes(searchQuery)) {
            return true;
          }

          // Search in description
          if (feelingDescriptions) {
            const description = feelingDescriptions[item]?.toLowerCase() || "";
            if (description.includes(searchQuery)) {
              return true;
            }
          }

          return false;
        });
      }

      // Apply type filter
      if (finderTypeFilter !== "all") {
        results = results.filter((emotion) => {
          const itemType = getItemType(emotion);
          if (
            finderTypeFilter === "emotion" ||
            finderTypeFilter === "feeling"
          ) {
            return itemType === "emotion" || itemType === "feeling";
          }
          return itemType === finderTypeFilter;
        });
      }

      results = results.sort((a, b) => a.localeCompare(b)).slice(0, 50);
      setFinderResults(results);
      return;
    }

    // Dimensions mode
    if (!emotionDimensions) {
      setFinderResults([]);
      return;
    }

    const activeFilters = Object.entries(finderSelections).filter(
      ([, value]) => value !== undefined && value !== ""
    ) as Array<[DimensionType, string]>;

    if (activeFilters.length === 0 && finderTypeFilter === "all") {
      setFinderResults([]);
      return;
    }

    let results = Object.entries(emotionDimensions)
      .filter(
        ([, dims]) =>
          activeFilters.length === 0 ||
          activeFilters.every(([dim, val]) => dims[dim] === val)
      )
      .map(([emotion]) => emotion);

    // Apply type filter
    if (finderTypeFilter !== "all") {
      results = results.filter((emotion) => {
        const itemType = getItemType(emotion);
        if (finderTypeFilter === "emotion" || finderTypeFilter === "feeling") {
          return itemType === "emotion" || itemType === "feeling";
        }
        return itemType === finderTypeFilter;
      });
    }

    results = results.sort((a, b) => a.localeCompare(b)).slice(0, 24);
    setFinderResults(results);
  };

  const resetEmotionFinder = () => {
    setFinderSelections({});
    setFinderResults([]);
    setFinderTypeFilter("all");
    setFinderTextSearch("");
  };

  const handleFinderEmotionSelect = (emotion: string) => {
    const isNew = !discoveredEmotions.has(emotion);
    setLastResult(emotion);
    setLastCombination([]);
    setIsNewDiscovery(isNew);
    setHasAttemptedCombine(true);
    if (isNew) {
      const updated = new Set(discoveredEmotions);
      updated.add(emotion);
      setDiscoveredEmotions(updated);
      saveDiscoveries(updated);
    }
    setShowFinderModal(false);
  };

  const EmotionChip = ({
    emotion,
    onClick,
  }: {
    emotion: string;
    onClick?: () => void;
  }) => {
    const isBase = BASE_EMOTIONS.includes(emotion);
    const ratios = isBase
      ? [{ emotion, ratio: 1 }]
      : getBaseEmotionRatios(emotion);
    const gradient = isBase ? undefined : generateGradientFromRatios(ratios);
    const border = getEmotionBorderColor(emotion);

    return (
      <button
        className="discovered-emotion"
        onClick={onClick}
        style={
          {
            "--emotion-color": gradient || border,
            "--emotion-border-color": border,
          } as React.CSSProperties
        }
      >
        {isBase ? (
          <EmotionShape emotion={emotion} color="#0f172a" size={14} />
        ) : (
          <BlendedEmotionShape
            emotion={emotion}
            color="#0f172a"
            size={14}
            getBaseEmotionRatios={getBaseEmotionRatios}
          />
        )}
        {emotion}
      </button>
    );
  };

  // Categorize an item as emotion, feeling, or state based on its description
  const getItemType = (item: string): "emotion" | "feeling" | "state" => {
    // Only the 6 base emotions are "emotion"
    if (BASE_EMOTIONS.includes(item)) {
      return "emotion";
    }

    const description = getFeelingDescription(item).toLowerCase();

    // Check if description mentions "state" (and not just "feeling or state")
    if (
      description.includes(" state ") ||
      description.includes("state of") ||
      description.startsWith("the state")
    ) {
      return "state";
    }

    // Check if description mentions "feeling"
    if (description.includes("feeling") || description.includes("feelings")) {
      return "feeling";
    }

    // Default to feeling for others (since they're not base emotions)
    return "feeling";
  };

  const toggleDimensionValue = (dimension: DimensionType, value: string) => {
    const newSelected = { ...selectedDimensionValues };
    // If clicking the same value, deselect it. Otherwise, select this value (deselecting any other value in this dimension)
    if (newSelected[dimension] === value) {
      delete newSelected[dimension];
    } else {
      newSelected[dimension] = value;
    }
    setSelectedDimensionValues(newSelected);
  };

  const getSelectedCount = () => {
    return Object.keys(selectedDimensionValues).length;
  };

  const inferTriedCombinations = (emotions: Set<string>): Set<string> => {
    const inferred = new Set<string>();
    const allEmotions = Array.from(emotions);

    // For each discovered emotion, find what combinations could have created it
    for (const emotion of allEmotions) {
      // Skip base emotions
      if (BASE_EMOTIONS.includes(emotion)) continue;

      // Check all pairs of discovered emotions to see if they combine to this emotion
      for (let i = 0; i < allEmotions.length; i++) {
        for (let j = i + 1; j < allEmotions.length; j++) {
          const result = getEmotionCombination(allEmotions[i], allEmotions[j]);
          if (result === emotion) {
            // Mark both directions as tried
            inferred.add(`${allEmotions[i]}+${allEmotions[j]}`);
            inferred.add(`${allEmotions[j]}+${allEmotions[i]}`);
          }
        }
      }
    }

    return inferred;
  };

  // Load from localStorage - wait for graph to be ready
  useEffect(() => {
    if (!emotionGraph) return; // Wait for graph to be built

    const saved = localStorage.getItem("discoveredEmotions");
    if (saved) {
      const parsed = JSON.parse(saved) as string[];
      const discoveredSet = new Set(parsed);
      setDiscoveredEmotions(discoveredSet);
      setTotalDiscoveries(parsed.length);

      // Infer tried combinations from discovered emotions
      const inferred = inferTriedCombinations(discoveredSet);

      // Load saved tried combinations and merge with inferred
      const savedCombinations = localStorage.getItem("triedCombinations");
      if (savedCombinations) {
        const parsedCombinations = JSON.parse(savedCombinations) as string[];
        const savedSet = new Set(parsedCombinations);
        // Merge inferred and saved
        const merged = new Set([...inferred, ...savedSet]);
        setTriedCombinations(merged);
        localStorage.setItem(
          "triedCombinations",
          JSON.stringify(Array.from(merged))
        );
      } else {
        // Just use inferred if nothing saved
        setTriedCombinations(inferred);
        localStorage.setItem(
          "triedCombinations",
          JSON.stringify(Array.from(inferred))
        );
      }
    } else {
      const savedCombinations = localStorage.getItem("triedCombinations");
      if (savedCombinations) {
        const parsed = JSON.parse(savedCombinations) as string[];
        setTriedCombinations(new Set(parsed));
      }
    }

    // Start fade out after initialization
    setTimeout(() => {
      setIsLoading(false);
      // Remove from DOM after fade animation completes
      setTimeout(() => {
        setShowLoading(false);
      }, 300);
    }, 300);
  }, [emotionGraph]);

  const saveDiscoveries = (emotions: Set<string>) => {
    const array = Array.from(emotions);
    localStorage.setItem("discoveredEmotions", JSON.stringify(array));
    setTotalDiscoveries(array.length);
  };

  // Get emotions that will result in a valid feeling when combined with items in crafting slots
  const getCombinableEmotionsWithAll = (
    slots: string[]
  ): { combinable: Set<string>; unexplored: Set<string> } => {
    if (slots.length === 0) {
      return { combinable: new Set(), unexplored: new Set() };
    }

    const allEmotions = Array.from(discoveredEmotions);
    const combinable = new Set<string>();
    const unexplored = new Set<string>();

    // Find emotions that, when added to slots, will result in a valid combination
    for (const otherEmotion of allEmotions) {
      // Skip if this emotion is already in slots
      if (slots.includes(otherEmotion)) continue;

      // Check if adding this emotion to the slots would result in a valid combination
      const testSlots = [...slots, otherEmotion];
      const result = combineMultipleEmotions(testSlots);

      // Only add if result is valid and not circular (result is not one of the inputs)
      if (result && !testSlots.includes(result)) {
        combinable.add(otherEmotion);

        // Check if any combination in the path is unexplored
        let hasUnexplored = false;
        // Check combinations between the new emotion and each slot item
        for (const slotEmotion of slots) {
          const comboKey1 = `${slotEmotion}+${otherEmotion}`;
          const comboKey2 = `${otherEmotion}+${slotEmotion}`;
          if (
            !triedCombinations.has(comboKey1) &&
            !triedCombinations.has(comboKey2)
          ) {
            hasUnexplored = true;
            break;
          }
        }

        if (hasUnexplored) {
          unexplored.add(otherEmotion);
        }
      }
    }

    return { combinable, unexplored };
  };

  const handleEmotionClick = (emotion: string, event?: React.MouseEvent) => {
    // Check if right-click or modifier key (Cmd/Ctrl) is pressed (overrides mode)
    const isViewDetails =
      event?.button === 2 || event?.ctrlKey || event?.metaKey;

    if (isViewDetails) {
      event?.preventDefault();
      viewFeelingDetails(emotion);
      return;
    }

    // Add emotion to crafting slots
    // Prevent adding emotion if it's already in crafting slots
    if (craftingSlots.includes(emotion)) {
      return;
    }
    const newSlots = [...craftingSlots, emotion];
    setCraftingSlots(newSlots);
    setLastResult(null);
    setLastCombination([]);
    setHasAttemptedCombine(false);

    // Set recently added for animation
    setRecentlyAddedEmotion(emotion);
    setTimeout(() => setRecentlyAddedEmotion(null), 600);

    // Reset auto-combine trigger when adding first emotion
    if (craftingSlots.length === 0) {
      autoCombineTriggered.current = false;
    }

    // Highlight combinable emotions - show emotions that combine with ALL items in slots
    const { combinable, unexplored } = getCombinableEmotionsWithAll(newSlots);
    setCombinableEmotions(combinable);
    setUnexploredEmotions(unexplored);
    // Set highlighted to show we have items selected (but don't highlight a single emotion)
    if (newSlots.length > 0) {
      setHighlightedEmotion(newSlots[0]); // Use first slot as marker, but we'll show all slots in hint
    }
  };

  const handleEmotionHover = (_emotion: string) => {
    // When hovering, show what combines with the hovered emotion
    // But if we have crafting slots, restore to showing what combines with all slots when leaving
  };

  const closeEmotionPopup = () => {
    setSelectedEmotionPopup(null);
  };

  const handleEmotionLeave = () => {
    // Restore combinable emotions based on crafting slots when hover ends
    if (craftingSlots.length > 0) {
      const { combinable, unexplored } =
        getCombinableEmotionsWithAll(craftingSlots);
      setCombinableEmotions(combinable);
      setUnexploredEmotions(unexplored);
    }
  };

  const getFeelingDescription = (emotion: string): string => {
    if (!feelingDescriptions) return "Loading...";
    return (
      feelingDescriptions[emotion] ||
      "A feeling discovered through combination."
    );
  };

  const clearHighlight = () => {
    setCraftingSlots([]);
    setHighlightedEmotion(null);
    setCombinableEmotions(new Set());
    setUnexploredEmotions(new Set());
  };

  // View feeling details without crafting
  const viewFeelingDetails = (emotion: string) => {
    if (!emotionGraph) return;
    // Find the parent combination that created this feeling
    const parents = emotionGraph.getParents(emotion);
    let combination: string[] = [];

    if (parents.length > 0) {
      // Use the first parent pair (most direct combination)
      const [parent1, parent2] = parents[0];
      combination = [parent1, parent2];
    } else if (BASE_EMOTIONS.includes(emotion)) {
      // Base emotions don't have parents, so no combination to show
      combination = [];
    }

    // Set the result display
    setLastResult(emotion);
    setLastCombination(combination);
    setIsNewDiscovery(false);

    // Clear crafting slots to show this is a view, not a craft
    setCraftingSlots([]);
    setHasAttemptedCombine(false);

    // Always scroll to result display when viewing details
    setTimeout(() => {
      if (resultDisplayRef.current) {
        const elementTop = resultDisplayRef.current.offsetTop;
        window.scrollTo({
          top: elementTop,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const combineMultipleEmotions = (emotions: string[]): string | null => {
    if (emotions.length < 2) return null;
    if (emotions.length === 2) {
      const result = getEmotionCombination(emotions[0], emotions[1]);
      // Prevent circular combinations: result cannot be one of the inputs
      if (result && emotions.includes(result)) {
        return null;
      }
      return result;
    }

    // For multiple emotions, combine them pairwise recursively
    let current = emotions[0];
    for (let i = 1; i < emotions.length; i++) {
      const result = getEmotionCombination(current, emotions[i]);
      if (result) {
        // Prevent circular combinations: intermediate or final result cannot be one of the inputs
        if (emotions.includes(result)) {
          return null;
        }
        current = result;
      } else {
        // If combination fails, return null instead of continuing
        return null;
      }
    }

    // Final check: ensure result is not one of the original inputs
    if (emotions.includes(current)) {
      return null;
    }

    return current;
  };

  const handleCombine = async () => {
    if (craftingSlots.length < 1) {
      return;
    }

    // Prevent multiple simultaneous combines
    if (isCombining) {
      return;
    }

    setIsCombining(true);
    setHasAttemptedCombine(true);
    setLastResult(null);
    setIsNewDiscovery(false);

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // If only one item, just show it as the result
    if (craftingSlots.length === 1) {
      const singleEmotion = craftingSlots[0];
      setLastResult(singleEmotion);
      setLastCombination([singleEmotion]); // Show it in the result display
      setIsNewDiscovery(false); // Single item view doesn't count as new discovery
      setIsCombining(false);

      // Clear slots after showing result
      setCraftingSlots([]);
      clearHighlight();
      setHasAttemptedCombine(false);
      autoCombineTriggered.current = false;

      // Scroll to result display
      setTimeout(() => {
        if (resultDisplayRef.current) {
          const elementTop = resultDisplayRef.current.offsetTop;
          window.scrollTo({
            top: elementTop,
            behavior: "smooth",
          });
        }
      }, 100);
      return;
    }

    // Try to combine all emotions
    const result = combineMultipleEmotions(craftingSlots);

    // Additional check: prevent circular combinations (result cannot be one of the inputs)
    if (result && !craftingSlots.includes(result)) {
      const wasNew = !discoveredEmotions.has(result);
      const newDiscovered = new Set(discoveredEmotions);
      newDiscovered.add(result);
      setDiscoveredEmotions(newDiscovered);
      setLastResult(result);
      setLastCombination([...craftingSlots]); // Store what was combined
      setIsNewDiscovery(wasNew);
      saveDiscoveries(newDiscovered);

      // Track tried combinations
      const newTried = new Set(triedCombinations);
      for (let i = 0; i < craftingSlots.length - 1; i++) {
        for (let j = i + 1; j < craftingSlots.length; j++) {
          newTried.add(`${craftingSlots[i]}+${craftingSlots[j]}`);
          newTried.add(`${craftingSlots[j]}+${craftingSlots[i]}`);
        }
      }

      // Also infer combinations from the new result
      const newDiscoveredSet = new Set([...discoveredEmotions, result]);
      const inferred = inferTriedCombinations(newDiscoveredSet);
      const merged = new Set([...newTried, ...inferred]);

      setTriedCombinations(merged);
      localStorage.setItem(
        "triedCombinations",
        JSON.stringify(Array.from(merged))
      );

      if (wasNew) {
        setTotalDiscoveries((prev) => prev + 1);
      }

      setIsCombining(false);

      // Clear slots immediately after combining
      setCraftingSlots([]);
      clearHighlight();
      setHasAttemptedCombine(false);
      autoCombineTriggered.current = false;

      // Scroll to result display after combining
      setTimeout(() => {
        if (resultDisplayRef.current) {
          const elementTop = resultDisplayRef.current.offsetTop;
          window.scrollTo({
            top: elementTop,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      setLastResult(null);
      setLastCombination([]);
      setIsNewDiscovery(false);
      setIsCombining(false);
    }
  };

  const removeSlot = (index: number) => {
    const newSlots = craftingSlots.filter((_, i) => i !== index);
    setCraftingSlots(newSlots);
    setLastResult(null);
    setLastCombination([]);
    setHasAttemptedCombine(false);
    autoCombineTriggered.current = false;
    if (newSlots.length === 0) {
      clearHighlight();
    }
  };

  const clearAll = () => {
    setCraftingSlots([]);
    setLastResult(null);
    setLastCombination([]);
    setIsNewDiscovery(false);
    setHasAttemptedCombine(false);
    autoCombineTriggered.current = false;
    clearHighlight();
  };

  // Auto-search in description mode
  useEffect(() => {
    if (finderMode === "text" && showFinderModal) {
      runEmotionFinder();
    }
  }, [finderTextSearch, finderTypeFilter, finderMode, showFinderModal]);

  useEffect(() => {
    if (craftingSlots.length === 0) {
      setHighlightedEmotion(null);
      setCombinableEmotions(new Set());
      setUnexploredEmotions(new Set());
    } else {
      // Update combinable emotions when crafting slots change
      const { combinable, unexplored } =
        getCombinableEmotionsWithAll(craftingSlots);
      setCombinableEmotions(combinable);
      setUnexploredEmotions(unexplored);
      if (!highlightedEmotion) {
        setHighlightedEmotion(craftingSlots[0]); // Use first slot as marker
      }
    }
  }, [craftingSlots.length, craftingSlots.join(",")]);

  const resetProgress = () => {
    if (
      confirm(
        "Are you sure you want to reset all discoveries? This cannot be undone."
      )
    ) {
      setDiscoveredEmotions(new Set(BASE_EMOTIONS));
      saveDiscoveries(new Set(BASE_EMOTIONS));
      setTriedCombinations(new Set());
      localStorage.removeItem("triedCombinations");
      clearAll();
    }
  };

  const getEmotionColor = (emotion: string) => {
    // Base emotions return their solid color
    if (BASE_EMOTIONS.includes(emotion)) {
      return BASE_EMOTION_COLORS[emotion] || DEFAULT_EMOTION_COLOR;
    }

    // Combined emotions get gradients from their base emotion ratios
    const ratios = getBaseEmotionRatios(emotion);
    if (ratios.length > 0) {
      return generateGradientFromRatios(ratios);
    }

    // Fallback for emotions that can't be traced
    return DEFAULT_EMOTION_COLOR;
  };

  // Helper function to get a solid color for borders (uses first base emotion or average)
  const getEmotionBorderColor = (emotion: string) => {
    if (BASE_EMOTIONS.includes(emotion)) {
      return BASE_EMOTION_COLORS[emotion] || DEFAULT_EMOTION_COLOR;
    }

    const baseComponents = getBaseEmotionComponents(emotion);
    if (baseComponents.length > 0) {
      return BASE_EMOTION_COLORS[baseComponents[0]] || DEFAULT_EMOTION_COLOR;
    }

    return DEFAULT_EMOTION_COLOR;
  };

  const hasCombinableOptions = (emotion: string): boolean => {
    const allEmotions = Array.from(discoveredEmotions);
    for (const otherEmotion of allEmotions) {
      if (otherEmotion !== emotion) {
        const result = getEmotionCombination(emotion, otherEmotion);
        if (result) {
          return true;
        }
      }
    }
    return false;
  };

  const getUndiscoveredEmotions = (emotion: string): string[] => {
    const undiscovered: string[] = [];
    const allEmotions = Array.from(discoveredEmotions);

    for (const otherEmotion of allEmotions) {
      if (otherEmotion !== emotion) {
        const result = getEmotionCombination(emotion, otherEmotion);
        if (result && !discoveredEmotions.has(result)) {
          undiscovered.push(result);
        }
      }
    }

    return undiscovered;
  };

  const allEmotions = Array.from(discoveredEmotions).sort((a, b) => {
    return a.localeCompare(b);
  });

  const filterEmotions = (emotions: string[]) => {
    let filtered = emotions;

    // Apply type filter (emotion/feeling/state)
    // Keep emotions and feelings in the same card - show both when filtering by either
    if (typeFilter !== "all") {
      filtered = filtered.filter((emotion) => {
        const itemType = getItemType(emotion);
        // If filtering by "emotion" or "feeling", show both emotions and feelings
        if (typeFilter === "emotion" || typeFilter === "feeling") {
          return itemType === "emotion" || itemType === "feeling";
        }
        // For "state", only show states
        return itemType === typeFilter;
      });
    }

    // Apply dimension value filters
    const selectedCount = getSelectedCount();
    if (selectedCount > 0) {
      filtered = filtered.filter((emotion) => {
        // Check if emotion matches ALL selected dimension values
        for (const dimension of Object.keys(
          selectedDimensionValues
        ) as DimensionType[]) {
          const selectedValue = selectedDimensionValues[dimension];
          if (selectedValue) {
            const emotionValue = getEmotionDimension(
              emotion,
              dimension,
              getBaseEmotionComponents,
              emotionDimensions
            );
            // If this dimension has a filter and the emotion doesn't match, exclude it
            if (emotionValue !== selectedValue) {
              return false;
            }
          }
        }
        return true;
      });
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (emotion) =>
          emotion.toLowerCase().includes(query) ||
          getFeelingDescription(emotion).toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  // Always show all base emotions (they'll fade out when in crafting slots)
  const filteredBaseEmotions = BASE_EMOTIONS;
  const filteredDiscoveredEmotions = allEmotions.filter(
    (e) => !BASE_EMOTIONS.includes(e)
  );

  const baseEmotionsListFiltered = filterEmotions(filteredBaseEmotions);
  const discoveredEmotionsListFiltered = filterEmotions(
    filteredDiscoveredEmotions
  );

  // Apply sorting
  const sortEmotions = (emotions: string[]): string[] => {
    if (sortOrder === "alphabetical") {
      return [...emotions].sort((a, b) => a.localeCompare(b));
    } else {
      // Available: combinable items first, then unavailable, then alphabetical within each group
      return [...emotions].sort((a, b) => {
        const aInSlots = craftingSlots.includes(a);
        const aCombinable = combinableEmotions.has(a);
        const aAvailable =
          craftingSlots.length === 0 || aInSlots || aCombinable;

        const bInSlots = craftingSlots.includes(b);
        const bCombinable = combinableEmotions.has(b);
        const bAvailable =
          craftingSlots.length === 0 || bInSlots || bCombinable;

        if (aAvailable && !bAvailable) return -1;
        if (!aAvailable && bAvailable) return 1;
        // If both available or both unavailable, sort alphabetically
        return a.localeCompare(b);
      });
    }
  };

  const baseEmotionsList = sortEmotions(baseEmotionsListFiltered);
  const discoveredEmotionsList = sortEmotions(discoveredEmotionsListFiltered);

  // Separate feelings from states
  const feelingsList = sortEmotions(
    discoveredEmotionsList.filter((e) => getItemType(e) === "feeling")
  );
  const statesList = sortEmotions(
    discoveredEmotionsList.filter((e) => getItemType(e) === "state")
  );

  // Loading screen component
  if (
    showLoading ||
    isLoading ||
    !feelingDescriptions ||
    !emotionDimensions ||
    !dimensionTooltips ||
    !dimensionValues ||
    !emotionGraph
  ) {
    return <LoadingScreen isLoading={isLoading} showLoading={showLoading} />;
  }

  return (
    <div className="App">
      <Header
        totalDiscoveries={totalDiscoveries}
        onReset={resetProgress}
        onFinderClick={() => {
          resetEmotionFinder();
          setShowFinderModal(true);
        }}
      />

      {/* Sticky Mini Crafting Bar */}
      <StickyCraftingBar
        craftingSlots={craftingSlots}
        onRemoveSlot={removeSlot}
        onClear={clearAll}
        onCombine={handleCombine}
        onScrollToCrafting={() => {
          craftingAreaRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
        isCombining={isCombining}
        getEmotionColor={getEmotionColor}
        getEmotionBorderColor={getEmotionBorderColor}
      />

      <main className="main-content">
        <section className="section crafting-section">
          <h2>Crafting Area</h2>
          <p className="crafting-instructions">
            Click emotions from below to add them to crafting slots, then combine them!
          </p>

          <div className="crafting-area" ref={craftingAreaRef}>
            <div className="crafting-slots-container">
              {craftingSlots.length === 0 ? (
                <div className="empty-crafting-area">
                  <p>Click emotions below to start crafting</p>
                </div>
              ) : (
                <>
                  {craftingSlots.map((emotion, index) => {
                    const ratios = getBaseEmotionRatios(emotion);
                    const showComposition =
                      ratios.length > 0 && !BASE_EMOTIONS.includes(emotion);

                    return (
                      <div key={index} className="crafting-slot-wrapper">
                        <div
                          className={`crafting-slot filled ${
                            recentlyAddedEmotion === emotion ? "just-added" : ""
                          }`}
                          style={
                            {
                              "--emotion-color": getEmotionColor(emotion),
                              "--emotion-border-color":
                                getEmotionBorderColor(emotion),
                            } as React.CSSProperties
                          }
                        >
                          <div
                            className="slot-emotion"
                            style={
                              {
                                "--emotion-color": getEmotionColor(emotion),
                                "--emotion-border-color":
                                  getEmotionBorderColor(emotion),
                              } as React.CSSProperties
                            }
                          >
                            {emotion}
                            <button
                              className="remove-button"
                              onClick={() => removeSlot(index)}
                              aria-label="Remove emotion"
                            >
                              ×
                            </button>
                          </div>
                          {showComposition && (
                            <div className="slot-composition">
                              <div className="slot-composition-label">
                                Composition:
                              </div>
                              <div className="slot-composition-list">
                                {ratios.map(
                                  ({ emotion: baseEmotion, ratio }) => (
                                    <div
                                      key={baseEmotion}
                                      className="slot-composition-item"
                                    >
                                      <EmotionShape
                                        emotion={baseEmotion}
                                        color={
                                          BASE_EMOTION_COLORS[baseEmotion] ||
                                          DEFAULT_EMOTION_COLOR
                                        }
                                        size={12}
                                      />
                                      <span className="slot-composition-emotion">
                                        {baseEmotion}
                                      </span>
                                      <span className="slot-composition-percentage">
                                        {(ratio * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        {index < craftingSlots.length - 1 && (
                          <div className="plus-icon-small">+</div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {isCombining && (
            <div className="loading-result">
              <div className="loading-spinner-large"></div>
              <p>Combining emotions...</p>
            </div>
          )}

          {lastResult && !isCombining && (
            <div
              ref={resultDisplayRef}
              className={`result-display ${
                isNewDiscovery ? "new-discovery" : ""
              }`}
            >
              {isNewDiscovery && <div className="new-badge">NEW!</div>}
              <div className="result-label">Result:</div>
              <div className="result-header">
                <div className="result-emotion">{lastResult}</div>
              </div>
              {lastCombination.length > 0 && (
                <div className="result-combination">
                  {lastCombination.map((emotion, index) => (
                    <span key={index} className="combination-emotion">
                      {emotion}
                      {index < lastCombination.length - 1 && (
                        <span className="combination-plus"> + </span>
                      )}
                    </span>
                  ))}
                  <span className="combination-equals"> = </span>
                  <span className="combination-result">{lastResult}</span>
                </div>
              )}
              <div className="result-description">
                <div className="result-description-label">Description:</div>
                {getFeelingDescription(lastResult)}
              </div>
              {(() => {
                const ratios = getBaseEmotionRatios(lastResult);
                if (ratios.length > 0) {
                  return (
                    <div className="result-ratios">
                      <div className="result-ratios-label">
                        Base Emotion Composition:
                      </div>
                      <div className="result-ratios-list">
                        {ratios.map(({ emotion, ratio }) => (
                          <div key={emotion} className="result-ratio-item">
                            <div className="result-ratio-emotion">
                              <EmotionShape
                                emotion={emotion}
                                color={
                                  BASE_EMOTION_COLORS[emotion] ||
                                  DEFAULT_EMOTION_COLOR
                                }
                                size={16}
                              />
                              <span>{emotion}</span>
                            </div>
                            <div className="result-ratio-bar-container">
                              <div
                                className="result-ratio-bar"
                                style={{
                                  width: `${ratio * 100}%`,
                                  backgroundColor:
                                    BASE_EMOTION_COLORS[emotion] ||
                                    DEFAULT_EMOTION_COLOR,
                                }}
                              />
                            </div>
                            <div className="result-ratio-percentage">
                              {(ratio * 100).toFixed(1)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              {(() => {
                // Display dimension tags for this emotion
                const dimensions: DimensionType[] = [
                  "valence",
                  "arousal",
                  "dominance",
                  "temporalFocus",
                  "motivationalDirection",
                  "certainty",
                  "intensity",
                  "socialContext",
                  "cognitiveAppraisal",
                  "embodiment",
                ];
                const dimensionValues = dimensions
                  .map((dim) => {
                    const value = getEmotionDimension(
                      lastResult,
                      dim,
                      getBaseEmotionComponents,
                      emotionDimensions
                    );
                    return value ? { dimension: dim, value } : null;
                  })
                  .filter(
                    (
                      item
                    ): item is { dimension: DimensionType; value: string } =>
                      item !== null
                  );

                // Always show dimensions section if there are any dimension values or type
                const itemType = getItemType(lastResult);
                if (dimensionValues.length > 0 || itemType) {
                  return (
                    <div className="result-dimensions">
                      <div className="result-dimensions-label">Dimensions:</div>
                      <div className="result-dimensions-tags">
                        {/* Add Type as first dimension */}
                        <span
                          className="result-dimension-tag"
                          onClick={() => setShowTypeModal(true)}
                          style={{ cursor: "pointer" }}
                        >
                          <span className="dimension-name">Type:</span>{" "}
                          <span className="dimension-value">
                            {itemType.charAt(0).toUpperCase() +
                              itemType.slice(1)}
                          </span>
                        </span>
                        {dimensionValues.map(({ dimension, value }) => (
                          <span
                            key={dimension}
                            className="result-dimension-tag"
                            onClick={() => setSelectedDimensionModal(dimension)}
                            style={{ cursor: "pointer" }}
                          >
                            <span className="dimension-name">
                              {getDimensionDisplayName(dimension)}:
                            </span>{" "}
                            <span className="dimension-value">
                              {getDimensionValueLabel(dimension, value)}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}

          {craftingSlots.length >= 2 &&
            hasAttemptedCombine &&
            !lastResult &&
            !isCombining && (
              <div className="no-result">
                <p>These emotions don't combine. Try different combinations!</p>
              </div>
            )}
        </section>

        {/* Dimension Filters Section */}
        <section className="section">
          <div className="section-header">
            <h2
              style={{
                cursor: "pointer",
                marginBottom: 0,
                display: "flex",
                alignItems: "center",
                gap: "0.125rem",
              }}
              onClick={() => setDimensionsExpanded(!dimensionsExpanded)}
            >
              Filter
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: dimensionsExpanded ? "rotate(90deg)" : "none",
                  fontSize: "1.25rem",
                  lineHeight: 1,
                  padding: "0.625rem 0.625rem 0.625rem 0.25rem",
                  minWidth: "44px",
                  minHeight: "44px",
                  transition: "transform 0.15s ease",
                }}
              >
                ›
              </span>
            </h2>
            {(getSelectedCount() > 0 || typeFilter !== "all") && (
              <button
                onClick={() => {
                  setSelectedDimensionValues({});
                  setTypeFilter("all");
                }}
                style={{
                  padding: "0.375rem 0.75rem",
                  fontSize: "0.75rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "4px",
                  backgroundColor: "#ffffff",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Clear All
              </button>
            )}
          </div>
          {dimensionsExpanded && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {/* Type Filter */}
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    marginBottom: "0.5rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Type
                  </label>
                  <button
                    onClick={() => setShowTypeFilterModal(true)}
                    style={{
                      cursor: "pointer",
                      fontSize: "0.7rem",
                      color: "#94a3b8",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      border: "1px solid #94a3b8",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                      background: "transparent",
                      padding: 0,
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = UI_COLORS.PRIMARY;
                      e.currentTarget.style.color = UI_COLORS.PRIMARY;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#94a3b8";
                      e.currentTarget.style.color = "#94a3b8";
                    }}
                  >
                    ?
                  </button>
                </div>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {(["all", "emotion", "feeling", "state"] as FilterType[]).map(
                    (filterValue) => {
                      const isSelected = typeFilter === filterValue;
                      return (
                        <button
                          key={filterValue}
                          className={`filter-button ${
                            isSelected ? "active" : ""
                          }`}
                          onClick={() => setTypeFilter(filterValue)}
                        >
                          {filterValue}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
              {dimensionValues &&
                (Object.keys(dimensionValues) as DimensionType[]).map(
                  (dimension) => (
                    <div key={dimension} style={{ position: "relative" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "0.75rem",
                            color: "#64748b",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {getDimensionDisplayName(dimension)}
                        </label>
                        <button
                          onClick={() => setSelectedDimensionModal(dimension)}
                          style={{
                            cursor: "pointer",
                            fontSize: "0.7rem",
                            color: "#94a3b8",
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            border: "1px solid #94a3b8",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            lineHeight: 1,
                            background: "transparent",
                            padding: 0,
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#667eea";
                            e.currentTarget.style.color = "#667eea";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#94a3b8";
                            e.currentTarget.style.color = "#94a3b8";
                          }}
                        >
                          ?
                        </button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        {dimensionValues &&
                          dimensionValues[dimension].map((value) => {
                            const isSelected =
                              selectedDimensionValues[dimension] === value;
                            return (
                              <button
                                key={value}
                                className={`filter-button ${isSelected ? "active" : ""}`}
                                onClick={() =>
                                  toggleDimensionValue(dimension, value)
                                }
                              >
                                {getDimensionValueLabel(dimension, value)}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )
                )}
            </div>
          )}
        </section>

        <section className="section base-section">
          <div style={{ marginBottom: "1rem" }}>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search emotions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="search-clear-button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="section-header">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                position: "relative",
              }}
            ></div>
            <div className="section-actions">
              <div
                className="sort-controls"
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: "#64748b",
                    fontWeight: "500",
                  }}
                >
                  Sort:
                </span>
                <button
                  className={`sort-button ${
                    sortOrder === "alphabetical" ? "active" : ""
                  }`}
                  onClick={() => setSortOrder("alphabetical")}
                  style={{
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.8125rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "4px",
                    backgroundColor:
                      sortOrder === "alphabetical"
                        ? UI_COLORS.PRIMARY
                        : UI_COLORS.BACKGROUND,
                    color: sortOrder === "alphabetical" ? "#ffffff" : "#64748b",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "all 0.15s ease",
                  }}
                >
                  A-Z
                </button>
                <button
                  className={`sort-button ${
                    sortOrder === "available" ? "active" : ""
                  }`}
                  onClick={() => setSortOrder("available")}
                  style={{
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.8125rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "4px",
                    backgroundColor:
                      sortOrder === "available"
                        ? UI_COLORS.PRIMARY
                        : UI_COLORS.BACKGROUND,
                    color: sortOrder === "available" ? "#ffffff" : "#64748b",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "all 0.15s ease",
                  }}
                >
                  Available
                </button>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.8125rem",
                    color: "#64748b",
                    marginLeft: "0.75rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showCombinableIndicators}
                    onChange={(e) =>
                      setShowCombinableIndicators(e.target.checked)
                    }
                    style={{ cursor: "pointer" }}
                  />
                  Show hint
                </label>
              </div>
            </div>
          </div>
          {craftingSlots.length > 0 && (
            <p className="highlight-hint">
              Showing feelings that combine with{" "}
              <strong>{craftingSlots.join(", ")}</strong>
            </p>
          )}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                marginBottom: "0.75rem",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#0f172a",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Emotions ({baseEmotionsList.length})
              <button
                onClick={() => setShowEmotionsModal(true)}
                style={{
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  color: "#94a3b8",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  border: "1px solid #94a3b8",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  background: "transparent",
                  padding: 0,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.color = "#667eea";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#94a3b8";
                  e.currentTarget.style.color = "#94a3b8";
                }}
              >
                ?
              </button>
            </h3>
            <div className="emotions-grid">
              {baseEmotionsList.map((emotion) => {
                const isHighlighted = craftingSlots.includes(emotion);
                const isCombinable = combinableEmotions.has(emotion);
                const isUnexplored = unexploredEmotions.has(emotion);
                const hasOptions = hasCombinableOptions(emotion);
                // Check if item should be faded out (selected items fade out, or not available when crafting)
                const isUnavailable =
                  craftingSlots.length > 0 &&
                  (isHighlighted || (!isHighlighted && !isCombinable));
                const isDisabled =
                  craftingSlots.length > 0 && !isHighlighted && !isCombinable;

                return (
                  <div
                    key={emotion}
                    className={`emotion-wrapper ${
                      isUnavailable ? "unavailable" : ""
                    }`}
                  >
                    <button
                      className={`base-emotion ${
                        isHighlighted ? "highlighted" : ""
                      } ${isCombinable ? "combinable" : ""} ${
                        isUnexplored ? "unexplored" : ""
                      } ${hasOptions ? "has-options" : ""} ${
                        isUnavailable ? "unavailable" : ""
                      }`}
                      disabled={isDisabled}
                      onClick={(e) => handleEmotionClick(emotion, e)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        viewFeelingDetails(emotion);
                      }}
                      onMouseEnter={() => handleEmotionHover(emotion)}
                      onMouseLeave={handleEmotionLeave}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedEmotionPopup(emotion);
                      }}
                      style={
                        {
                          "--emotion-color": getEmotionColor(emotion),
                          "--emotion-border-color":
                            getEmotionBorderColor(emotion),
                        } as React.CSSProperties
                      }
                    >
                      {BASE_EMOTIONS.includes(emotion) && (
                        <EmotionShape
                          emotion={emotion}
                          color={
                            isHighlighted
                              ? "white"
                              : getEmotionBorderColor(emotion)
                          }
                          size={14}
                        />
                      )}
                      {emotion}
                    </button>
                    {(() => {
                      if (
                        highlightedEmotion &&
                        highlightedEmotion !== emotion
                      ) {
                        // When another emotion is highlighted, show badge based on combination status with highlighted emotion
                        const result = getEmotionCombination(
                          highlightedEmotion,
                          emotion
                        );
                        const isNew = result && !discoveredEmotions.has(result);

                        if (result && isNew && showCombinableIndicators) {
                          // Can combine to create new emotion - show surprise symbol
                          return (
                            <span
                              className="emotion-badge combinable-badge"
                              title={`Can discover: ${result}`}
                            >
                              !
                            </span>
                          );
                        }
                        // Don't show badge if already tried/discovered
                      } else if (!isHighlighted) {
                        // When no emotion is highlighted, show badges based on combination options
                        if (hasOptions && showCombinableIndicators) {
                          const undiscovered = getUndiscoveredEmotions(emotion);
                          if (undiscovered.length > 0) {
                            // Show star badge if can combine with other emotions to discover new ones
                            return (
                              <span
                                className="emotion-badge combinable-badge"
                                title="Can combine with other emotions"
                              >
                                !
                              </span>
                            );
                          }
                          // Don't show badge if all combinations are finished
                        }
                        // If hasOptions is false, don't show any badge (nothing to combine with)
                      }
                      return null;
                    })()}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ marginTop: "2rem" }}>
            <h3
              style={{
                marginBottom: "0.75rem",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#0f172a",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Feelings ({feelingsList.length})
              <button
                onClick={() => setShowFeelingsModal(true)}
                style={{
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  color: "#94a3b8",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  border: "1px solid #94a3b8",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  background: "transparent",
                  padding: 0,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.color = "#667eea";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#94a3b8";
                  e.currentTarget.style.color = "#94a3b8";
                }}
              >
                ?
              </button>
            </h3>
            <div className="emotions-list">
              {feelingsList.length > 0 ? (
                feelingsList.map((emotion) => {
                  const isHighlighted = craftingSlots.includes(emotion);
                  const isCombinable = combinableEmotions.has(emotion);
                  const isUnexplored = unexploredEmotions.has(emotion);
                  const hasOptions = hasCombinableOptions(emotion);
                  // Check if item should be faded out (selected items or not available when crafting)
                  const isUnavailable =
                    craftingSlots.length > 0 &&
                    (isHighlighted || (!isHighlighted && !isCombinable));
                  const isDisabled =
                    craftingSlots.length > 0 && !isHighlighted && !isCombinable;

                  return (
                    <div
                      key={emotion}
                      className={`emotion-wrapper ${
                        isUnavailable ? "unavailable" : ""
                      }`}
                    >
                      <button
                        className={`discovered-emotion ${
                          isHighlighted ? "highlighted" : ""
                        } ${isCombinable ? "combinable" : ""} ${
                          isUnexplored ? "unexplored" : ""
                        } ${hasOptions ? "has-options" : ""} ${
                          isUnavailable ? "unavailable" : ""
                        }`}
                        disabled={isDisabled}
                        onClick={(e) => handleEmotionClick(emotion, e)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          viewFeelingDetails(emotion);
                        }}
                        onMouseEnter={() => handleEmotionHover(emotion)}
                        onMouseLeave={handleEmotionLeave}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedEmotionPopup(emotion);
                        }}
                        style={
                          {
                            "--emotion-color": getEmotionColor(emotion),
                            "--emotion-border-color":
                              getEmotionBorderColor(emotion),
                          } as React.CSSProperties
                        }
                      >
                        {BASE_EMOTIONS.includes(emotion) ? (
                          <EmotionShape
                            emotion={emotion}
                            color={
                              isHighlighted
                                ? "white"
                                : getEmotionBorderColor(emotion)
                            }
                            size={14}
                          />
                        ) : (
                          <BlendedEmotionShape
                            emotion={emotion}
                            color={
                              isHighlighted
                                ? "white"
                                : getEmotionBorderColor(emotion)
                            }
                            size={14}
                            getBaseEmotionRatios={getBaseEmotionRatios}
                          />
                        )}
                        {emotion}
                      </button>
                      {(() => {
                        if (
                          highlightedEmotion &&
                          highlightedEmotion !== emotion
                        ) {
                          // When another emotion is highlighted, show badge based on combination status with highlighted emotion
                          const result = getEmotionCombination(
                            highlightedEmotion,
                            emotion
                          );
                          const isNew =
                            result && !discoveredEmotions.has(result);

                          if (result && isNew && showCombinableIndicators) {
                            // Can combine to create new emotion - show surprise symbol
                            return (
                              <span
                                className="emotion-badge combinable-badge"
                                title={`Can discover: ${result}`}
                              >
                                !
                              </span>
                            );
                          }
                          // Don't show badge if already tried/discovered
                        } else if (!isHighlighted) {
                          // When no emotion is highlighted, show badges based on combination options
                          if (isUnexplored && showCombinableIndicators) {
                            // Show surprise symbol for unexplored feelings
                            return (
                              <span
                                className="emotion-badge combinable-badge"
                                title="Undiscovered feeling - can combine to discover"
                              >
                                !
                              </span>
                            );
                          } else if (hasOptions && showCombinableIndicators) {
                            const undiscovered =
                              getUndiscoveredEmotions(emotion);
                            if (undiscovered.length > 0) {
                              // Show surprise symbol badge if can combine with other emotions to discover new ones
                              return (
                                <span
                                  className="emotion-badge combinable-badge"
                                  title="Can combine with other emotions"
                                >
                                  !
                                </span>
                              );
                            }
                            // Don't show badge if all combinations are finished
                          }
                          // If hasOptions is false, don't show any badge (nothing to combine with)
                        }
                        return null;
                      })()}
                    </div>
                  );
                })
              ) : (
                <p className="empty-state">
                  Combine feelings to discover new ones!
                </p>
              )}
            </div>
          </div>
          <div style={{ marginTop: "2rem" }}>
            <h3
              style={{
                marginBottom: "0.75rem",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#0f172a",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              State ({statesList.length})
              <button
                onClick={() => setShowStatesModal(true)}
                style={{
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  color: "#94a3b8",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  border: "1px solid #94a3b8",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  background: "transparent",
                  padding: 0,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.color = "#667eea";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#94a3b8";
                  e.currentTarget.style.color = "#94a3b8";
                }}
              >
                ?
              </button>
            </h3>
            <div className="emotions-list">
              {statesList.length > 0 ? (
                statesList.map((emotion) => {
                  const isHighlighted = craftingSlots.includes(emotion);
                  const isCombinable = combinableEmotions.has(emotion);
                  const isUnexplored = unexploredEmotions.has(emotion);
                  const hasOptions = hasCombinableOptions(emotion);
                  // Check if item should be faded out (selected items or not available when crafting)
                  const isUnavailable =
                    craftingSlots.length > 0 &&
                    (isHighlighted || (!isHighlighted && !isCombinable));
                  const isDisabled =
                    craftingSlots.length > 0 && !isHighlighted && !isCombinable;

                  return (
                    <div
                      key={emotion}
                      className={`emotion-wrapper ${
                        isUnavailable ? "unavailable" : ""
                      }`}
                    >
                      <button
                        className={`discovered-emotion ${
                          isHighlighted ? "highlighted" : ""
                        } ${isCombinable ? "combinable" : ""} ${
                          isUnexplored ? "unexplored" : ""
                        } ${hasOptions ? "has-options" : ""} ${
                          isUnavailable ? "unavailable" : ""
                        }`}
                        disabled={isDisabled}
                        onClick={(e) => handleEmotionClick(emotion, e)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          viewFeelingDetails(emotion);
                        }}
                        onMouseEnter={() => handleEmotionHover(emotion)}
                        onMouseLeave={handleEmotionLeave}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedEmotionPopup(emotion);
                        }}
                        style={
                          {
                            "--emotion-color": getEmotionColor(emotion),
                            "--emotion-border-color":
                              getEmotionBorderColor(emotion),
                          } as React.CSSProperties
                        }
                      >
                        {BASE_EMOTIONS.includes(emotion) ? (
                          <EmotionShape
                            emotion={emotion}
                            color={
                              isHighlighted
                                ? "white"
                                : getEmotionBorderColor(emotion)
                            }
                            size={14}
                          />
                        ) : (
                          <BlendedEmotionShape
                            emotion={emotion}
                            color={
                              isHighlighted
                                ? "white"
                                : getEmotionBorderColor(emotion)
                            }
                            size={14}
                            getBaseEmotionRatios={getBaseEmotionRatios}
                          />
                        )}
                        {emotion}
                      </button>
                      {(() => {
                        if (
                          highlightedEmotion &&
                          highlightedEmotion !== emotion
                        ) {
                          // When another emotion is highlighted, show badge based on combination status with highlighted emotion
                          const result = getEmotionCombination(
                            highlightedEmotion,
                            emotion
                          );
                          const isNew =
                            result && !discoveredEmotions.has(result);

                          if (result && isNew && showCombinableIndicators) {
                            // Can combine to create new emotion - show surprise symbol
                            return (
                              <span
                                className="emotion-badge combinable-badge"
                                title={`Can discover: ${result}`}
                              >
                                !
                              </span>
                            );
                          }
                          // Don't show badge if already tried/discovered
                        } else if (!isHighlighted) {
                          // When no emotion is highlighted, show badges based on combination options
                          if (isUnexplored && showCombinableIndicators) {
                            // Show surprise symbol for unexplored feelings
                            return (
                              <span
                                className="emotion-badge combinable-badge"
                                title="Undiscovered feeling - can combine to discover"
                              >
                                !
                              </span>
                            );
                          } else if (hasOptions && showCombinableIndicators) {
                            const undiscovered =
                              getUndiscoveredEmotions(emotion);
                            if (undiscovered.length > 0) {
                              // Show surprise symbol badge if can combine with other emotions to discover new ones
                              return (
                                <span
                                  className="emotion-badge combinable-badge"
                                  title="Can combine with other emotions"
                                >
                                  !
                                </span>
                              );
                            }
                          }
                          // Don't show badge if all combinations are finished
                        }
                        // If hasOptions is false, don't show any badge (nothing to combine with)
                        return null;
                      })()}
                    </div>
                  );
                })
              ) : (
                <p className="empty-state">
                  Combine feelings to discover new states!
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Centered Emotion Popup Overlay */}
      {selectedEmotionPopup && (
        <div className="emotion-popup-overlay" onClick={closeEmotionPopup}>
          <div
            className="emotion-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="emotion-popup-close" onClick={closeEmotionPopup}>
              ×
            </button>
            <div className="emotion-popup-content-inner">
              <div className="emotion-popup-title">{selectedEmotionPopup}</div>
              <div className="emotion-popup-description">
                <p style={{ marginBottom: 0 }}>
                  {getFeelingDescription(selectedEmotionPopup)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emotions Modal */}
      {showEmotionsModal && (
        <div
          className="emotion-popup-overlay"
          onClick={() => setShowEmotionsModal(false)}
        >
          <div
            className="emotion-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="emotion-popup-close"
              onClick={() => setShowEmotionsModal(false)}
            >
              ×
            </button>
            <div className="emotion-popup-content-inner">
              <div className="emotion-popup-title">Emotions</div>
              <div className="emotion-popup-description">
                <p style={{ marginBottom: "1rem" }}>
                  Emotions are complex psychological states that involve
                  subjective experience, physiological responses, and behavioral
                  expressions. They are fundamental human experiences that arise
                  from our interactions with the world around us.
                </p>
                <p style={{ marginBottom: 0 }}>
                  Base emotions like <strong>Joy</strong>, <strong>Trust</strong>,{" "}
                  <strong>Fear</strong>, <strong>Surprise</strong>,{" "}
                  <strong>Sadness</strong>, <strong>Disgust</strong>,{" "}
                  <strong>Anger</strong>, and <strong>Anticipation</strong> form
                  the foundation of our emotional landscape and can be combined to
                  create more nuanced feelings and states.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feelings Modal */}
      {showFeelingsModal && (
        <div
          className="emotion-popup-overlay"
          onClick={() => setShowFeelingsModal(false)}
        >
          <div
            className="emotion-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="emotion-popup-close"
              onClick={() => setShowFeelingsModal(false)}
            >
              ×
            </button>
            <div className="emotion-popup-content-inner">
              <div className="emotion-popup-title">Feelings</div>
              <div className="emotion-popup-description">
                <p style={{ marginBottom: "1rem" }}>
                  Feelings are the personal, subjective experience of emotions
                  combined with individual context and meaning. They represent how
                  we interpret and experience emotions in our daily lives.
                </p>
                <p style={{ marginBottom: 0 }}>
                  Feelings are often more complex than base emotions, as they can
                  be combinations of multiple emotions or emotions filtered
                  through our personal experiences, memories, and cultural
                  background.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* States Modal */}
      {showStatesModal && (
        <div
          className="emotion-popup-overlay"
          onClick={() => setShowStatesModal(false)}
        >
          <div
            className="emotion-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="emotion-popup-close"
              onClick={() => setShowStatesModal(false)}
            >
              ×
            </button>
            <div className="emotion-popup-content-inner">
              <div className="emotion-popup-title">State</div>
              <div className="emotion-popup-description">
                <p style={{ marginBottom: "1rem" }}>
                  States are more stable and enduring emotional conditions that
                  represent a particular way of being or existing. Unlike fleeting
                  emotions or feelings, states often describe a sustained
                  condition or quality of experience.
                </p>
                <p style={{ marginBottom: 0 }}>
                  They can be the result of combining multiple emotions and
                  feelings, creating a more persistent emotional landscape that
                  shapes how we perceive and interact with the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emotion Finder Modal */}
      {showFinderModal && (
        <div
          className="emotion-popup-overlay"
          onClick={() => setShowFinderModal(false)}
        >
          <div
            className="emotion-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="emotion-popup-close"
              onClick={() => setShowFinderModal(false)}
            >
              ×
            </button>
            <div className="emotion-popup-content-inner">
              <div className="emotion-popup-title">Emotion Finder</div>
              <div
                className="emotion-popup-description"
                style={{ display: "grid", gap: "1rem" }}
              >
              {/* Mode Toggle */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <label
                  style={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#0f172a",
                  }}
                >
                  Search Mode
                </label>
                <div className="finder-mode-toggle">
                  <button
                    className={`finder-mode-button ${
                      finderMode === "dimensions" ? "active" : ""
                    }`}
                    onClick={() => setFinderMode("dimensions")}
                  >
                    Dimensions
                  </button>
                  <button
                    className={`finder-mode-button ${
                      finderMode === "text" ? "active" : ""
                    }`}
                    onClick={() => setFinderMode("text")}
                  >
                    Description
                  </button>
                </div>
              </div>

              {/* Dimensions Mode */}
              {finderMode === "dimensions" && (
                <>
                  <p
                    style={{
                      marginBottom: 0,
                      fontSize: "0.875rem",
                      color: "#64748b",
                    }}
                  >
                    Pick dimension values to see emotions that match those
                    attributes. Leave any blank to ignore it.
                  </p>
                  {/* Type Filter */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.125rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <label style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                        Type
                      </label>
                      <button
                        className={`finder-description-toggle ${
                          expandedDescriptions.has("type") ? "rotated" : ""
                        }`}
                        onClick={() => {
                          const key = "type";
                          setExpandedDescriptions((prev) => {
                            const next = new Set(prev);
                            if (next.has(key)) {
                              next.delete(key);
                            } else {
                              next.add(key);
                            }
                            return next;
                          });
                        }}
                        aria-label="Toggle description"
                      >
                        ›
                      </button>
                    </div>
                    {expandedDescriptions.has("type") && (
                      <p className="finder-description-text">
                        <strong>Emotion:</strong> Base psychological states (Joy,
                        Trust, Fear, etc.). <strong>Feeling:</strong> Personal,
                        subjective experiences of emotions.{" "}
                        <strong>State:</strong> More stable, enduring emotional
                        conditions.
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.35rem",
                      }}
                    >
                      {(
                        ["all", "emotion", "feeling", "state"] as FilterType[]
                      ).map((type) => {
                        const isActive = finderTypeFilter === type;
                        return (
                          <button
                            key={type}
                            className={`filter-button ${
                              isActive ? "active" : ""
                            }`}
                            onClick={() => setFinderTypeFilter(type)}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: "1rem" }}>
                    {finderDimensions.map((dimension) => (
                      <div
                        key={dimension}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.125rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <label
                            style={{ fontWeight: 700, fontSize: "0.9rem" }}
                          >
                            {getDimensionDisplayName(dimension)}
                          </label>
                          <button
                            className={`finder-description-toggle ${
                              expandedDescriptions.has(dimension)
                                ? "rotated"
                                : ""
                            }`}
                            onClick={() => {
                              setExpandedDescriptions((prev) => {
                                const next = new Set(prev);
                                if (next.has(dimension)) {
                                  next.delete(dimension);
                                } else {
                                  next.add(dimension);
                                }
                                return next;
                              });
                            }}
                            aria-label="Toggle description"
                          >
                            ›
                          </button>
                        </div>
                        {dimensionTooltips &&
                          dimensionTooltips[dimension] &&
                          expandedDescriptions.has(dimension) && (
                            <p className="finder-description-text">
                              {dimensionTooltips[dimension]
                                .split("Example:")[0]
                                .trim()}
                            </p>
                          )}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.35rem",
                          }}
                        >
                          {(dimensionValues?.[dimension] || []).map((val) => {
                            const isActive =
                              finderSelections[dimension] === val;
                            return (
                              <button
                                key={val}
                                className={`filter-button ${
                                  isActive ? "active" : ""
                                }`}
                                onClick={() =>
                                  setFinderSelections((prev) => ({
                                    ...prev,
                                    [dimension]: isActive ? undefined : val,
                                  }))
                                }
                              >
                                {getDimensionValueLabel(dimension, val)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Description Mode */}
              {finderMode === "text" && (
                <>
                  <p
                    style={{
                      marginBottom: 0,
                      fontSize: "0.875rem",
                      color: "#64748b",
                    }}
                  >
                    Search for emotions, feelings, or states by name or
                    description.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      className="finder-text-search-container"
                      style={{ flex: "1 1 auto", minWidth: "200px" }}
                    >
                      <input
                        type="text"
                        className="finder-text-search-input"
                        placeholder="Search by name or description..."
                        value={finderTextSearch}
                        onChange={(e) => setFinderTextSearch(e.target.value)}
                      />
                      {finderTextSearch && (
                        <button
                          className="finder-text-search-clear-button"
                          onClick={() => setFinderTextSearch("")}
                          aria-label="Clear search"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <button
                      className="reset-button"
                      onClick={resetEmotionFinder}
                      style={{ flexShrink: 0 }}
                    >
                      Clear
                    </button>
                  </div>
                </>
              )}
              {/* Buttons for Dimensions Mode */}
              {finderMode === "dimensions" && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginTop: "0.25rem",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <button className="combine-button" onClick={runEmotionFinder}>
                    Find
                  </button>
                  <button className="reset-button" onClick={resetEmotionFinder}>
                    Clear
                  </button>
                </div>
              )}
              <div style={{ marginTop: "0.5rem" }}>
                {finderResults.length === 0 ? (
                  <p style={{ marginBottom: 0, color: "#94a3b8" }}>
                    {finderMode === "dimensions"
                      ? "No matches yet. Choose dimension values and click Find."
                      : "No matches yet. Start typing to search."}
                  </p>
                ) : (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}
                  >
                    {finderResults.map((emotion) => (
                      <EmotionChip
                        key={emotion}
                        emotion={emotion}
                        onClick={() => handleFinderEmotionSelect(emotion)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={null}>
        <Modals
          showTypeModal={showTypeModal}
          setShowTypeModal={setShowTypeModal}
          showTypeFilterModal={showTypeFilterModal}
          setShowTypeFilterModal={setShowTypeFilterModal}
          showEmotionsModal={showEmotionsModal}
          setShowEmotionsModal={setShowEmotionsModal}
          showFeelingsModal={showFeelingsModal}
          setShowFeelingsModal={setShowFeelingsModal}
          showStatesModal={showStatesModal}
          setShowStatesModal={setShowStatesModal}
          selectedEmotionPopup={selectedEmotionPopup}
          setSelectedEmotionPopup={setSelectedEmotionPopup}
          selectedDimensionModal={selectedDimensionModal}
          setSelectedDimensionModal={setSelectedDimensionModal}
          dimensionTooltips={dimensionTooltips}
          getDimensionDisplayName={getDimensionDisplayName}
          formatDimensionTooltip={formatDimensionTooltip}
          getFeelingDescription={getFeelingDescription}
        />
      </Suspense>
    </div>
  );
};

export default App;
