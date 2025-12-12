export const BASE_EMOTIONS: string[] = [
  "Joy",
  "Fear",
  "Sadness",
  "Disgust",
  "Anger",
  "Surprise",
];

export const BASE_EMOTION_COLORS: Record<string, string> = {
  Joy: "#fbbf24",
  Fear: "#8b5cf6",
  Surprise: "#ec4899",
  Sadness: "#06b6d4",
  Disgust: "#10b981",
  Anger: "#ef4444",
};

// Default colors for emotions without specific colors
export const DEFAULT_EMOTION_COLOR = "#667eea";
export const DEFAULT_GRADIENT_COLOR = "#764ba2";

// UI Colors
export const UI_COLORS = {
  PRIMARY: "#667eea",
  PRIMARY_HOVER: "#5568d3",
  TEXT_DARK: "#0f172a",
  TEXT_MEDIUM: "#64748b",
  TEXT_LIGHT: "#94a3b8",
  BORDER: "#e2e8f0",
  BACKGROUND: "#ffffff",
  BACKGROUND_LIGHT: "#f8fafc",
  BACKGROUND_GRAY: "#e5e7eb",
  TEXT_GRAY: "#374151",
} as const;

export type EmotionShape = "circle" | "triangleDown" | "star" | "hexagon" | "triangleUp" | "oval";

export const BASE_EMOTION_SHAPES: Record<string, EmotionShape> = {
  Joy: "circle",
  Fear: "triangleDown",
  Surprise: "star",
  Sadness: "oval",
  Disgust: "hexagon",
  Anger: "triangleUp",
};

export type FilterType = "emotion" | "feeling" | "state" | "all";

export const FILTER_TYPES: FilterType[] = ["all", "emotion", "feeling", "state"];

export const SORT_ORDERS = ["alphabetical", "available"] as const;
export type SortOrder = typeof SORT_ORDERS[number];

export const MODES = ["view", "craft"] as const;
export type Mode = typeof MODES[number];
