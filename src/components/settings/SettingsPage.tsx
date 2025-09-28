import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Bell, 
  Moon, 
  UserX, 
  LogOut, 
  Info,
  Shield,
  HelpCircle
} from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage = ({ onBack }: SettingsPageProps) => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailUpdates: true,
    workoutReminders: true,
    achievementAlerts: true
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
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
            <h1 className="text-lg font-semibold text-white">Settings</h1>
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 max-w-md mx-auto pt-6 space-y-6">
        {/* Notifications */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about workouts and challenges</p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={() => toggleSetting('notifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="workout-reminders">Workout Reminders</Label>
                <p className="text-sm text-muted-foreground">Daily workout reminders</p>
              </div>
              <Switch
                id="workout-reminders"
                checked={settings.workoutReminders}
                onCheckedChange={() => toggleSetting('workoutReminders')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="achievement-alerts">Achievement Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when you earn badges</p>
              </div>
              <Switch
                id="achievement-alerts"
                checked={settings.achievementAlerts}
                onCheckedChange={() => toggleSetting('achievementAlerts')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-updates">Email Updates</Label>
                <p className="text-sm text-muted-foreground">Weekly progress reports via email</p>
              </div>
              <Switch
                id="email-updates"
                checked={settings.emailUpdates}
                onCheckedChange={() => toggleSetting('emailUpdates')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Moon className="w-5 h-5 mr-2" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch to dark theme</p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={() => toggleSetting('darkMode')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Account Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start text-warning hover:bg-warning/10">
              <UserX className="w-4 h-4 mr-3" />
              Deactivate Account
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10">
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="w-4 h-4 mr-3" />
              Help Center
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Info className="w-4 h-4 mr-3" />
              Privacy Policy
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Info className="w-4 h-4 mr-3" />
              Terms of Service
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="w-5 h-5 mr-2" />
              App Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build</span>
                <span className="font-medium">2024.09.28</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credits</span>
                <span className="font-medium">TalentTrack Team</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;