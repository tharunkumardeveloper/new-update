import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  X,
  Play,
  Upload,
  Camera,
  Download,
  Award,
  RefreshCw
} from 'lucide-react';

interface ActivityDetailProps {
  activity: {
    name: string;
    rating: number;
    image?: string;
    muscles: string;
  };
  onBack: () => void;
}

// Activity content database
const activityContent = {
  'Push-ups': {
    description: 'Standard chest-dominant pressing exercise used to assess upper-body strength and endurance.',
    muscles: ['Pectoralis Major', 'Triceps', 'Anterior Deltoid'],
    category: 'Strength Training',
    steps: [
      'Start in high plank with hands under shoulders.',
      'Lower chest to 2–3 inches above ground keeping a straight body line.',
      'Press up through palms until elbows lock.',
      'Control descent and keep core braced.'
    ],
    mistakes: [
      'Flaring elbows',
      'Sagging hips',
      'Partial range of motion'
    ],
    outputFields: ['total_reps', 'correct_reps', 'incorrect_reps', 'avg_rep_duration_sec', 'min_elbow_angle', 'max_elbow_angle', 'total_time_sec']
  },
  'Pull-ups': {
    description: 'Vertical pulling assessment for upper back and biceps strength.',
    muscles: ['Latissimus Dorsi', 'Biceps Brachii', 'Rhomboids'],
    category: 'Strength Training',
    steps: [
      'Start dead-hang with shoulder-width grip.',
      'Pull until chin clears bar with chest slightly up.',
      'Lower under control to full hang.'
    ],
    mistakes: [
      'Kipping (if testing strict)',
      'Partial pull',
      'Swinging body'
    ],
    outputFields: ['total_reps', 'successful_reps', 'dip_duration_sec', 'avg_rep_duration', 'head_y_reference', 'total_time']
  },
  'Vertical Jump': {
    description: 'Measures explosive lower-body power by evaluating maximal vertical displacement.',
    muscles: ['Quadriceps', 'Glutes', 'Calves'],
    category: 'Power Assessment',
    steps: [
      'Stand with feet hip-width, perform counter-movement, swing arms.',
      'Explode upward as high as possible.',
      'Land softly, knees slightly bent.'
    ],
    mistakes: [
      'Stiff knees on landing',
      'Reduced arm swing',
      'Shallow countermovement'
    ],
    outputFields: ['jump_count', 'max_jump_height_m', 'avg_jump_height_m', 'time_of_max_height_sec', 'total_time']
  },
  'Shuttle Run': {
    description: 'Short shuttle run to test acceleration, deceleration and change-of-direction agility.',
    muscles: ['Hamstrings', 'Glutes', 'Calves'],
    category: 'Agility Test',
    steps: [
      'Start at start line; sprint to cone 10 m away and back (four times).',
      'Turn explosively at each cone and maintain low posture.'
    ],
    mistakes: [
      'Inefficient turns',
      'Upright posture',
      'Slow acceleration out of turn'
    ],
    outputFields: ['run_count', 'split_times_sec', 'total_time', 'avg_split_time', 'turnaround_counts', 'distance_m']
  },
  'Sit-ups': {
    description: 'Core endurance and trunk flexion assessment.',
    muscles: ['Rectus Abdominis', 'Hip Flexors', 'External Obliques'],
    category: 'Core Training',
    steps: [
      'Start supine knees bent, arms across chest.',
      'Curl torso to touch knees or reach knees.',
      'Lower with control to start position.'
    ],
    mistakes: [
      'Using momentum',
      'Neck strain',
      'Incomplete reps'
    ],
    outputFields: ['total_reps', 'correct_reps', 'avg_rep_time', 'max_rep_speed', 'total_time_sec']
  },
  'Plank': {
    description: 'Isometric core hold testing endurance and trunk stability.',
    muscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Erector Spinae'],
    category: 'Core Stability',
    steps: [
      'Forearm plank with body in straight line.',
      'Squeeze glutes and keep neutral neck.',
      'Hold until failure or target time.'
    ],
    mistakes: [
      'Hips sagging',
      'Neck hyperextension',
      'Shoulders shrugged'
    ],
    outputFields: ['hold_duration_sec', 'interruptions_count', 'avg_hip_drop_mm', 'total_time']
  },
  'Cobra Stretch': {
    description: 'Mobility stretch for lumbar extension and thoracic mobility.',
    muscles: ['Erector Spinae', 'Lower Trapezius', 'Rectus Abdominis'],
    category: 'Flexibility',
    steps: [
      'Lie prone, hands under shoulders, press chest up into extension.',
      'Keep pelvis grounded and breathe slowly.',
      'Hold for prescribed time.'
    ],
    mistakes: [
      'Pushing through lower back only',
      'Lifting pelvis',
      'Neck overextension'
    ],
    outputFields: ['hold_time_sec', 'max_extension_angle_deg', 'perceived_comfort', 'repetitions']
  },
  'Chest Stretch': {
    description: 'Static or dynamic stretch targeting the pectorals to improve shoulder mobility.',
    muscles: ['Pectoralis Major', 'Anterior Deltoid', 'Serratus Anterior'],
    category: 'Flexibility',
    steps: [
      'Place forearm on wall at 90°, rotate torso away.',
      'Keep shoulder down and hold.',
      'Repeat for both sides.'
    ],
    mistakes: [
      'Elevating shoulder blade',
      'Bending elbow incorrectly'
    ],
    outputFields: ['hold_time_sec', 'side_balance', 'max_open_angle_deg', 'repetitions']
  },
  'Jumping Jack': {
    description: 'Full-body plyometric movement for warm-up and cardio.',
    muscles: ['Deltoids', 'Calves', 'Glutes'],
    category: 'Cardio',
    steps: [
      'Start standing; jump legs wide while raising arms overhead.',
      'Return to start and repeat rhythmically.'
    ],
    mistakes: [
      'Poor landing mechanics',
      'Low arm range',
      'Bent knees'
    ],
    outputFields: ['total_reps', 'avg_rep_rate_rpm', 'max_heart_rate_placeholder', 'total_time']
  },
  'Inclined Push-up': {
    description: 'Push-up variation with reduced load (hands elevated) — useful for scaling.',
    muscles: ['Pectoralis Major', 'Triceps', 'Anterior Deltoid'],
    category: 'Strength Training',
    steps: [
      'Start in high plank with hands on elevated surface.',
      'Lower chest to 2–3 inches above surface keeping straight body line.',
      'Press up through palms until elbows lock.',
      'Control descent and keep core braced.'
    ],
    mistakes: [
      'Incorrect incline angle',
      'Flared elbows'
    ],
    outputFields: ['total_reps', 'correct_reps', 'avg_rep_duration', 'total_time']
  },
  'Knee Push-up': {
    description: 'Regression of push-up where knees remain on floor for reduced load. If you use a wheelchair or assistance device, ensure full visibility and safe setup.',
    muscles: ['Pectoralis Major', 'Triceps', 'Core'],
    category: 'Adaptive Training',
    steps: [
      'Start in modified plank with knees grounded.',
      'Lower chest maintaining straight line from knees to head.',
      'Press up through palms until elbows lock.'
    ],
    mistakes: [
      'Poor torso alignment',
      'Hips up'
    ],
    outputFields: ['total_reps', 'correct_reps', 'avg_rep_time', 'total_time']
  },
  'Wide Arm Push-up': {
    description: 'Push-up variation with wider hand placement to bias chest.',
    muscles: ['Pectoralis Major', 'Anterior Deltoid', 'Serratus'],
    category: 'Strength Training',
    steps: [
      'Start in high plank with hands wider than shoulder width.',
      'Lower chest maintaining wide hand position.',
      'Press up through palms until elbows lock.'
    ],
    mistakes: [
      'Overextending shoulders',
      'Shallow depth'
    ],
    outputFields: ['total_reps', 'avg_depth_px', 'correct_reps', 'total_time']
  },
  'Standing Vertical Jump': {
    description: 'Similar to Vertical Jump but from standing no-step start.',
    muscles: ['Glutes', 'Quadriceps', 'Calves'],
    category: 'Power Assessment',
    steps: [
      'Quick countermovement from static stance.',
      'Jump as high as possible.',
      'Land softly with control.'
    ],
    mistakes: [
      'Poor arm swing timing',
      'Knee valgus on landing'
    ],
    outputFields: ['jump_count', 'max_height_m', 'avg_height', 'ground_contact_time_sec']
  },
  'Standing Broad Jump': {
    description: 'Horizontal explosive jump for lower-body power.',
    muscles: ['Glutes', 'Hamstrings', 'Quadriceps'],
    category: 'Power Assessment',
    steps: [
      'Two-foot horizontal jump from static start.',
      'Land balanced with both feet.',
      'Measure distance from start to landing.'
    ],
    mistakes: [
      'Poor arm drive',
      'Knee collapse on landing'
    ],
    outputFields: ['jump_count', 'max_distance_m', 'avg_distance_m', 'total_time']
  },
  'Medicine Ball Throw': {
    description: 'Upper-body explosive power assessment using a medicine ball chest/overhead throw.',
    muscles: ['Pectoralis Major', 'Triceps', 'Core'],
    category: 'Power Assessment',
    steps: [
      'Chest pass or overhead throw with maximal effort.',
      'Measure distance from release point.',
      'Focus on explosive movement.'
    ],
    mistakes: [
      'Poor release angle',
      'Insufficient trunk rotation'
    ],
    outputFields: ['throw_count', 'max_distance_m', 'avg_distance_m', 'release_angle_deg']
  },
  '30-Meter Standing Start': {
    description: 'Sprint test measuring acceleration from standing start.',
    muscles: ['Hamstrings', 'Glutes', 'Quadriceps'],
    category: 'Speed Test',
    steps: [
      'From standing, sprint 30 m as fast as possible.',
      'Time the run from start to finish.',
      'Maintain proper sprint form.'
    ],
    mistakes: [
      'Slow reaction',
      'Poor push phase',
      'Upright posture too early'
    ],
    outputFields: ['time_sec', 'max_velocity_m_s', 'split_0_10m', 'split_10_30m']
  },
  '4 × 10-Meter Shuttle Run': {
    description: 'Agility shuttle with short sprints and direction change.',
    muscles: ['Calves', 'Hamstrings', 'Glutes'],
    category: 'Agility Test',
    steps: [
      'Sprint to cone 10m away and back four times.',
      'Turn explosively at each cone.',
      'Maintain low posture throughout.'
    ],
    mistakes: [
      'Inefficient turns',
      'Footwork errors'
    ],
    outputFields: ['run_count', 'split_times', 'total_time', 'avg_turn_time']
  },
  '800-Meter Endurance Run': {
    description: 'Middle-distance endurance assessment.',
    muscles: ['Quadriceps', 'Glutes', 'Calves'],
    category: 'Endurance Test',
    steps: [
      'Continuous run for 800 m at maximal sustainable pace.',
      'Maintain consistent pacing throughout.',
      'Focus on breathing rhythm.'
    ],
    mistakes: [
      'Going out too fast',
      'Inconsistent pacing'
    ],
    outputFields: ['total_time_sec', 'lap_splits', 'avg_pace_sec_per_100m', 'peak_speed']
  },
  'Assisted Shuttle Run': {
    description: 'Adaptive shuttle run with assistive support. If you use a wheelchair or assistance device, ensure full visibility and safe setup.',
    muscles: ['Quadriceps', 'Glutes', 'Shoulders'],
    category: 'Adaptive Training',
    steps: [
      'Modified shuttle run with assistive aids.',
      'Maintain form and safety throughout.',
      'Use appropriate assistance level.'
    ],
    mistakes: [
      'Poor assistance positioning',
      'Incomplete turns'
    ],
    outputFields: ['run_cycles', 'split_times', 'assistance_level_flag', 'total_time']
  },
  'Assisted Chin & Dip': {
    description: 'Adaptive chin/pull and dip movement with assistance for support. If you use a wheelchair or assistance device, ensure full visibility and safe setup.',
    muscles: ['Biceps', 'Triceps', 'Back'],
    category: 'Adaptive Training',
    steps: [
      'Assisted chin/pull or dip with supportive device.',
      'Focus on full range of motion.',
      'Use appropriate assistance level.'
    ],
    mistakes: [
      'Relying too much on assist',
      'Partial ROM'
    ],
    outputFields: ['reps_assisted', 'assist_ratio', 'avg_rep_time', 'correct_reps']
  },
  'Modified Shuttle Run': {
    description: 'Adapted shuttle trial with modifications to space or assistance. If you use a wheelchair or assistance device, ensure full visibility and safe setup.',
    muscles: ['Glutes', 'Quadriceps', 'Upper Body'],
    category: 'Adaptive Training',
    steps: [
      'Follow modified route with assistive tech if required.',
      'Use proper turning technique for your setup.',
      'Maintain safety throughout movement.'
    ],
    mistakes: [
      'Improper assist use',
      'Unsteady turns'
    ],
    outputFields: ['total_cycles', 'avg_split_time', 'assistance_notes', 'total_time']
  }
};

