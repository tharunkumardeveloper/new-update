import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, ArrowLeft, Upload, User, Target, Accessibility, X } from 'lucide-react';

interface SetupFlowProps {
  onComplete: (userData: any) => void;
  onSkip: () => void;
}

const SetupFlow = ({ onComplete, onSkip }: SetupFlowProps) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    gender: '',
    goals: [] as string[],
    isParaAthlete: false,
    disabilityType: '',
    bodyImage: null,
    height: 170,
    weight: 70,
    unit: 'metric' as 'metric' | 'imperial'
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const analysisSteps = [
    "Analyzing your body metrics",
    "Adjusting your fitness level (Beginner / Intermediate / Expert)",
    "Selecting personalized workouts",
    "Crafting your roadmap",
    "Your personalized content is ready 🚀"
  ];

  const goals = [
    { id: 'flexibility', label: 'Flexibility', icon: '🤸' },
    { id: 'strength', label: 'Strength', icon: '💪' },
    { id: 'endurance', label: 'Endurance', icon: '🏃' },
  ];

  const disabilityTypes = [
    'Visually Challenged',
    'Hearing Impaired',
    'Physical Disability',
    'Intellectual Disability',
    'Multiple Disabilities'
  ];

  const handleGoalToggle = (goalId: string) => {
    setUserData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUserData(prev => ({ ...prev, bodyImage: file }));
    }
  };

  const handleFinalSubmit = () => {
    setIsAnalyzing(true);
    let currentStep = 0;
    
    const timer = setInterval(() => {
      setAnalysisStep(currentStep);
      currentStep++;
      
      if (currentStep >= analysisSteps.length) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete(userData);
        }, 1000);
      }
    }, 1200);
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen gradient-violet flex flex-col items-center justify-center text-white p-4 safe-top safe-bottom">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Loading Circle */}
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
            <div className="absolute inset-4 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-2xl font-bold">100%</span>
            </div>
          </div>

          {/* Analysis Steps */}
          <div className="space-y-4 max-w-sm">
            {analysisSteps.map((stepText, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg transition-all duration-500 ${
                  index <= analysisStep
                    ? 'bg-white/20 text-white animate-slide-up'
                    : 'bg-white/5 text-white/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index < analysisStep
                      ? 'bg-green-500 text-white'
                      : index === analysisStep
                      ? 'bg-white text-primary animate-pulse'
                      : 'bg-white/20 text-white/50'
                  }`}>
                    {index < analysisStep ? '✓' : index + 1}
                  </div>
                  <span className="text-sm font-medium">{stepText}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 safe-top safe-bottom">
      <div className="max-w-md mx-auto pt-8">
        {/* Header with Skip Option */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Setup Your Profile</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Skip Setup
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Gender Selection */}
        {step === 1 && (
          <Card className="animate-slide-up">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Tell us about yourself</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Gender (Optional)</Label>
                <RadioGroup
                  value={userData.gender}
                  onValueChange={(value) => setUserData(prev => ({ ...prev, gender: value }))}
                >
                  {['Male', 'Female', 'Other', 'Prefer not to say'].map((gender) => (
                    <div key={gender} className="flex items-center space-x-2">
                      <RadioGroupItem value={gender.toLowerCase()} id={gender.toLowerCase()} />
                      <Label htmlFor={gender.toLowerCase()}>{gender}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={onSkip}
                  className="flex-1 mr-2"
                >
                  Skip All
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 ml-2 btn-hero"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Fitness Goals */}
        {step === 2 && (
          <Card className="animate-slide-up">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>What are your fitness goals?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => handleGoalToggle(goal.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      userData.goals.includes(goal.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <span className="font-medium">{goal.label}</span>
                      <Checkbox
                        checked={userData.goals.includes(goal.id)}
                        className="ml-auto"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 mr-2"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={userData.goals.length === 0}
                  className="flex-1 ml-2 btn-hero"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Para-Athlete Setup */}
        {step === 3 && (
          <Card className="animate-slide-up">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Accessibility className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Accessibility Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="para-athlete"
                    checked={userData.isParaAthlete}
                    onCheckedChange={(checked) =>
                      setUserData(prev => ({ ...prev, isParaAthlete: !!checked }))
                    }
                  />
                  <Label htmlFor="para-athlete">I am a para-athlete</Label>
                </div>

                {userData.isParaAthlete && (
                  <div className="space-y-3 animate-slide-up">
                    <Label>Disability Type</Label>
                    <RadioGroup
                      value={userData.disabilityType}
                      onValueChange={(value) => setUserData(prev => ({ ...prev, disabilityType: value }))}
                    >
                      {disabilityTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <RadioGroupItem value={type} id={type} />
                          <Label htmlFor={type}>{type}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 mr-2"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 ml-2 btn-hero"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Body Photo Upload */}
        {step === 4 && (
          <Card className="animate-slide-up">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Body Analysis Photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Upload Full Body Photo</Label>
                <p className="text-sm text-muted-foreground">
                  Upload a full-body photo to help our AI analyze your height and weight for personalized recommendations.
                </p>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Upload your body photo</p>
                    <p className="text-sm text-muted-foreground">
                      This helps us estimate your measurements for better workout recommendations
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="mt-6 text-sm"
                  />
                </div>
                {userData.bodyImage && (
                  <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                    <p className="text-sm text-success flex items-center">
                      ✓ Photo uploaded successfully - AI will analyze your measurements
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 mr-2"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!userData.bodyImage}
                  className="flex-1 ml-2 btn-hero"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Height & Weight Manual Input */}
        {step === 5 && (
          <Card className="animate-slide-up">
            <CardHeader className="text-center">
              <CardTitle>Confirm Your Measurements</CardTitle>
              <p className="text-sm text-muted-foreground">
                Adjust if our AI analysis needs correction
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Unit Toggle */}
              <div className="flex justify-center">
                <div className="flex bg-secondary rounded-lg p-1">
                  <Button
                    variant={userData.unit === 'metric' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setUserData(prev => ({ ...prev, unit: 'metric' }))}
                  >
                    Metric
                  </Button>
                  <Button
                    variant={userData.unit === 'imperial' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setUserData(prev => ({ ...prev, unit: 'imperial' }))}
                  >
                    Imperial
                  </Button>
                </div>
              </div>

              {/* Height & Weight Selectors */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <Label className="text-sm font-medium mb-2 block">
                    Height {userData.unit === 'metric' ? '(cm)' : '(ft)'}
                  </Label>
                  <div className="bg-secondary rounded-lg p-4">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {userData.height}
                    </div>
                    <input
                      type="range"
                      min={userData.unit === 'metric' ? 140 : 4.5}
                      max={userData.unit === 'metric' ? 220 : 7.5}
                      step={userData.unit === 'metric' ? 1 : 0.1}
                      value={userData.height}
                      onChange={(e) => setUserData(prev => ({ ...prev, height: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <Label className="text-sm font-medium mb-2 block">
                    Weight {userData.unit === 'metric' ? '(kg)' : '(lbs)'}
                  </Label>
                  <div className="bg-secondary rounded-lg p-4">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {userData.weight}
                    </div>
                    <input
                      type="range"
                      min={userData.unit === 'metric' ? 40 : 90}
                      max={userData.unit === 'metric' ? 150 : 330}
                      step={1}
                      value={userData.weight}
                      onChange={(e) => setUserData(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-info/10 rounded-lg border border-info/20">
                <p className="text-sm text-info">
                  💡 These measurements were estimated from your photo. Adjust if needed for accurate workout recommendations.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 mr-2"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleFinalSubmit}
                  className="flex-1 ml-2 btn-hero"
                >
                  Complete Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SetupFlow;