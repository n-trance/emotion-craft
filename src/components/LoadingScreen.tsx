import type { FC } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
  showLoading: boolean;
}

export const LoadingScreen: FC<LoadingScreenProps> = ({ isLoading, showLoading }) => {
  if (showLoading) {
    return (
      <div className={`loading-screen ${!isLoading ? 'fade-out' : ''}`}>
        <div className="loading-content">
          <div className="loading-star">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64">
              <path fill="#FFD700" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h2 className="loading-title">Emotion Craft</h2>
          <p className="loading-subtitle">Preparing your emotional journey...</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="loading-spinner" style={{ width: '48px', height: '48px' }}></div>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>Loading Emotion Craft...</p>
      </div>
    </div>
  );
};
