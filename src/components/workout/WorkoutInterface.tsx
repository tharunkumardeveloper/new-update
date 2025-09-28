import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Play,
  Pause,
  Square,
  Download,
  Award,
  RefreshCw
} from 'lucide-react';
import WorkoutUploadScreen from './WorkoutUploadScreen';
import VideoProcessor from './VideoProcessor';

interface WorkoutInterfaceProps {
  activity: {
    name: string;
    rating: number;
    muscles: string;
  };
  onBack: () => void;
}

const WorkoutInterface = ({ activity, onBack }: WorkoutInterfaceProps) => {
  const [stage, setStage] = useState<'upload' | 'processing' | 'complete'>('upload');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

  const supportedActivities = ['Push-ups', 'Pull-ups', 'Sit-ups', 'Vertical Jump', 'Shuttle Run'];
  const isSupported = supportedActivities.includes(activity.name);

  const handleVideoSelected = (file: File) => {
    setSelectedVideo(file);
    setStage('processing');
  };

  const handleRetry = () => {
    setSelectedVideo(null);
    setStage('upload');
  };

  const handleWorkoutComplete = (results: any) => {
    // Save workout to localStorage for Reports tab
    const existingHistory = JSON.parse(localStorage.getItem('workout_history') || '[]');
    existingHistory.push(results);
    localStorage.setItem('workout_history', JSON.stringify(existingHistory));

    // Return to home/training tab
    onBack();
  };

  if (stage === 'processing') {
    return (
      <VideoProcessor
        videoFile={selectedVideo}
        activityName={activity.name}
        onBack={onBack}
        onRetry={handleRetry}
        onComplete={handleWorkoutComplete}
      />
    );
  }

  if (stage === 'upload') {
    return (
      <WorkoutUploadScreen
        activityName={activity.name}
        onBack={onBack}
        onVideoSelected={handleVideoSelected}
      />
    );
  }

  return null;
};

export default WorkoutInterface;