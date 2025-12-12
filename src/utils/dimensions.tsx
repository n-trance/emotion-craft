import type { DimensionType } from "../data/types";

export const getDimensionDisplayName = (dimension: DimensionType): string => {
  const nameMap: { [key in DimensionType]: string } = {
    valence: "Valence",
    arousal: "Arousal",
    dominance: "Dominance",
    temporalFocus: "Temporal Focus",
    motivationalDirection: "Motivational Direction",
    certainty: "Certainty",
    intensity: "Intensity",
    socialContext: "Social Context",
    cognitiveAppraisal: "Cognitive Appraisal",
    embodiment: "Embodiment",
  };
  return nameMap[dimension];
};

export const formatDimensionTooltip = (tooltip: string): JSX.Element => {
  // Check if there's an "Example:" section
  const exampleIndex = tooltip.search(/Example:/i);
  
  if (exampleIndex !== -1) {
    // Split the tooltip into description and example parts
    const description = tooltip.substring(0, exampleIndex).trim();
    const exampleText = tooltip.substring(exampleIndex).replace(/^Example:\s*/i, '').trim();
    
    // Format description part (may have a title before colon)
    const descParts = description.split(':');
    let formattedDesc;
    if (descParts.length >= 2) {
      const title = descParts[0].trim();
      const descText = descParts.slice(1).join(':').trim();
      formattedDesc = (
        <>
          <strong>{title}:</strong> {descText}
        </>
      );
    } else {
      formattedDesc = description;
    }
    
    return (
      <>
        <p style={{ marginBottom: "1rem" }}>
          {formattedDesc}
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong>Example:</strong> {exampleText}
        </p>
      </>
    );
  }
  
  // No example found, format the whole text
  const parts = tooltip.split(':');
  if (parts.length >= 2) {
    const title = parts[0].trim();
    const rest = parts.slice(1).join(':').trim();
    return (
      <p style={{ marginBottom: 0 }}>
        <strong>{title}:</strong> {rest}
      </p>
    );
  }
  
  // Fallback: just return the text as a paragraph
  return <p style={{ marginBottom: 0 }}>{tooltip}</p>;
};

export const getDimensionValueLabel = (
  dimension: DimensionType,
  value: string
): string => {
  // Special cases for values that appear in multiple dimensions
  const labelMap: { [key: string]: { [dim: string]: string } } = {
    positive: {
      valence: "Positive",
      cognitiveAppraisal: "Positive",
    },
    negative: {
      valence: "Negative",
      cognitiveAppraisal: "Negative",
    },
    neutral: {
      valence: "Neutral",
      motivationalDirection: "Neutral",
      cognitiveAppraisal: "Neutral",
    },
    high: {
      arousal: "High",
      dominance: "High",
      embodiment: "High",
    },
    medium: {
      arousal: "Medium",
      dominance: "Medium",
      intensity: "Medium",
      embodiment: "Medium",
    },
    low: {
      arousal: "Low",
      dominance: "Low",
      embodiment: "Low",
    },
    approach: { motivationalDirection: "Approach" },
    avoidance: { motivationalDirection: "Avoidance" },
    predictable: { certainty: "Predictable" },
    uncertain: { certainty: "Uncertain" },
    ambiguous: { certainty: "Ambiguous" },
    weak: { intensity: "Weak" },
    strong: { intensity: "Strong" },
    social: { socialContext: "Social" },
    individual: { socialContext: "Individual" },
    past: { temporalFocus: "Past" },
    present: { temporalFocus: "Present" },
    future: { temporalFocus: "Future" },
  };

  if (labelMap[value] && labelMap[value][dimension]) {
    return labelMap[value][dimension];
  }

  // Default: capitalize first letter
  return value.charAt(0).toUpperCase() + value.slice(1);
};
