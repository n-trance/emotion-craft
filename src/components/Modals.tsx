import React from "react";
import type { DimensionType } from "../data/types";

interface ModalsProps {
  showTypeModal: boolean;
  setShowTypeModal: (value: boolean) => void;
  showTypeFilterModal: boolean;
  setShowTypeFilterModal: (value: boolean) => void;
  showEmotionsModal: boolean;
  setShowEmotionsModal: (value: boolean) => void;
  showFeelingsModal: boolean;
  setShowFeelingsModal: (value: boolean) => void;
  showStatesModal: boolean;
  setShowStatesModal: (value: boolean) => void;
  selectedEmotionPopup: string | null;
  setSelectedEmotionPopup: (value: string | null) => void;
  selectedDimensionModal: DimensionType | null;
  setSelectedDimensionModal: (value: DimensionType | null) => void;
  dimensionTooltips: { [key in DimensionType]: string } | null;
  getDimensionDisplayName: (dimension: DimensionType) => string;
  formatDimensionTooltip: (tooltip: string) => JSX.Element;
  getFeelingDescription: (emotion: string) => string;
}

export const Modals: React.FC<ModalsProps> = ({
  showTypeModal,
  setShowTypeModal,
  showTypeFilterModal,
  setShowTypeFilterModal,
  showEmotionsModal,
  setShowEmotionsModal,
  showFeelingsModal,
  setShowFeelingsModal,
  showStatesModal,
  setShowStatesModal,
  selectedEmotionPopup,
  setSelectedEmotionPopup,
  selectedDimensionModal,
  setSelectedDimensionModal,
  dimensionTooltips,
  getDimensionDisplayName,
  formatDimensionTooltip,
  getFeelingDescription,
}) => {
  return (
    <>
      {/* Selected Emotion Popup */}
      {selectedEmotionPopup && (
        <div
          className="emotion-popup-overlay"
          onClick={() => setSelectedEmotionPopup(null)}
        >
          <div
            className="emotion-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="emotion-popup-close"
              onClick={() => setSelectedEmotionPopup(null)}
            >
              ×
            </button>
            <div className="emotion-popup-title">{selectedEmotionPopup}</div>
            <div className="emotion-popup-description">
              <p style={{ marginBottom: 0 }}>
                {getFeelingDescription(selectedEmotionPopup)}
              </p>
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
            <div className="emotion-popup-title">Emotions</div>
            <div className="emotion-popup-description">
              <p style={{ marginBottom: "1rem" }}>
                Emotions are complex psychological states that involve subjective
                experience, physiological responses, and behavioral expressions.
                They are fundamental human experiences that arise from our
                interactions with the world around us.
              </p>
              <p style={{ marginBottom: 0 }}>
                Base emotions like <strong>Joy</strong>, <strong>Trust</strong>,
                <strong> Fear</strong>, <strong>Surprise</strong>,
                <strong> Sadness</strong>, <strong>Disgust</strong>,
                <strong> Anger</strong>, and <strong>Anticipation</strong> form
                the foundation of our emotional landscape and can be combined to
                create more nuanced feelings and states.
              </p>
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
            <div className="emotion-popup-title">Feelings</div>
            <div className="emotion-popup-description">
              <p style={{ marginBottom: "1rem" }}>
                Feelings are the personal, subjective experiences that arise
                when we interpret and make sense of our emotions. Unlike
                emotions, which are universal, feelings are shaped by individual
                history, culture, and context.
              </p>
              <p style={{ marginBottom: 0 }}>
                They often represent combinations of multiple emotions filtered
                through personal experience. For example, gratitude combines
                trust, love, and joy filtered through appreciation and
                recognition of kindness.
              </p>
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
            <div className="emotion-popup-title">States</div>
            <div className="emotion-popup-description">
              <p style={{ marginBottom: "1rem" }}>
                States are more stable and enduring emotional conditions that
                shape our ongoing experience. They influence how we perceive and
                interact with the world over longer periods.
              </p>
              <p style={{ marginBottom: 0 }}>
                Examples include tranquility, melancholy, or vigilance—each
                representing a settled way of being rather than a fleeting
                emotional response.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Type Modal */}
      {showTypeModal && (
        <div
          className="emotion-popup-overlay"
          onClick={() => setShowTypeModal(false)}
        >
          <div
            className="emotion-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="emotion-popup-close"
              onClick={() => setShowTypeModal(false)}
            >
              ×
            </button>
            <div className="emotion-popup-title">Type</div>
            <div className="emotion-popup-description">
              <p style={{ marginBottom: "1rem" }}>
                The Type field categorizes emotional experiences into three
                distinct categories:
              </p>
              <p style={{ marginBottom: "1rem" }}>
                <strong>Emotions</strong> are complex psychological states that
                involve subjective experience, physiological responses, and
                behavioral expressions. Base emotions like Joy, Trust, Fear,
                Surprise, Sadness, Disgust, Anger, and Anticipation form the
                foundation of our emotional landscape.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                <strong>Feelings</strong> are the personal, subjective
                experience of emotions combined with individual context and
                meaning. They represent how we interpret and experience emotions
                in our daily lives, often as combinations of multiple emotions
                filtered through our personal experiences, memories, and
                cultural background.
              </p>
              <p>
                <strong>States</strong> are more stable and enduring emotional
                conditions that represent a particular way of being or existing.
                Unlike fleeting emotions or feelings, states often describe a
                sustained condition or quality of experience that shapes how we
                perceive and interact with the world.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Type Filter Modal */}
      {showTypeFilterModal && (
        <div
          className="emotion-popup-overlay"
          onClick={() => setShowTypeFilterModal(false)}
        >
          <div
            className="emotion-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="emotion-popup-close"
              onClick={() => setShowTypeFilterModal(false)}
            >
              ×
            </button>
            <div className="emotion-popup-title">Type</div>
            <div className="emotion-popup-description">
              <p style={{ marginBottom: "1rem" }}>
                The Type field categorizes emotional experiences into three
                distinct categories:
              </p>
              <p style={{ marginBottom: "1rem" }}>
                <strong>Emotions</strong> are complex psychological states that
                involve subjective experience, physiological responses, and
                behavioral expressions. Base emotions like Joy, Trust, Fear,
                Surprise, Sadness, Disgust, Anger, and Anticipation form the
                foundation of our emotional landscape.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                <strong>Feelings</strong> are the personal, subjective
                experience of emotions combined with individual context and
                meaning. They represent how we interpret and experience emotions
                in our daily lives, often as combinations of multiple emotions
                filtered through our personal experiences, memories, and
                cultural background.
              </p>
              <p>
                <strong>States</strong> are more stable and enduring emotional
                conditions that represent a particular way of being or existing.
                Unlike fleeting emotions or feelings, states often describe a
                sustained condition or quality of experience that shapes how we
                perceive and interact with the world.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dimension Modal */}
      {selectedDimensionModal && (
        <div
          className="emotion-popup-overlay"
          onClick={() => setSelectedDimensionModal(null)}
        >
          <div
            className="emotion-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="emotion-popup-close"
              onClick={() => setSelectedDimensionModal(null)}
            >
              ×
            </button>
            <div className="emotion-popup-title">
              {getDimensionDisplayName(selectedDimensionModal)}
            </div>
            <div className="emotion-popup-description">
              {dimensionTooltips && selectedDimensionModal
                ? formatDimensionTooltip(dimensionTooltips[selectedDimensionModal])
                : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;
