import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Settings, User, Target, Trophy, Calendar, Zap, Star, Users, Activity, BookOpen, MessageSquare, Plus, Filter, Download, Eye, Send, ChartBar as BarChart3, Shield, UserCheck } from 'lucide-react';

interface SAIAdminDashboardProps {
  userName: string;
  onTabChange: (tab: string) => void;
  activeTab: string;
  onProfileOpen?: () => void;
  onSettingsOpen?: () => void;
}

const SAIAdminDashboard = ({ userName, onTabChange, activeTab, onProfileOpen, onSettingsOpen }: SAIAdminDashboardProps) => {
  const [searchFocus, setSearchFocus] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Mock SAI Admin data
  const overviewStats = {
    totalAthletes: 156,
    totalCoaches: 12,
    activeChallenges: 45,
    systemBadges: 1248
  };

  const systemActivity = [
    { day: 'Mon', value: 89 },
    { day: 'Tue', value: 94 },
    { day: 'Wed', value: 82 },
    { day: 'Thu', value: 97 },
    { day: 'Fri', value: 91 },
    { day: 'Sat', value: 78 },
    { day: 'Sun', value: 85 }
  ];

  const challengeOverview = [
    { domain: 'Strength', active: 12, completed: 89, color: 'bg-black text-white' },
    { domain: 'Endurance', active: 8, completed: 76, color: 'bg-black text-white' },
    { domain: 'Flexibility', active: 10, completed: 65, color: 'bg-black text-white' },
    { domain: 'Calisthenics', active: 9, completed: 58, color: 'bg-black text-white' },
    { domain: 'Para-Athlete', active: 6, completed: 34, color: 'bg-black text-white' }
  ];

  const athletes = [
    { id: 1, name: 'Ratheesh Kumar', coach: 'Rajesh Menon', level: 8, status: 'Active', challenges: 12, badges: 28 },
    { id: 2, name: 'Priya Sharma', coach: 'Anjali Desai', level: 6, status: 'Active', challenges: 8, badges: 19 },
    { id: 3, name: 'Akash Patel', coach: 'Vikram Singh', level: 10, status: 'Active', challenges: 15, badges: 35 },
    { id: 4, name: 'Rohan Singh', coach: 'Rajesh Menon', level: 4, status: 'Inactive', challenges: 6, badges: 14 },
    { id: 5, name: 'Kavya Nair', coach: 'Sunita Rao', level: 7, status: 'Active', challenges: 10, badges: 22 },
    { id: 6, name: 'Arjun Reddy', coach: 'Vikram Singh', level: 9, status: 'Active', challenges: 14, badges: 31 }
  ];

  const coaches = [
    { id: 1, name: 'Rajesh Menon', athletes: 15, specialization: 'Strength Training', experience: '8 years', status: 'Active' },
    { id: 2, name: 'Anjali Desai', athletes: 12, specialization: 'Endurance', experience: '6 years', status: 'Active' },
    { id: 3, name: 'Vikram Singh', athletes: 18, specialization: 'Calisthenics', experience: '10 years', status: 'Active' },
    { id: 4, name: 'Sunita Rao', athletes: 14, specialization: 'Flexibility', experience: '7 years', status: 'Active' },
    { id: 5, name: 'Kiran Kumar', athletes: 11, specialization: 'Para-Athlete', experience: '9 years', status: 'Active' }
  ];

  const filterTags = ['All Athletes', 'Active', 'Inactive', 'High Performers', 'Needs Attention'];

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-primary mr-2" />
              <span className="text-2xl font-bold text-primary">{overviewStats.totalAthletes}</span>
            </div>
            <p className="text-sm text-foreground font-medium">Total Athletes</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-success bg-gradient-to-br from-success/10 to-success/5">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <UserCheck className="w-5 h-5 text-success mr-2" />
              <span className="text-2xl font-bold text-success">{overviewStats.totalCoaches}</span>
            </div>
            <p className="text-sm text-foreground font-medium">Total Coaches</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-info bg-gradient-to-br from-info/10 to-info/5">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-info mr-2" />
              <span className="text-2xl font-bold text-info">{overviewStats.activeChallenges}</span>
            </div>
            <p className="text-sm text-foreground font-medium">Active Challenges</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-warning bg-gradient-to-br from-warning/10 to-warning/5">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-warning mr-2" />
              <span className="text-2xl font-bold text-warning">{overviewStats.systemBadges}</span>
            </div>
            <p className="text-sm text-foreground font-medium">System Badges</p>
          </CardContent>
        </Card>
      </div>

      {/* System Activity Chart */}
      <Card className="card-elevated">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>System Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemActivity.map((stat) => (
              <div key={stat.day} className="flex items-center space-x-3">
                <span className="text-sm font-medium w-8">{stat.day}</span>
                <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
                <span className="text-sm w-8">{stat.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Challenge Overview */}
      <Card className="card-elevated">
        <CardHeader className="pb-3">
          <CardTitle>Challenge Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {challengeOverview.map((item) => (
              <div key={item.domain} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                  <span className="font-medium">{item.domain}</span>
                </div>
                <div className="flex space-x-2">
                  <Badge className="bg-primary text-primary-foreground">{item.active} active</Badge>
                  <Badge variant="outline">{item.completed} completed</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Athletes Leaderboard */}
      <Card className="card-elevated">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-warning" />
            <span>Top Athletes Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Ratheesh Kumar', domain: 'Strength', level: 12, points: 2450, badges: 35, rank: 1 },
              { name: 'Priya Sharma', domain: 'Endurance', level: 11, points: 2380, badges: 32, rank: 2 },
              { name: 'Akash Patel', domain: 'Calisthenics', level: 10, points: 2250, badges: 28, rank: 3 },
              { name: 'Kavya Nair', domain: 'Flexibility', level: 9, points: 2100, badges: 25, rank: 4 },
              { name: 'Arjun Reddy', domain: 'Para-Athlete', level: 8, points: 1950, badges: 22, rank: 5 },
              { name: 'Sneha Gupta', domain: 'Strength', level: 8, points: 1890, badges: 21, rank: 6 },
              { name: 'Vikram Joshi', domain: 'Endurance', level: 7, points: 1750, badges: 19, rank: 7 },
              { name: 'Rohan Singh', domain: 'Calisthenics', level: 7, points: 1680, badges: 18, rank: 8 }
            ].map((athlete) => (
              <div key={athlete.name} className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    athlete.rank === 1 ? 'bg-yellow-500 text-white' :
                    athlete.rank === 2 ? 'bg-gray-400 text-white' :
                    athlete.rank === 3 ? 'bg-amber-600 text-white' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {athlete.rank}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{athlete.name}</h4>
                    <p className="text-xs text-muted-foreground">{athlete.domain}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-right">
                  <div>
                    <div className="text-sm font-medium">Level {athlete.level}</div>
                    <div className="text-xs text-muted-foreground">{athlete.points} pts</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Trophy className="w-3 h-3 mr-1" />
                    {athlete.badges}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View Full Leaderboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAthletesContent = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filterTags.map((tag) => (
          <Button
            key={tag}
            variant={selectedFilter === tag ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(selectedFilter === tag ? null : tag)}
            className="rounded-full h-8 text-xs bg-white text-black border-black hover:bg-black hover:text-white"
          >
            {tag}
          </Button>
        ))}
      </div>

      {/* Athletes List */}
      <div className="space-y-3">
        {athletes.map((athlete) => (
          <Card key={athlete.id} className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{athlete.name}</h3>
                  <p className="text-sm text-muted-foreground">Coach: {athlete.coach}</p>
                </div>
                <div className="flex space-x-2">
                  <Badge className="bg-primary text-primary-foreground">Level {athlete.level}</Badge>
                  <Badge className={athlete.status === 'Active' ? 'bg-success/10 text-success border-success' : 'bg-destructive/10 text-destructive border-destructive'}>
                    {athlete.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3 text-center">
                <div>
                  <div className="text-sm font-medium">{athlete.challenges}</div>
                  <div className="text-xs text-muted-foreground">Challenges</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{athlete.badges}</div>
                  <div className="text-xs text-muted-foreground">Badges</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View Profile
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCoachesContent = () => (
    <div className="space-y-6">
      {/* Coaches List */}
      <div className="space-y-3">
        {coaches.map((coach) => (
          <Card key={coach.id} className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{coach.name}</h3>
                  <p className="text-sm text-muted-foreground">{coach.specialization}</p>
                </div>
                <Badge className="bg-success/10 text-success border-success">{coach.status}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3 text-center">
                <div>
                  <div className="text-sm font-medium">{coach.athletes}</div>
                  <div className="text-xs text-muted-foreground">Athletes</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{coach.experience}</div>
                  <div className="text-xs text-muted-foreground">Experience</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Users className="w-4 h-4 mr-1" />
                  Manage Athletes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReportsContent = () => (
    <div className="space-y-6">
      {/* Export Options */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Export System Data
        </Button>
        <Button variant="outline" size="lg">
          <BarChart3 className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* System Performance */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-success/10">
                <div className="text-2xl font-bold text-success">94%</div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-2xl font-bold text-primary">8.7</div>
                <p className="text-sm text-muted-foreground">Avg User Rating</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Analytics */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { metric: 'Daily Active Users', value: '142', trend: '+12%' },
              { metric: 'Challenge Completion Rate', value: '87%', trend: '+5%' },
              { metric: 'Badge Earning Rate', value: '3.2/user', trend: '+8%' },
              { metric: 'Coach Engagement', value: '91%', trend: '+3%' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">{item.metric}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{item.value}</span>
                  <Badge className="bg-success/10 text-success border-success">{item.trend}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getTabContent = () => {
    switch (activeTab) {
      case 'training':
        return renderDashboardContent();
      case 'discover':
        return renderAthletesContent();
      case 'report':
        return renderReportsContent();
      case 'roadmap':
        return renderCoachesContent();
      default:
        return renderDashboardContent();
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'training':
        return 'System Overview';
      case 'discover':
        return 'Athletes';
      case 'report':
        return 'Reports & Analytics';
      case 'roadmap':
        return 'Coaches';
      default:
        return 'System Overview';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-primary border-b border-primary-dark safe-top">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div>
              <h1 className="text-lg font-semibold text-white">Welcome, {userName}</h1>
              <p className="text-sm text-white/80">SAI Admin</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="tap-target text-white hover:bg-white/20" onClick={onSettingsOpen}>
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="tap-target text-white hover:bg-white/20" onClick={onProfileOpen}>
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-20 max-w-md mx-auto">
        {/* Search Bar */}
        <div className="mb-6 relative mt-8">
          <div className={`relative transition-all duration-300 ${
            searchFocus ? 'transform scale-105' : ''
          }`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search system data..."
              className="pl-10 h-12 rounded-xl border-2 border-violet-800 bg-violet-950/20 focus:border-violet-600 focus:bg-violet-900/30"
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
            />
          </div>
          {searchFocus && (
            <Card className="absolute top-full mt-2 w-full z-10 animate-slide-up">
              <CardContent className="p-3">
                <p className="text-sm text-muted-foreground">Search recommendations will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tab Content */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">{getTabTitle()}</h2>
          {getTabContent()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-subtle border-t safe-bottom">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around">
            {[
              { id: 'training', label: 'Overview', icon: Shield },
              { id: 'discover', label: 'Athletes', icon: Users },
              { id: 'report', label: 'Reports', icon: BarChart3 },
              { id: 'roadmap', label: 'Coaches', icon: UserCheck }
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(id)}
                className={`flex flex-col items-center space-y-1 tap-target ${
                  activeTab === id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SAIAdminDashboard;