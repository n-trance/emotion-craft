import type { FC, CSSProperties } from "react";

interface StickyCraftingBarProps {
  craftingSlots: string[];
  onRemoveSlot: (index: number) => void;
  onClear: () => void;
  onCombine: () => void;
  onScrollToCrafting: () => void;
  isCombining: boolean;
  getEmotionColor: (emotion: string) => string;
  getEmotionBorderColor: (emotion: string) => string;
}

export const StickyCraftingBar: FC<StickyCraftingBarProps> = ({
  craftingSlots,
  onRemoveSlot,
  onClear,
  onCombine,
  onScrollToCrafting,
  isCombining,
  getEmotionColor,
  getEmotionBorderColor,
}) => {
  if (craftingSlots.length === 0) {
    return null;
  }

  return (
    <div className="sticky-crafting-bar">
      <div className="sticky-crafting-content">
        <div className="sticky-crafting-label">
          Crafting ({craftingSlots.length}):
        </div>
        <div className="sticky-crafting-items">
          {craftingSlots.map((emotion, index) => {
            const emotionColor = getEmotionColor(emotion);
            const isGradient = emotionColor.includes("linear-gradient");
            const borderColor = getEmotionBorderColor(emotion);
            return (
              <div
                key={index}
                className="sticky-crafting-item"
                style={{
                  background: isGradient ? emotionColor : undefined,
                  "--emotion-color": emotionColor,
                  "--emotion-border-color": isGradient ? "transparent" : borderColor,
                  borderColor: isGradient ? "transparent" : undefined,
                } as CSSProperties}
              >
                {emotion}
                <button
                  className="remove-button"
                  onClick={() => onRemoveSlot(index)}
                  aria-label="Remove emotion"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
        <div className="sticky-crafting-actions">
          <button
            className="combine-button"
            onClick={onCombine}
            disabled={craftingSlots.length < 1 || isCombining}
          >
            {isCombining ? (
              <>
                <span className="loading-spinner"></span>
                Combining...
              </>
            ) : (
              <>
                Combine{" "}
                {craftingSlots.length > 0 && `(${craftingSlots.length})`}
              </>
            )}
          </button>
          {craftingSlots.length > 0 && (
            <button className="clear-button-small" onClick={onClear}>
              Clear All
            </button>
          )}
          <button
            className="sticky-crafting-scroll"
            onClick={onScrollToCrafting}
            title="Scroll to crafting area"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
};
