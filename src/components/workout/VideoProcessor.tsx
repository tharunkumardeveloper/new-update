import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Shield, 
  Upload, 
  Camera,
  CheckCircle,
  XCircle,
  Trophy,
  Coins
} from 'lucide-react';

interface VideoProcessorProps {
  videoFile: File | null;
  activityName: string;
  onBack: () => void;
  onRetry: () => void;
  onComplete: (results: any) => void;
}

interface ProcessingResult {
  type: 'good' | 'bad' | 'poor' | 'anomaly';
  posture?: 'Good' | 'Bad';
  setsCompleted?: number;
  badSets?: number;
  duration?: string;
  message?: string;
}

const VideoProcessor = ({ videoFile, activityName, onBack, onRetry, onComplete }: VideoProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);
  const [showCoinsAnimation, setShowCoinsAnimation] = useState(false);

  useEffect(() => {
    if (videoFile) {
      processVideo(videoFile);
    }
  }, [videoFile]);

  const processVideo = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate processing with progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Wait for processing simulation
    await new Promise(resolve => setTimeout(resolve, 2000));
    clearInterval(progressInterval);
    setProgress(100);

    // Decode filename
    const filename = file.name.toLowerCase();
    const firstLetter = filename.charAt(0);
    
    // Extract numbers from filename (e.g., "bratheesh19-1.mp4" -> 19, 1)
    const numberMatch = filename.match(/(\d+)-(\d+)/);
    const setsCompleted = numberMatch ? parseInt(numberMatch[1]) : 15;
    const badSets = numberMatch ? parseInt(numberMatch[2]) : 1;

    // Mock video duration (in real app, would get from video metadata)
    const duration = "2:30";

    let processedResult: ProcessingResult;

    switch (firstLetter) {
      case 'b':
        processedResult = {
          type: 'bad',
          posture: 'Bad',
          setsCompleted,
          badSets,
          duration
        };
        break;
      case 'g':
        processedResult = {
          type: 'good',
          posture: 'Good',
          setsCompleted,
          badSets,
          duration
        };
        break;
      case 'p':
        processedResult = {
          type: 'poor',
          message: 'Video could not be processed. Poor lighting or detection issue. Please upload or record another video.'
        };
        break;
      case 'a':
        processedResult = {
          type: 'anomaly',
          message: 'Anomaly Detected. Potential cheating or manipulated video identified.'
        };
        break;
      default:
        // Default to good for demo
        processedResult = {
          type: 'good',
          posture: 'Good',
          setsCompleted,
          badSets,
          duration
        };
    }

    setResult(processedResult);
    setIsProcessing(false);

    // Handle different result types
    if (processedResult.type === 'good' || processedResult.type === 'bad') {
      // Show results and trigger rewards
      setTimeout(() => {
        triggerRewards();
      }, 1000);
    }
  };

  const triggerRewards = () => {
    // Show badge animation first
    setShowBadgeAnimation(true);
    
    // Then show coins after badge animation
    setTimeout(() => {
      setShowCoinsAnimation(true);
    }, 1500);

    // Hide animations after showing
    setTimeout(() => {
      setShowBadgeAnimation(false);
      setShowCoinsAnimation(false);
    }, 4000);
  };

  const handleSubmitWorkout = () => {
    if (result && (result.type === 'good' || result.type === 'bad')) {
      onComplete({
        ...result,
        activityName,
        timestamp: new Date().toISOString(),
        badgesEarned: ['Form Analyzer', 'Consistency Champion'],
        coinsEarned: result.type === 'good' ? 50 : 25
      });
    }
  };

  // Processing Screen
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 p-4 max-w-md">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Processing Video</h2>
            <p className="text-muted-foreground">AI is analyzing your {activityName}...</p>
          </div>

          <div className="w-full max-w-sm">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
          </div>
        </div>
      </div>
    );
  }

  // Poor Detection Notification
  if (result?.type === 'poor') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-4">Video Processing Failed</h2>
            <p className="text-muted-foreground mb-6">{result.message}</p>
            
            <div className="space-y-3">
              <Button onClick={onRetry} className="w-full btn-hero">
                Try Again
              </Button>
              <Button variant="outline" onClick={onBack} className="w-full">
                Back to Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Anomaly Detection Modal
  if (result?.type === 'anomaly') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive bg-destructive/5">
          <CardContent className="p-6 text-center">
            <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-4 text-destructive">🚨 Anomaly Detected</h2>
            <p className="text-muted-foreground mb-6">{result.message}</p>
            
            <div className="space-y-3">
              <Button onClick={onRetry} variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Another Video
              </Button>
              <Button variant="ghost" onClick={onBack} className="w-full">
                Exit Workout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results Screen (for good/bad results)
  if (result && (result.type === 'good' || result.type === 'bad')) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-subtle border-b safe-top">
          <div className="px-4 py-4">
            <div className="flex items-center space-x-3 max-w-md mx-auto">
              <Button variant="ghost" size="sm" onClick={onBack} className="tap-target">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-lg font-semibold">Workout Results</h1>
                <p className="text-sm text-muted-foreground">{activityName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-20 max-w-md mx-auto pt-6 space-y-6">
          {/* Reference Exercise Image */}
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mb-3">
                <div className="text-center">
                  <div className="text-4xl mb-2">💪</div>
                  <p className="text-sm text-muted-foreground">Reference: {activityName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {result.posture === 'Good' ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <XCircle className="w-5 h-5 text-warning" />
                )}
                <span>Analysis Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <div className="text-2xl font-bold mb-1">{result.posture}</div>
                  <p className="text-xs text-muted-foreground">Posture</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <div className="text-2xl font-bold mb-1">{result.setsCompleted}</div>
                  <p className="text-xs text-muted-foreground">Sets Completed</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <div className="text-2xl font-bold mb-1">{result.badSets}</div>
                  <p className="text-xs text-muted-foreground">Bad Sets</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <div className="text-2xl font-bold mb-1">{result.duration}</div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
              </div>

              {/* Posture Badge */}
              <div className="flex justify-center">
                <Badge 
                  className={`${result.posture === 'Good' ? 'bg-success/10 text-success border-success' : 'bg-warning/10 text-warning border-warning'}`}
                  variant="outline"
                >
                  {result.posture === 'Good' ? '✅ Excellent Form' : '⚠️ Form Needs Work'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button onClick={handleSubmitWorkout} className="w-full btn-hero" size="lg">
            <CheckCircle className="w-5 h-5 mr-2" />
            Submit Workout
          </Button>
        </div>

        {/* Badge Animation Overlay */}
        {showBadgeAnimation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="text-center animate-scale-in">
              <div className="w-24 h-24 bg-warning rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Badge Unlocked!</h2>
              <p className="text-white/80">Form Analyzer</p>
            </div>
          </div>
        )}

        {/* Coins Animation Overlay */}
        {showCoinsAnimation && (
          <div className="fixed bottom-20 left-4 right-4 z-50">
            <Card className="bg-primary text-primary-foreground animate-slide-up">
              <CardContent className="p-4 flex items-center space-x-3">
                <Coins className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="font-semibold">Coins Earned!</p>
                  <p className="text-sm opacity-90">+{result.type === 'good' ? '50' : '25'} coins</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default VideoProcessor;