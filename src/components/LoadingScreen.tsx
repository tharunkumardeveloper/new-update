import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [phase, setPhase] = useState(1);
  const [currentText, setCurrentText] = useState("Getting your app ready...");

  useEffect(() => {
    // Phase 1: 2 seconds
    const phase1Timer = setTimeout(() => {
      setPhase(2);
      setCurrentText("Preparing your personalized dashboard...");
    }, 2000);

    // Phase 2: 2 seconds, then complete
    const phase2Timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(phase1Timer);
      clearTimeout(phase2Timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex flex-col items-center justify-center text-white safe-top safe-bottom">
      {/* Logo */}
      <div className="mb-12 animate-scale-in">
        <h1 className="text-5xl font-bold text-shadow tracking-tight">
          TalentTrack
        </h1>
        <p className="text-center mt-2 text-white/80 text-lg">
          Your Athletic Journey Begins
        </p>
      </div>

      {/* Loading Animation */}
      <div className="flex flex-col items-center space-y-6 animate-fade-in">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
        
        <p className="text-white/90 text-lg font-medium transition-all duration-500">
          {currentText}
        </p>
      </div>

    </div>
  );
};

export default LoadingScreen;