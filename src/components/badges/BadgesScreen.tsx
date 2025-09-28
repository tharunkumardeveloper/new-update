import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Trophy, Star, Target, Zap, Award, Lock } from 'lucide-react';

interface BadgesScreenProps {
  onBack: () => void;
}

const BadgesScreen = ({ onBack }: BadgesScreenProps) => {
  // Generate 50 badges with activity-based categories
  const badgeCategories = [
    { name: 'Strength', icon: '💪', color: 'challenge-blue' },
    { name: 'Endurance', icon: '🏃', color: 'challenge-purple' },
    { name: 'Flexibility', icon: '🧘', color: 'challenge-light-blue' },
    { name: 'Calisthenics', icon: '🤸', color: 'challenge-gray' },
    { name: 'Para-Athlete', icon: '♿', color: 'challenge-maroon' }
  ];

  const strengthBadges = [
    'Strength Novice', 'Push-up Starter', 'Pull-up Beginner', 'Medicine Ball Basic', 'Upper Body Builder',
    'Core Crusher', 'Total Power', 'Push-up Master', 'Resistance Pro', 'Strength Elite'
  ];

  const enduranceBadges = [
    'Endurance Starter', '800m Runner', 'Shuttle Sprinter', 'Distance Walker', 'Cardio Champion',
    'Marathon Prep', 'Sprint Master', 'HIIT Hero', 'Stamina Builder', 'Endurance Elite'
  ];

  const flexibilityBadges = [
    'Flexibility Focus', 'Sit-and-Reach Pro', 'Cobra Master', 'Chest Opener', 'Flow Expert',
    'Morning Stretcher', 'Deep Stretch Pro', 'Yoga Beginner', 'Mobility Master', 'Zen Flexibility'
  ];

  const calisthenicsBadges = [
    'Calisthenics Basic', 'Jumping Jack Pro', 'Plank Master', 'Body Weight Expert', 'Movement Flow',
    'Dynamic Trainer', 'Functional Fit', 'No Equipment Pro', 'Street Workout', 'Calisthenics Elite'
  ];

  const paraAthleteBadges = [
    'Para Strong', 'Knee Push-up Pro', 'Assisted Training', 'Modified Master', 'Adaptive Athlete',
    'Inclusive Fitness', 'Supported Strength', 'Accessibility Pro', 'Assisted Cardio', 'Para Elite'
  ];

  const allBadgeNames = [
    ...strengthBadges, ...enduranceBadges, ...flexibilityBadges, ...calisthenicsBadges, ...paraAthleteBadges
  ];

  const badges = Array.from({ length: 50 }, (_, i) => {
    const categoryIndex = Math.floor(i / 10);
    const category = badgeCategories[categoryIndex];
    const isEarned = i < 12; // User has earned first 12 badges
    
    return {
      id: i + 1,
      name: allBadgeNames[i] || `${category.name} Badge ${i + 1}`,
      description: `Master ${category.name.toLowerCase()} activities and unlock advanced training`,
      icon: category.icon,
      color: category.color,
      earned: isEarned,
      progress: isEarned ? 100 : Math.floor(Math.random() * 80) + 10,
      requirement: `Complete ${Math.floor(i / 5) + 1} challenges`,
      category: category.name
    };
  });

  const earnedBadges = badges.filter(b => b.earned);
  const unlockedBadges = badges.filter(b => !b.earned);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-primary border-b border-primary-dark safe-top">
        <div className="px-4 py-4">
          <div className="flex items-center max-w-md mx-auto">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-3 text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-white">All Badges</h1>
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 max-w-md mx-auto pt-6 space-y-6">
        {/* Summary */}
        <Card className="card-elevated">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="w-12 h-12 text-warning" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{earnedBadges.length} / {badges.length}</h2>
            <p className="text-muted-foreground">Badges Earned</p>
            <Progress value={(earnedBadges.length / badges.length) * 100} className="mt-4" />
          </CardContent>
        </Card>

        {/* Earned Badges */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-warning" />
            Earned Badges ({earnedBadges.length})
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {earnedBadges.map((badge) => (
              <Card key={badge.id} className={`relative overflow-hidden ${badge.color}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <CardContent className="p-4 text-center text-white relative">
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs opacity-90">{badge.description}</p>
                  <Badge className="mt-2 bg-white/20 text-white hover:bg-white/30" variant="outline">
                    <Star className="w-3 h-3 mr-1" />
                    Earned
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Locked Badges */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-muted-foreground" />
            In Progress ({unlockedBadges.length})
          </h3>
          <div className="space-y-3">
            {unlockedBadges.slice(0, 10).map((badge) => (
              <Card key={badge.id} className="card-elevated">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl opacity-50">{badge.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                      <div className="space-y-1">
                        <Progress value={badge.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{badge.progress}% complete</span>
                          <span>{badge.requirement}</span>
                        </div>
                      </div>
                    </div>
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {unlockedBadges.length > 10 && (
            <Button variant="outline" className="w-full mt-4">
              Show More ({unlockedBadges.length - 10} remaining)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadgesScreen;