import { BASE_EMOTION_COLORS, DEFAULT_EMOTION_COLOR, DEFAULT_GRADIENT_COLOR } from "../constants/emotions";
import type { DimensionType } from "../data/types";

export const getEmotionColor = (emotion: string): string => {
  return BASE_EMOTION_COLORS[emotion] || DEFAULT_EMOTION_COLOR;
};

export const inferDimensionFromComponents = (
  baseComponents: string[],
  dimension: DimensionType,
  emotionDimensions: { [key: string]: { [dimension in DimensionType]?: string } } | null
): string | null => {
  if (baseComponents.length === 0 || !emotionDimensions) return null;

  const values = baseComponents
    .map((comp) => emotionDimensions[comp]?.[dimension])
    .filter((v): v is string => v !== undefined);

  if (values.length === 0) return null;

  // Special inference logic for different dimensions
  switch (dimension) {
    case "valence":
      const allPositive = values.every((v) => v === "positive");
      const allNegative = values.every((v) => v === "negative");
      if (allPositive) return "positive";
      if (allNegative) return "negative";
      return "neutral";

    case "arousal":
    case "dominance":
    case "intensity":
    case "embodiment":
      if (values.includes("high")) return "high";
      if (values.includes("medium")) return "medium";
      if (values.includes("low")) return "low";
      return values[0];

    case "temporalFocus":
      if (values.includes("present")) return "present";
      if (values.includes("future")) return "future";
      if (values.includes("past")) return "past";
      return values[0];

    case "motivationalDirection":
      const allApproach = values.every((v) => v === "approach");
      const allAvoidance = values.every((v) => v === "avoidance");
      if (allApproach) return "approach";
      if (allAvoidance) return "avoidance";
      return "neutral";

    case "certainty":
      if (values.includes("uncertain") || values.includes("ambiguous"))
        return "uncertain";
      return "predictable";

    case "socialContext":
      if (values.includes("social")) return "social";
      return "individual";

    case "cognitiveAppraisal":
      const allPos = values.every((v) => v === "positive");
      const allNeg = values.every((v) => v === "negative");
      if (allPos) return "positive";
      if (allNeg) return "negative";
      return "neutral";

    default:
      return values[0];
  }
};

export const getEmotionDimension = (
  emotion: string,
  dimension: DimensionType,
  getBaseEmotionComponents: (emotion: string) => string[],
  emotionDimensions: { [key: string]: { [dimension in DimensionType]?: string } } | null
): string | null => {
  if (!emotionDimensions) return null;
  
  // Check direct mapping first
  if (emotionDimensions[emotion] && emotionDimensions[emotion][dimension]) {
    return emotionDimensions[emotion][dimension] || null;
  }

  // For combined emotions, infer from base components
  const baseComponents = getBaseEmotionComponents(emotion);
  if (baseComponents.length > 0) {
    return inferDimensionFromComponents(baseComponents, dimension, emotionDimensions);
  }

  return null;
};

export const generateGradientFromRatios = (
  ratios: Array<{ emotion: string; ratio: number }>
): string => {
  if (ratios.length === 0) return `linear-gradient(135deg, ${DEFAULT_EMOTION_COLOR}, ${DEFAULT_GRADIENT_COLOR})`;
  if (ratios.length === 1) {
    return BASE_EMOTION_COLORS[ratios[0].emotion] || DEFAULT_EMOTION_COLOR;
  }

  const sortedRatios = [...ratios].sort((a, b) => b.ratio - a.ratio);
  const stops: string[] = [];
  let cumulative = 0;

  sortedRatios.forEach(({ emotion, ratio }, index) => {
    const color = BASE_EMOTION_COLORS[emotion] || DEFAULT_EMOTION_COLOR;
    const endPercent = cumulative + ratio * 100;

    if (index === 0) {
      stops.push(`${color} 0%`);
    }

    if (index === sortedRatios.length - 1) {
      stops.push(`${color} 100%`);
    } else {
      stops.push(`${color} ${endPercent}%`);
    }

    cumulative = endPercent;
  });

  return `linear-gradient(135deg, ${stops.join(", ")})`;
};
