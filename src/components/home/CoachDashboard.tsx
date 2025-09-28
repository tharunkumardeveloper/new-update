import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Settings, 
  User, 
  Target, 
  Trophy, 
  Calendar,
  Zap,
  Star,
  Users,
  Activity,
  BookOpen,
  MessageSquare,
  Plus,
  Filter,
  Download,
  Eye,
  Send
} from 'lucide-react';

interface CoachDashboardProps {
  userName: string;
  onTabChange: (tab: string) => void;
  activeTab: string;
  onProfileOpen?: () => void;
  onSettingsOpen?: () => void;
}

const CoachDashboard = ({ userName, onTabChange, activeTab, onProfileOpen, onSettingsOpen }: CoachDashboardProps) => {
  const [searchFocus, setSearchFocus] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Mock coach data
  const overviewStats = {
    totalAthletes: 28,
    activeToday: 22,
    challengesCompleted: 189,
    totalBadges: 412
  };

  const weeklyActivity = [
    { day: 'Mon', value: 85 },
    { day: 'Tue', value: 92 },
    { day: 'Wed', value: 78 },
    { day: 'Thu', value: 95 },
    { day: 'Fri', value: 88 },
    { day: 'Sat', value: 76 },
    { day: 'Sun', value: 82 }
  ];

  const challengeDistribution = [
    { domain: 'Strength', count: 52, color: 'bg-black text-white' },
    { domain: 'Endurance', count: 44, color: 'bg-black text-white' },
    { domain: 'Flexibility', count: 38, color: 'bg-black text-white' },
    { domain: 'Calisthenics', count: 34, color: 'bg-black text-white' },
    { domain: 'Para-Athlete', count: 21, color: 'bg-black text-white' }
  ];

  const athletes = [
    { id: 1, name: 'Ratheesh Kumar', email: 'ratheesh@sai.gov.in', level: 8, lastActivity: '2 hours ago', challenges: 12, badges: 28 },
    { id: 2, name: 'Priya Sharma', email: 'priya@sai.gov.in', level: 6, lastActivity: '1 day ago', challenges: 8, badges: 19 },
    { id: 3, name: 'Akash Patel', email: 'akash@sai.gov.in', level: 10, lastActivity: '30 min ago', challenges: 15, badges: 35 },
    { id: 4, name: 'Rohan Singh', email: 'rohan@sai.gov.in', level: 4, lastActivity: '3 hours ago', challenges: 6, badges: 14 },
    { id: 5, name: 'Kavya Nair', email: 'kavya@sai.gov.in', level: 7, lastActivity: '1 hour ago', challenges: 10, badges: 22 },
    { id: 6, name: 'Arjun Reddy', email: 'arjun@sai.gov.in', level: 9, lastActivity: '45 min ago', challenges: 14, badges: 31 },
    { id: 7, name: 'Sneha Gupta', email: 'sneha@sai.gov.in', level: 5, lastActivity: '4 hours ago', challenges: 7, badges: 16 },
    { id: 8, name: 'Vikram Joshi', email: 'vikram@sai.gov.in', level: 11, lastActivity: '1 hour ago', challenges: 18, badges: 42 }
  ];

  const filterTags = ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'Active Today', 'Inactive'];

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="border-2 border-black bg-white">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-black mr-2" />
              <span className="text-2xl font-bold text-black">{overviewStats.totalAthletes}</span>
            </div>
            <p className="text-sm text-black font-medium">Total Athletes</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black bg-white">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="w-5 h-5 text-black mr-2" />
              <span className="text-2xl font-bold text-black">{overviewStats.activeToday}</span>
            </div>
            <p className="text-sm text-black font-medium">Active Today</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black bg-white">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-black mr-2" />
              <span className="text-2xl font-bold text-black">{overviewStats.challengesCompleted}</span>
            </div>
            <p className="text-sm text-black font-medium">Challenges Done</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black bg-white">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-black mr-2" />
              <span className="text-2xl font-bold text-black">{overviewStats.totalBadges}</span>
            </div>
            <p className="text-sm text-black font-medium">Badges Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card className="border-2 border-black bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-black" />
            <span className="text-black">Weekly Athlete Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyActivity.map((stat) => (
              <div key={stat.day} className="flex items-center space-x-3">
                <span className="text-sm font-medium w-8 text-black">{stat.day}</span>
                <div className="flex-1 bg-gray-200 border border-black rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-black h-full rounded-full transition-all duration-500"
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
                <span className="text-sm text-black w-8">{stat.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Challenge Distribution */}
      <Card className="border-2 border-black bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-black">Challenge Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {challengeDistribution.map((item) => (
              <div key={item.domain} className="flex items-center justify-between p-3 rounded-lg border border-black">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-black" />
                  <span className="font-medium text-black">{item.domain}</span>
                </div>
                <Badge className="bg-black text-white border-black">{item.count} completed</Badge>
              </div>
            ))}
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
          <Card key={athlete.id} className="border-2 border-black bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-black">{athlete.name}</h3>
                  <p className="text-sm text-gray-600">{athlete.email}</p>
                </div>
                <Badge className="bg-black text-white border-black">Level {athlete.level}</Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                <div>
                  <div className="text-sm font-medium text-black">{athlete.challenges}</div>
                  <div className="text-xs text-gray-600">Challenges</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-black">{athlete.badges}</div>
                  <div className="text-xs text-gray-600">Badges</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-black">{athlete.lastActivity}</div>
                  <div className="text-xs text-gray-600">Last Active</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Target className="w-4 h-4 mr-1" />
                  Assign
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Send className="w-4 h-4 mr-1" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderChallengesContent = () => (
    <div className="space-y-6">
      {/* Add Challenge Button */}
      <Button className="w-full btn-hero" size="lg">
        <Plus className="w-5 h-5 mr-2" />
        Create New Challenge
      </Button>

      {/* Content Library */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Content Library</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <div className="text-2xl mb-1">🎥</div>
              <span className="text-xs">Exercise Videos</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <div className="text-2xl mb-1">📋</div>
              <span className="text-xs">Workout Plans</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <div className="text-2xl mb-1">📊</div>
              <span className="text-xs">Progress Templates</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <div className="text-2xl mb-1">📚</div>
              <span className="text-xs">Training Guides</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Challenges */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Recent Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Upper Body Strength', 'Cardio Endurance', 'Flexibility Focus'].map((challenge, index) => (
              <div key={challenge} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <h4 className="font-medium">{challenge}</h4>
                  <p className="text-sm text-muted-foreground">{12 - index * 2} athletes assigned</p>
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReportsContent = () => (
    <div className="space-y-6">
      {/* Export Options */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        <Button variant="outline" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Performance Overview */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-success/10">
                <div className="text-2xl font-bold text-success">87%</div>
                <p className="text-sm text-muted-foreground">Avg Completion Rate</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-2xl font-bold text-primary">6.2</div>
                <p className="text-sm text-muted-foreground">Avg Level</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain Strengths */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Domain Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {challengeDistribution.map((domain) => (
              <div key={domain.domain} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{domain.domain}</span>
                  <span>{Math.round((domain.count / 156) * 100)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${domain.color}`}
                    style={{ width: `${(domain.count / 156) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsContent = () => (
    <div className="space-y-6">
      {/* Send Announcement */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span>Send Announcement</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Announcement title..." />
          <textarea 
            className="w-full p-3 border rounded-lg resize-none h-24"
            placeholder="Write your message to athletes..."
          />
          <Button className="w-full btn-hero">
            <Send className="w-4 h-4 mr-2" />
            Send to All Athletes
          </Button>
        </CardContent>
      </Card>

      {/* Recent Announcements */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: 'New Challenge Available', date: '2 hours ago', recipients: 24 },
              { title: 'Weekly Progress Update', date: '1 day ago', recipients: 24 },
              { title: 'Training Schedule Change', date: '3 days ago', recipients: 18 }
            ].map((announcement, index) => (
              <div key={index} className="p-3 rounded-lg bg-secondary/30">
                <h4 className="font-medium">{announcement.title}</h4>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{announcement.date}</span>
                  <span>{announcement.recipients} recipients</span>
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
        return renderChallengesContent();
      default:
        return renderDashboardContent();
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'training':
        return 'Dashboard';
      case 'discover':
        return 'Athletes';
      case 'report':
        return 'Reports';
      case 'roadmap':
        return 'Challenges';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar - Same as athlete */}
      <div className="sticky top-0 z-50 bg-primary border-b border-primary-dark safe-top">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div>
              <h1 className="text-lg font-semibold text-white">Welcome, {userName}</h1>
              <p className="text-sm text-white/80">Coach</p>
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
        {/* Search Bar - Same as athlete */}
        <div className="mb-6 relative mt-8">
          <div className={`relative transition-all duration-300 ${
            searchFocus ? 'transform scale-105' : ''
          }`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search athletes, challenges..."
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

      {/* Bottom Navigation - Same as athlete but different labels */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-subtle border-t safe-bottom">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around">
            {[
              { id: 'training', label: 'Dashboard', icon: Zap },
              { id: 'discover', label: 'Athletes', icon: Users },
              { id: 'report', label: 'Reports', icon: Target },
              { id: 'roadmap', label: 'Challenges', icon: Calendar }
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

export default CoachDashboard;