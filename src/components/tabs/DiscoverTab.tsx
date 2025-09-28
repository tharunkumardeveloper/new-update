import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Clock, Star } from 'lucide-react';

const DiscoverTab = () => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filterCategories = ['Strength', 'Endurance', 'Flexibility', 'Calisthenics', 'Para-Athlete'];
  const getChallengeData = (index: number) => {
    const challengeNames = [
      // Strength Challenges (10)
      "Strength Builder 1 – Push-up Streak", "Strength Builder 2 – Pull-up Power", "Strength Builder 3 – Medicine Ball Mastery",
      "Strength Builder 4 – Upper Body Blast", "Strength Builder 5 – Core Crusher", "Strength Builder 6 – Total Power",
      "Strength Builder 7 – Push-up Evolution", "Strength Builder 8 – Resistance Training", "Strength Builder 9 – Power Lifter",
      "Strength Builder 10 – Elite Strength",
      
      // Endurance Challenges (10)
      "Endurance Pro 1 – 800m Run Test", "Endurance Pro 2 – Shuttle Sprint", "Endurance Pro 3 – Distance Runner",
      "Endurance Pro 4 – Cardio Blast", "Endurance Pro 5 – Marathon Prep", "Endurance Pro 6 – Sprint Training",
      "Endurance Pro 7 – HIIT Master", "Endurance Pro 8 – Stamina Builder", "Endurance Pro 9 – Racing Challenge",
      "Endurance Pro 10 – Endurance Elite",
      
      // Flexibility Challenges (10)
      "Flexibility Focus 1 – Sit-and-Reach", "Flexibility Focus 2 – Cobra Stretch Hold", "Flexibility Focus 3 – Chest Opener",
      "Flexibility Focus 4 – Full Body Flow", "Flexibility Focus 5 – Morning Stretch", "Flexibility Focus 6 – Deep Stretch",
      "Flexibility Focus 7 – Yoga Basics", "Flexibility Focus 8 – Mobility Master", "Flexibility Focus 9 – Range Builder",
      "Flexibility Focus 10 – Zen Flexibility",
      
      // Calisthenics Challenges (10)
      "Calisthenics Blast 1 – Jumping Jack Circuit", "Calisthenics Blast 2 – Plank Power", "Calisthenics Blast 3 – Body Weight",
      "Calisthenics Blast 4 – Movement Flow", "Calisthenics Blast 5 – Dynamic Training", "Calisthenics Blast 6 – Functional Fit",
      "Calisthenics Blast 7 – No Equipment", "Calisthenics Blast 8 – Street Workout", "Calisthenics Blast 9 – Bar Skills",
      "Calisthenics Blast 10 – Advanced Flow",
      
      // Para-Athlete Challenges (10)
      "Para Strong 1 – Knee Push-up Series", "Para Strong 2 – Assisted Shuttle Drill", "Para Strong 3 – Modified Movement",
      "Para Strong 4 – Adaptive Training", "Para Strong 5 – Inclusive Fitness", "Para Strong 6 – Supported Strength",
      "Para Strong 7 – Accessibility Focus", "Para Strong 8 – Assisted Cardio", "Para Strong 9 – Modified Endurance",
      "Para Strong 10 – Adaptive Elite"
    ];
    
    const challengeTypes = ['Strength', 'Endurance', 'Flexibility', 'Calisthenics', 'Para-Athlete'];
    const colors = ['challenge-blue', 'challenge-purple', 'challenge-light-blue', 'challenge-gray', 'challenge-maroon'];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
    
    const typeIndex = Math.floor(index / 10);
    const color = colors[typeIndex % colors.length];
    const difficulty = difficulties[index % difficulties.length];
    const name = challengeNames[index] || `${challengeTypes[typeIndex % challengeTypes.length]} Challenge ${index + 1}`;
    
    return { name, color, difficulty, type: challengeTypes[typeIndex % challengeTypes.length] };
  };

  const getFilteredChallenges = () => {
    if (!selectedFilter) return Array.from({ length: 25 }, (_, i) => getChallengeData(i)); // Show 5 from each category
    
    const categoryIndex = filterCategories.indexOf(selectedFilter);
    const startIndex = categoryIndex * 10;
    return Array.from({ length: 5 }, (_, i) => getChallengeData(startIndex + i));
  };

  const recommendations = [
    {
      id: 1,
      type: 'Trending Workout',
      title: 'HIIT Cardio Blast',
      creator: 'FitnessPro',
      rating: 4.8,
      participants: 2340,
      duration: '20 min',
      image: '🔥'
    },
    {
      id: 2,
      type: 'New Challenge',
      title: 'Summer Shred',
      creator: 'AthleteCoach',
      rating: 4.9,
      participants: 1876,
      duration: '8 weeks',
      image: '☀️'
    },
    {
      id: 3,
      type: 'Popular',
      title: 'Yoga Flow Basics',
      creator: 'ZenMaster',
      rating: 4.7,
      participants: 3210,
      duration: '30 min',
      image: '🧘'
    },
    {
      id: 4,
      type: 'Editor\'s Pick',
      title: 'Strength Builder',
      creator: 'PowerLifter',
      rating: 4.9,
      participants: 987,
      duration: '45 min',
      image: '💪'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Discover</h1>
        <p className="text-muted-foreground">Find your next favorite workout</p>
      </div>

      {/* Filter Tags */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(null)}
            >
              All
            </Button>
            {filterCategories.map((category) => (
              <Button
                key={category}
                variant={selectedFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending Section */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Trending Now</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                <div className="text-3xl">{item.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 truncate">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">by {item.creator}</p>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{item.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{item.participants}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.duration}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Try
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Strength', icon: '💪', color: 'challenge-blue' },
            { name: 'Cardio', icon: '❤️', color: 'challenge-purple' },
            { name: 'Flexibility', icon: '🤸', color: 'challenge-light-blue' },
            { name: 'Recovery', icon: '😌', color: 'challenge-gray' },
            { name: 'Sports', icon: '⚽', color: 'challenge-maroon' },
            { name: 'Agility', icon: '⚡', color: 'challenge-blue' }
          ].map((category) => (
            <Card key={category.name} className={`cursor-pointer hover:scale-105 transition-transform ${category.color}`}>
              <CardContent className="p-4 text-center text-white">
                <div className="text-2xl mb-2">{category.icon}</div>
                <h3 className="font-semibold">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filtered Challenge Catalog */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {selectedFilter ? `${selectedFilter} Challenges` : 'All Challenges'}
        </h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {getFilteredChallenges().map((challengeData, i) => (
            <Card key={i} id={`challenge-${i + 1}`} className={`cursor-pointer hover:scale-105 transition-transform ${challengeData.color}`}>
              <CardContent className="p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{challengeData.name}</h3>
                    <p className="text-xs opacity-90 mb-2">{challengeData.difficulty} Level</p>
                    <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
                      {Math.floor(Math.random() * 1000) + 100} participants
                    </Badge>
                  </div>
                  <Button size="sm" variant="secondary" className="ml-4">
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverTab;