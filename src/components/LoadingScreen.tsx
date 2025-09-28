import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 gradient-violet flex flex-col items-center justify-center text-white safe-top safe-bottom">
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
        
        <p className="text-white/90 text-lg font-medium">
          Getting your app ready...
        </p>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white/80 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 w-full flex justify-center">
        <div className="w-16 h-1 bg-white/40 rounded-full" />
      </div>
    </div>
  );
};

export default LoadingScreen;