const ActivityDetail = ({ activity, onBack }: ActivityDetailProps) => {
  const [stage, setStage] = useState<'detail' | 'workout' | 'processing' | 'output'>('detail');
  const [processingStep, setProcessingStep] = useState(0);

  const content = activityContent[activity.name as keyof typeof activityContent];
  
  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Activity content not found</p>
      </div>
    );
  }

  const processingSteps = [
    'Analyzing video…',
    'Processing frames…',
    'Detecting movement…',
    'Counting reps / events…',
    'Generating summary…'
  ];

  const handleModeSelect = (mode: 'upload' | 'record') => {
    setStage('processing');
    setProcessingStep(0);
    
    // Simulate processing steps
    const interval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => setStage('output'), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const generateMockData = () => {
    const baseData: Record<string, any> = {};
    content.outputFields.forEach(field => {
      switch (field) {
        case 'total_reps':
        case 'correct_reps':
        case 'successful_reps':
          baseData[field] = Math.floor(Math.random() * 20) + 10;
          break;
        case 'total_time_sec':
        case 'total_time':
          baseData[field] = Math.floor(Math.random() * 120) + 30;
          break;
        case 'max_jump_height_m':
        case 'max_height_m':
          baseData[field] = (Math.random() * 0.5 + 0.3).toFixed(2);
          break;
        case 'max_distance_m':
          baseData[field] = (Math.random() * 2 + 1.5).toFixed(2);
          break;
        default:
          baseData[field] = Math.floor(Math.random() * 100);
      }
    });
    return baseData;
  };

  const mockData = generateMockData();

  if (stage === 'output') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-subtle border-b safe-top">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <Button variant="ghost" size="sm" onClick={() => setStage('workout')} className="tap-target">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold">Workout Results</h1>
              <Button variant="ghost" size="sm" onClick={onBack} className="tap-target">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 pb-20 max-w-md mx-auto">
          {/* Video Player Area */}
          <div className="mb-6 relative">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-2 opacity-70" />
                  <p className="text-sm opacity-70">Annotated Video Analysis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(mockData).slice(0, 4).map(([key, value]) => (
              <Card key={key} className="card-elevated">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{value}</div>
                  <p className="text-xs text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CSV Table */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {content.outputFields.slice(0, 3).map(field => (
                        <th key={field} className="text-left p-2 capitalize">
                          {field.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }, (_, i) => (
                      <tr key={i} className="border-b">
                        {content.outputFields.slice(0, 3).map(field => (
                          <td key={field} className="p-2">
                            {mockData[field] || Math.floor(Math.random() * 100)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full btn-hero" size="lg">
              <Download className="w-5 h-5 mr-2" />
              Download Report
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  // Mock badge animation
                  alert('🏆 Badge Unlocked! +50 XP, +25 Coins');
                }}
              >
                <Award className="w-4 h-4 mr-2" />
                Submit
              </Button>
              <Button variant="outline" size="lg" onClick={() => setStage('workout')}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Redo
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
        <div className="text-center space-y-6 p-4 max-w-md">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          
          <div className="space-y-2">
            {processingSteps.map((step, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index <= processingStep 
                    ? 'opacity-100 text-primary font-medium' 
                    : 'opacity-30 text-muted-foreground'
                }`}
              >
                {index < processingStep && '✓ '}
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'workout') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-subtle border-b safe-top">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <Button variant="ghost" size="sm" onClick={() => setStage('detail')} className="tap-target">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold">Choose Mode</h1>
              <Button variant="ghost" size="sm" onClick={onBack} className="tap-target">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Cover Image with Overlay */}
        <div className="relative">
          <div className="aspect-video bg-gradient-to-r from-gray-300 to-gray-400 relative">
            {activity.image ? (
              <img 
                src={activity.image} 
                alt={activity.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                💪
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-purple-700/60 flex items-center justify-center">
              <h2 className="text-2xl font-bold text-white">Choose Mode</h2>
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="px-4 py-8 max-w-md mx-auto">
          <div className="grid grid-cols-1 gap-6">
            <Button
              onClick={() => handleModeSelect('upload')}
              className="h-24 bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary/5 text-foreground flex flex-col items-center justify-center space-y-2"
              variant="outline"
            >
              <Upload className="w-8 h-8" />
              <span className="font-semibold">Upload Video</span>
            </Button>

            <Button
              onClick={() => handleModeSelect('record')}
              className="h-24 bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary/5 text-foreground flex flex-col items-center justify-center space-y-2"
              variant="outline"
            >
              <Camera className="w-8 h-8" />
              <span className="font-semibold">Record Video</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Detail Stage
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-subtle border-b safe-top">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="w-10" /> {/* Spacer */}
            <h1 className="text-lg font-semibold">{activity.name}</h1>
            <Button variant="ghost" size="sm" onClick={onBack} className="tap-target">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="aspect-video bg-gradient-to-r from-gray-300 to-gray-400 relative">
        {activity.image ? (
          <img 
            src={activity.image} 
            alt={activity.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            💪
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-20 max-w-md mx-auto">
        {/* Title and Category */}
        <div className="py-6 border-b">
          <h1 className="text-2xl font-bold mb-2">{activity.name}</h1>
          <Badge variant="outline" className="mb-4">{content.category}</Badge>
          <p className="text-muted-foreground">{content.description}</p>
        </div>

        {/* Muscles */}
        <div className="py-6 border-b">
          <h3 className="font-semibold mb-3">Primary Muscles</h3>
          <div className="flex flex-wrap gap-2">
            {content.muscles.map((muscle) => (
              <Button
                key={muscle}
                variant="outline"
                size="sm"
                className="rounded-full bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
              >
                {muscle}
              </Button>
            ))}
          </div>
        </div>

        {/* How to do */}
        <div className="py-6 border-b">
          <h3 className="font-semibold mb-3">How to do</h3>
          <div className="space-y-3">
            {content.steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="py-6 border-b">
          <h3 className="font-semibold mb-3">Common Mistakes</h3>
          <div className="space-y-2">
            {content.mistakes.map((mistake, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{mistake}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Proceed Button */}
        <div className="py-6">
          <Button 
            onClick={() => setStage('workout')}
            className="w-full btn-hero"
            size="lg"
          >
            Proceed to Workout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;