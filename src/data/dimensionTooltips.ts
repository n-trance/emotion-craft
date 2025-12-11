import type { DimensionType } from "./types";

// Dimension tooltips
export const DIMENSION_TOOLTIPS: { [key in DimensionType]: string } = {
  valence:
    "Pleasure–Displeasure: The pleasantness or unpleasantness of an emotion. Positive emotions feel good, negative emotions feel bad.",
  arousal:
    "Activation: High ↔ Low energy or intensity. Example: Excitement (high) vs. calm (low).",
  dominance:
    "Control: Feeling in control ↔ Powerless. Example: Confident vs. helpless.",
  temporalFocus:
    "Temporal Focus: Past ↔ Present ↔ Future. Example: Nostalgia (past) vs. anticipation (future).",
  motivationalDirection:
    "Motivational Direction: Approach ↔ Avoidance. Example: Desire to connect vs. desire to escape.",
  certainty:
    "Certainty / Predictability: Predictable ↔ Uncertain / ambiguous. Example: Calm confidence vs. anxious uncertainty.",
  intensity:
    "Intensity / Strength: Weak ↔ Strong. Example: Mild contentment vs. ecstatic joy.",
  socialContext:
    "Social / Interpersonal Context: Social / relational ↔ Individual / internal. Example: Affection (toward others) vs. personal pride.",
  cognitiveAppraisal:
    "Cognitive Appraisal / Meaning: Positive interpretation ↔ Negative interpretation. Significance or relevance of the feeling.",
  embodiment:
    "Embodiment / Somatic Awareness: Awareness of bodily sensations associated with the feeling. Example: Heart racing (excitement) vs. relaxed muscles (calm).",
};

// Dimension value options
export const DIMENSION_VALUES: { [key in DimensionType]: string[] } = {
  valence: ["positive", "negative", "neutral"],
  arousal: ["high", "medium", "low"],
  dominance: ["high", "medium", "low"],
  temporalFocus: ["past", "present", "future"],
  motivationalDirection: ["approach", "avoidance", "neutral"],
  certainty: ["predictable", "uncertain", "ambiguous"],
  intensity: ["weak", "medium", "strong"],
  socialContext: ["social", "individual"],
  cognitiveAppraisal: ["positive", "negative", "neutral"],
  embodiment: ["high", "medium", "low"],
};
