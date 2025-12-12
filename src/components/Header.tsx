import type { FC } from "react";

interface HeaderProps {
  totalDiscoveries: number;
  onReset: () => void;
  onFinderClick: () => void;
}

export const Header: FC<HeaderProps> = ({
  totalDiscoveries,
  onReset,
  onFinderClick,
}) => {
  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1>Emotion Craft</h1>
          <p className="header-subtitle">
            Combine emotions to discover new feelings
          </p>
        </div>
        <div className="header-actions">
          <div className="stats">
            <div className="stat-item">
              <span className="stat-value">{totalDiscoveries}</span>
              <span className="stat-label">Discovered</span>
            </div>
          </div>
          <button
            aria-label="Emotion finder"
            title="Find emotion by dimensions"
            onClick={onFinderClick}
            className="header-finder-button"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8fafc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            🔍
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={onReset}
              className="reset-button"
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                border: "1px solid #ef4444",
                borderRadius: "6px",
                backgroundColor: "#ffffff",
                color: "#ef4444",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#fef2f2";
                e.currentTarget.style.borderColor = "#dc2626";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.borderColor = "#ef4444";
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
