import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Play, 
  Camera, 
  Upload, 
  Star,
  Timer,
  Target,
  Info
} from 'lucide-react';

interface ActivityDetailProps {
  activity: {
    name: string;
    rating: number;
    icon: string;
    muscles: string;
  };
  onBack: () => void;
  onStartWorkout: () => void;
}

const ActivityDetail = ({ activity, onBack, onStartWorkout }: ActivityDetailProps) => {
  const [activeTab, setActiveTab] = useState('reference');

  const referenceData = {
    'Push-ups': {
      image: '💪',
      description: 'A fundamental upper body exercise that targets chest, shoulders, and triceps.',
      difficulty: 'Beginner',
      duration: '10-15 minutes',
      equipment: 'None required',
      targetMuscles: ['Chest', 'Shoulders', 'Triceps', 'Core'],
      instructions: [
        'Start in a plank position with hands shoulder-width apart',
        'Lower your body until chest nearly touches the floor',
        'Push back up to starting position',
        'Keep your core engaged throughout the movement',
        'Maintain a straight line from head to heels'
      ]
    },
    'Pull-ups': {
      image: '🔥',
      description: 'An excellent compound exercise for building upper body and back strength.',
      difficulty: 'Intermediate',
      duration: '10-12 minutes',
      equipment: 'Pull-up bar',
      targetMuscles: ['Latissimus Dorsi', 'Biceps', 'Rhomboids', 'Middle Trapezius'],
      instructions: [
        'Hang from a pull-up bar with palms facing away',
        'Pull yourself up until chin clears the bar',
        'Lower yourself with control to full extension',
        'Keep shoulders back and chest out',
        'Avoid swinging or using momentum'
      ]
    },
    'Sit-ups': {
      image: '⚡',
      description: 'Classic core strengthening exercise targeting abdominal muscles.',
      difficulty: 'Beginner',
      duration: '8-10 minutes',
      equipment: 'Exercise mat (optional)',
      targetMuscles: ['Rectus Abdominis', 'Hip Flexors', 'Obliques'],
      instructions: [
        'Lie on your back with knees bent and feet flat',
        'Place hands behind head or across chest',
        'Lift your torso toward your knees',
        'Lower back down with control',
        'Keep your neck in neutral position'
      ]
    }
  };

  const data = referenceData[activity.name as keyof typeof referenceData] || {
    image: activity.icon,
    description: 'This exercise helps improve your overall fitness and strength.',
    difficulty: 'Beginner',
    duration: '10 minutes',
    equipment: 'None required',
    targetMuscles: activity.muscles.split(', '),
    instructions: [
      'Follow proper form and technique',
      'Start with appropriate intensity',
      'Maintain consistent breathing',
      'Listen to your body',
      'Progress gradually over time'
    ]
  };

  const supportedActivities = ['Push-ups', 'Pull-ups', 'Sit-ups', 'Vertical Jump', 'Shuttle Run'];
  const isSupported = supportedActivities.includes(activity.name);

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
              <h1 className="text-lg font-semibold">{activity.name}</h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{activity.rating}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {data.difficulty}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-20 max-w-md mx-auto">
        {/* Overview Card */}
        <Card className="mb-6 animate-fade-in">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">{data.image}</div>
            <h2 className="text-xl font-bold mb-2">{activity.name}</h2>
            <p className="text-muted-foreground mb-4">{data.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <Timer className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-sm font-medium">{data.duration}</p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
              <div className="text-center">
                <Target className="w-5 h-5 text-success mx-auto mb-1" />
                <p className="text-sm font-medium">{data.equipment}</p>
                <p className="text-xs text-muted-foreground">Equipment</p>
              </div>
            </div>

            <Button 
              onClick={onStartWorkout}
              className="w-full btn-hero"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Proceed to Workout
            </Button>
          </CardContent>
        </Card>

        {/* Detail Tabs */}
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle>Exercise Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="reference">Reference</TabsTrigger>
                <TabsTrigger value="muscles">Muscles</TabsTrigger>
                <TabsTrigger value="instructions">How To</TabsTrigger>
              </TabsList>

              <TabsContent value="reference" className="mt-4 space-y-4">
                <div className="text-center">
                  <div className="text-8xl mb-4">{data.image}</div>
                  <h3 className="font-semibold mb-2">Reference Image</h3>
                  <p className="text-sm text-muted-foreground">
                    This is your reference for proper form and technique.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="muscles" className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-primary" />
                    Target Muscles
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {data.targetMuscles.map((muscle) => (
                      <Badge key={muscle} variant="secondary" className="justify-center py-2">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium mb-1">Primary Focus</p>
                      <p className="text-xs text-muted-foreground">
                        This exercise primarily targets your {data.targetMuscles[0].toLowerCase()} 
                        while also engaging supporting muscle groups.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="instructions" className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Step-by-Step Instructions</h3>
                  <div className="space-y-3">
                    {data.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-secondary/30">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <h4 className="font-medium text-warning mb-2">💡 Pro Tip</h4>
                  <p className="text-sm text-muted-foreground">
                    Focus on quality over quantity. Perfect form with fewer reps is better than poor form with many reps.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Workout Options */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Workout Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Camera className="w-5 h-5 mr-3" />
              Record Video
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Upload className="w-5 h-5 mr-3" />
              Upload Video
            </Button>
            
            {!isSupported && (
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  🚧 Advanced analysis coming soon for this exercise
                </p>
                <p className="text-xs text-muted-foreground">
                  Currently available for: Push-ups, Pull-ups, Sit-ups, Vertical Jump, Shuttle Run
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityDetail;