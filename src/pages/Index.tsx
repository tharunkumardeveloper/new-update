import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import AuthFlow from '@/components/auth/AuthFlow';
import SetupFlow from '@/components/setup/SetupFlow';
import HomeScreen from '@/components/home/HomeScreen';
import CoachDashboard from '@/components/home/CoachDashboard';
import SAIAdminDashboard from '@/components/home/SAIAdminDashboard';
import DiscoverTab from '@/components/tabs/DiscoverTab';
import ReportTab from '@/components/tabs/ReportTab';
import RoadmapTab from '@/components/tabs/RoadmapTab';
import ActivityDetail from '@/components/activities/ActivityDetail';
import ProfilePage from '@/components/profile/ProfilePage';
import SettingsPage from '@/components/settings/SettingsPage';
import BadgesScreen from '@/components/badges/BadgesScreen';

type AppState = 'loading' | 'auth' | 'setup' | 'home' | 'profile' | 'settings' | 'badges';
type UserRole = 'athlete' | 'coach' | 'admin';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [userRole, setUserRole] = useState<UserRole>('athlete');
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('training');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [userSetupData, setUserSetupData] = useState<any>(null);

  // Simulate checking for returning user
  useEffect(() => {
    const isReturningUser = localStorage.getItem('talenttrack_user');
    if (isReturningUser) {
      const userData = JSON.parse(isReturningUser);
      setUserRole(userData.role);
      setUserName(userData.name);
      setIsFirstTime(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    // If returning user, skip to home
    if (!isFirstTime) {
      setAppState('home');
    } else {
      setAppState('auth');
    }
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    // Set demo names based on role
    const names = {
      athlete: 'Ratheesh',
      coach: 'Rajesh Menon',
      admin: 'Arjun Krishnan'
    };
    setUserName(names[role]);
    
    // Check if user needs setup (simulate first-time login)
    if (isFirstTime) {
      setAppState('setup');
    } else {
      setAppState('home');
    }
  };

  const handleSetupComplete = (userData: any) => {
    // Save user data
    setUserSetupData(userData);
    localStorage.setItem('talenttrack_user', JSON.stringify({
      role: userRole,
      name: userName,
      setupComplete: true,
      ...userData
    }));
    setIsFirstTime(false);
    setAppState('home');
  };

  const handleActivitySelect = (activity: any) => {
    setSelectedActivity(activity);
  };

  const handleActivityBack = () => {
    setSelectedActivity(null);
  };

  const handleStartWorkout = () => {
    // This would navigate to workout screen in a real app
    alert('Workout feature coming soon! This would start the video recording/upload flow.');
  };

  const handleProfileOpen = () => {
    setAppState('profile');
  };

  const handleSettingsOpen = () => {
    setAppState('settings');
  };

  const handleBadgesOpen = () => {
    setAppState('badges');
  };

  const handleBackToHome = () => {
    setAppState('home');
  };

  const handleChallengeRedirect = (challengeId: number) => {
    setActiveTab('discover');
    // In a real app, you'd scroll to the specific challenge
    setTimeout(() => {
      const element = document.getElementById(`challenge-${challengeId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const renderTabContent = () => {
    // For coach and admin, use different content structure
    if (userRole === 'coach' || userRole === 'admin') {
      return null; // CoachDashboard handles its own content
    }
    
    switch (activeTab) {
      case 'discover':
        return <DiscoverTab />;
      case 'report':
        return <ReportTab userSetupData={userSetupData} />;
      case 'roadmap':
        return <RoadmapTab onViewAllBadges={handleBadgesOpen} />;
      default:
        return (
          <HomeScreen 
            userRole={userRole} 
            userName={userName}
            onTabChange={setActiveTab}
            activeTab={activeTab}
            onProfileOpen={handleProfileOpen}
            onSettingsOpen={handleSettingsOpen}
            onChallengeRedirect={handleChallengeRedirect}
          />
        );
    }
  };

  // Show activity detail if selected
  if (selectedActivity) {
    return (
      <ActivityDetail
        activity={selectedActivity}
        onBack={handleActivityBack}
        onStartWorkout={handleStartWorkout}
      />
    );
  }

  // Show special pages
  if (appState === 'profile') {
    return <ProfilePage userName={userName} onBack={handleBackToHome} onLogout={() => setAppState('auth')} />;
  }

  if (appState === 'settings') {
    return <SettingsPage onBack={handleBackToHome} />;
  }

  if (appState === 'badges') {
    return <BadgesScreen onBack={handleBackToHome} />;
  }

  // Main app state rendering
  switch (appState) {
    case 'loading':
      return <LoadingScreen onComplete={handleLoadingComplete} />;
    
    case 'auth':
      return <AuthFlow onLogin={handleLogin} />;
    
    case 'setup':
      return <SetupFlow onComplete={handleSetupComplete} onSkip={() => setAppState('home')} />;
    
    case 'home':
      return (
        <div className="min-h-screen bg-background">
          {activeTab === 'training' && userRole === 'athlete' ? (
            <HomeScreen 
              userRole={userRole} 
              userName={userName}
              onTabChange={setActiveTab}
              activeTab={activeTab}
              onProfileOpen={handleProfileOpen}
              onSettingsOpen={handleSettingsOpen}
              onChallengeRedirect={handleChallengeRedirect}
            />
          ) : userRole === 'coach' ? (
            <CoachDashboard
              userName={userName}
              onTabChange={setActiveTab}
              activeTab={activeTab}
              onProfileOpen={handleProfileOpen}
              onSettingsOpen={handleSettingsOpen}
            />
          ) : userRole === 'admin' ? (
            <SAIAdminDashboard
              userName={userName}
              onTabChange={setActiveTab}
              activeTab={activeTab}
              onProfileOpen={handleProfileOpen}
              onSettingsOpen={handleSettingsOpen}
            />
          ) : (
            <div className="min-h-screen bg-background">
              {/* Top Bar for other tabs */}
              <div className="sticky top-0 z-50 bg-primary border-b border-primary-dark safe-top">
                <div className="px-4 py-4">
                  <div className="flex items-center justify-between max-w-md mx-auto">
                    <div>
                      <h1 className="text-lg font-semibold text-white">Welcome, {userName}</h1>
                      <p className="text-sm text-white/80 capitalize">{userRole}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleSettingsOpen}
                        className="tap-target p-2 rounded-lg hover:bg-white/20 transition-colors text-white text-lg"
                      >
                        ⚙️
                      </button>
                      <button
                        onClick={handleProfileOpen}
                        className="tap-target p-2 rounded-lg hover:bg-white/20 transition-colors text-white text-lg"
                      >
                        👤
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="px-4 pb-20 max-w-md mx-auto pt-6">
                {renderTabContent()}
              </div>

              {/* Bottom Navigation */}
              <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-subtle border-t safe-bottom">
                <div className="max-w-md mx-auto px-4 py-2">
                  <div className="flex justify-around">
                    {[
                      { id: 'training', label: 'Training', icon: '⚡' },
                      { id: 'discover', label: 'Discover', icon: '🔍' },
                      { id: 'report', label: 'Report', icon: '📊' },
                      { id: 'roadmap', label: 'Roadmap', icon: '🗺️' }
                    ].map(({ id, label, icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex flex-col items-center space-y-1 tap-target p-2 rounded-lg transition-colors ${
                          activeTab === id ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className="text-lg">{icon}</span>
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    
    default:
      return <LoadingScreen onComplete={handleLoadingComplete} />;
  }
};

export default Index;
