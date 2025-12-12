import type { DimensionType } from "./types";

// Dimension tooltips
export const DIMENSION_TOOLTIPS: { [key in DimensionType]: string } = {
  valence:
    "Pleasure–Displeasure: Measures how pleasant or unpleasant an emotion feels. Positive emotions are enjoyable (joy, love), negative emotions are distressing (sadness, fear), and neutral emotions lack strong positive or negative qualities.",
  arousal:
    "Activation: The energy level or intensity of an emotion. High arousal emotions are intense and energizing (excitement, anger), while low arousal emotions are calm and subdued (serenity, sadness).",
  dominance:
    "Control: The sense of power or control in a situation. High dominance means feeling in control and confident, while low dominance means feeling powerless or helpless.",
  temporalFocus:
    "Temporal Focus: The time orientation of an emotion. Past-focused emotions reflect on previous experiences (nostalgia, regret), present-focused emotions are grounded in the current moment (contentment, anxiety), and future-focused emotions anticipate what's to come (anticipation, hope).",
  motivationalDirection:
    "Motivational Direction: The behavioral tendency an emotion creates. Approach emotions motivate moving toward something (desire, curiosity), avoidance emotions motivate moving away (fear, disgust), and neutral emotions don't strongly push in either direction.",
  certainty:
    "Certainty / Predictability: How predictable or certain the emotional situation feels. Predictable emotions come from known, expected situations, while uncertain or ambiguous emotions arise from unclear or unpredictable circumstances.",
  intensity:
    "Intensity / Strength: The strength or magnitude of the emotional experience. Weak emotions are mild and subtle, while strong emotions are powerful and overwhelming.",
  socialContext:
    "Social / Interpersonal Context: Whether the emotion is directed toward others or experienced internally. Social emotions involve relationships and interactions with others (affection, jealousy), while individual emotions are more personal and internal (pride, self-compassion).",
  cognitiveAppraisal:
    "Cognitive Appraisal / Meaning: How the situation is interpreted or evaluated. Positive appraisal sees value and benefit in the situation, negative appraisal sees threat or loss, and neutral appraisal lacks strong positive or negative judgment.",
  embodiment:
    "Embodiment / Somatic Awareness: The degree of physical sensation or bodily awareness associated with the emotion. High embodiment involves strong physical sensations (heart racing, tense muscles), while low embodiment has minimal bodily awareness.",
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
