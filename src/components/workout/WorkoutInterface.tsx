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

interface WorkoutInterfaceProps {
  activity: {
    name: string;
    rating: number;
    icon: string;
    muscles: string;
  };
  onBack: () => void;
}

const WorkoutInterface = ({ activity, onBack }: WorkoutInterfaceProps) => {
  const [stage, setStage] = useState<'selection' | 'recording' | 'processing' | 'results'>('selection');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const supportedActivities = ['Push-ups', 'Pull-ups', 'Sit-ups', 'Vertical Jump', 'Shuttle Run'];
  const isSupported = supportedActivities.includes(activity.name);

  // Mock workout results
  const workoutResults = {
    'Push-ups': {
      reps: 25,
      form_score: 8.5,
      duration: '2:30',
      calories: 45,
      analysis: 'Great form! Your depth and pace were consistent.',
      recommendations: ['Try to keep a steadier pace', 'Focus on controlled movement']
    },
    'Pull-ups': {
      reps: 12,
      form_score: 9.2,
      duration: '1:45',
      calories: 38,
      analysis: 'Excellent technique with full range of motion.',
      recommendations: ['Maintain grip strength', 'Work on negative control']
    },
    'Sit-ups': {
      reps: 40,
      form_score: 7.8,
      duration: '3:15',
      calories: 52,
      analysis: 'Good effort! Watch your neck position.',
      recommendations: ['Keep chin tucked', 'Focus on core engagement']
    }
  };

  const handleRecordingToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Mock recording timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Auto stop after 30 seconds for demo
      setTimeout(() => {
        clearInterval(timer);
        setIsRecording(false);
        setStage('processing');
        
        // Auto proceed to results after processing
        setTimeout(() => {
          setStage('results');
        }, 3000);
      }, 30000);
    } else {
      setIsRecording(false);
      setStage('processing');
      
      setTimeout(() => {
        setStage('results');
      }, 3000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (stage === 'results') {
    const results = workoutResults[activity.name as keyof typeof workoutResults];
    
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
                <h1 className="text-lg font-semibold">Workout Complete!</h1>
                <p className="text-sm text-muted-foreground">{activity.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-20 max-w-md mx-auto">
          {/* Success Animation */}
          <div className="text-center py-8 animate-scale-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Great Work!</h2>
            <p className="text-muted-foreground">Here are your results</p>
          </div>

          {/* Results Cards */}
          <div className="space-y-4 mb-6">
            {/* Main Stats */}
            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{results?.reps}</div>
                    <p className="text-sm text-muted-foreground">Reps</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-1">{results?.form_score}</div>
                    <p className="text-sm text-muted-foreground">Form Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-info mb-1">{results?.duration}</div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning mb-1">{results?.calories}</div>
                    <p className="text-sm text-muted-foreground">Calories</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{results?.analysis}</p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Recommendations:</h4>
                  {results?.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Video Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Video Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/30 rounded-lg p-8 text-center mb-4">
                  <Play className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Video snippet with analysis overlay</p>
                </div>
                
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">
                    CSV Data Available
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Detailed movement data exported for analysis
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full btn-hero" size="lg">
              <Download className="w-5 h-5 mr-2" />
              Download Report
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg">
                <Award className="w-4 h-4 mr-2" />
                Submit (Earn Badge)
              </Button>
              <Button variant="outline" size="lg" onClick={() => setStage('selection')}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Redo Workout
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'processing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 p-4">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <div>
            <h2 className="text-xl font-bold mb-2">Processing Your Workout</h2>
            <p className="text-muted-foreground">AI is analyzing your form and counting reps...</p>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'recording') {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Camera View */}
        <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <Camera className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg">Camera Active</p>
            <p className="text-sm opacity-70">Recording {activity.name}</p>
          </div>

          {/* Recording Timer */}
          <div className="absolute top-6 left-6 bg-red-500 text-white px-3 py-1 rounded-full flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-mono">{formatTime(recordingTime)}</span>
          </div>

          {/* Form Guide */}
          <div className="absolute top-6 right-6 bg-black/50 text-white p-3 rounded-lg">
            <p className="text-sm">Keep device steady</p>
            <p className="text-xs opacity-70">Full body in frame</p>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-black safe-bottom">
          <div className="flex justify-center space-x-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setStage('selection')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={handleRecordingToggle}
              className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'} text-white`}
            >
              {isRecording ? <Square className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isRecording ? 'Stop' : 'Start'} Recording
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Selection Stage
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
              <h1 className="text-lg font-semibold">Start Workout</h1>
              <p className="text-sm text-muted-foreground">{activity.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-20 max-w-md mx-auto">
        {/* Activity Overview */}
        <Card className="mb-6 animate-fade-in">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">{activity.icon}</div>
            <h2 className="text-xl font-bold mb-2">{activity.name}</h2>
            <p className="text-muted-foreground mb-4">Ready to track your performance?</p>
          </CardContent>
        </Card>

        {/* Recording Options */}
        <div className="space-y-4 mb-6">
          <Button 
            className="w-full btn-hero" 
            size="lg"
            onClick={() => setStage('recording')}
          >
            <Camera className="w-5 h-5 mr-3" />
            Record Video
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            size="lg"
            onClick={() => {
              // Mock file upload
              setStage('processing');
              setTimeout(() => setStage('results'), 3000);
            }}
          >
            <Upload className="w-5 h-5 mr-3" />
            Upload Video
          </Button>
        </div>

        {/* Support Notice */}
        {isSupported ? (
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium text-success">AI Analysis Available</p>
                  <p className="text-xs text-muted-foreground">
                    This exercise supports automatic rep counting and form analysis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium text-warning">Coming Soon</p>
                  <p className="text-xs text-muted-foreground">
                    Advanced analysis for this exercise is in development
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkoutInterface;