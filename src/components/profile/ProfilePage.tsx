import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Camera, 
  Mail, 
  Phone, 
  Lock, 
  Trophy, 
  Coins,
  Scale,
  Ruler,
  Target
} from 'lucide-react';

interface ProfilePageProps {
  userName: string;
  userEmail?: string;
  onBack: () => void;
  onLogout?: () => void;
}

const ProfilePage = ({ userName, userEmail = "user@example.com", onBack, onLogout }: ProfilePageProps) => {
  const [profileData, setProfileData] = useState({
    name: userName,
    email: userEmail,
    mobile: "+1 (555) 123-4567",
    height: "175 cm",
    weight: "70 kg",
    bmi: "22.9"
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const achievements = {
    badges: 12,
    coins: 1250
  };

  const userLevel = {
    level: 8,
    progress: 73,
    xp: 3650,
    nextLevelXp: 5000
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-primary border-b border-primary-dark safe-top">
        <div className="px-4 py-4">
          <div className="flex items-center max-w-md mx-auto">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-3 text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-white">Profile</h1>
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 max-w-md mx-auto pt-6 space-y-6">
        {/* Profile Photo */}
        <Card className="card-elevated">
          <CardContent className="p-6 text-center">
            <div className="relative mb-4">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0"
                variant="outline"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <h2 className="text-xl font-bold">{profileData.name}</h2>
            <p className="text-sm text-muted-foreground">{profileData.email}</p>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="mobile"
                  type="tel"
                  value={profileData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="pl-10 mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Lock className="w-4 h-4 mr-3" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Mail className="w-4 h-4 mr-3" />
              Change Email
            </Button>
          </CardContent>
        </Card>

        {/* Level Progress */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Level Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Level {userLevel.level}</span>
                <span className="text-sm text-muted-foreground">{userLevel.progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${userLevel.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{userLevel.xp} XP</span>
                <span>{userLevel.nextLevelXp} XP</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Summary */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-warning" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-warning/10">
                <Badge className="w-8 h-8 rounded-full bg-warning text-warning-foreground p-0 flex items-center justify-center mb-2">
                  <Trophy className="w-4 h-4" />
                </Badge>
                <div className="text-2xl font-bold text-warning">{achievements.badges}</div>
                <div className="text-xs text-muted-foreground">Badges</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <Badge className="w-8 h-8 rounded-full bg-primary text-primary-foreground p-0 flex items-center justify-center mb-2">
                  <Coins className="w-4 h-4" />
                </Badge>
                <div className="text-2xl font-bold text-primary">{achievements.coins}</div>
                <div className="text-xs text-muted-foreground">Coins</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fitness Stats */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-success" />
              Fitness Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height</Label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="height"
                    value={profileData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="pl-10 mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="weight"
                    value={profileData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="pl-10 mt-1"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 bg-info/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current BMI</span>
                <span className="text-lg font-bold text-info">{profileData.bmi}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Normal Weight</p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button className="w-full" size="lg">
          Save Changes
        </Button>

        {/* Logout Button */}
        <Button 
          variant="ghost" 
          size="lg" 
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => {
            // Clear any stored user data/session
            localStorage.clear();
            sessionStorage.clear();
            // Redirect to auth flow
            onLogout ? onLogout() : onBack();
          }}
        >
          <Lock className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;