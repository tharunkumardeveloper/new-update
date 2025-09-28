import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthFlowProps {
  onLogin: (role: 'athlete' | 'coach' | 'admin') => void;
}

const AuthFlow = ({ onLogin }: AuthFlowProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const demoCredentials = [
    { role: 'athlete' as const, email: 'athlete@demo.com', password: 'athlete123', label: 'Athlete' },
    { role: 'coach' as const, email: 'coach@demo.com', password: 'coach123', label: 'Coach' },
    { role: 'admin' as const, email: 'admin@demo.com', password: 'admin123', label: 'SAI Admin' },
  ];

  const handleDemoLogin = (role: 'athlete' | 'coach' | 'admin') => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      onLogin(role);
    }, 1500);
  };

  return (
    <div className="min-h-screen gradient-violet flex items-center justify-center p-4 safe-top safe-bottom">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2 text-shadow">
            TalentTrack
          </h1>
          <p className="text-white/80 text-lg">
            Track. Train. Transform.
          </p>
        </div>

        {/* Auth Card */}
        <Card className="backdrop-blur-subtle bg-white/10 border-white/20 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-white text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10">
                <TabsTrigger value="signin" className="text-white data-[state=active]:bg-white/20">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white/20">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                
                <Button 
                  className="w-full btn-hero bg-white text-primary hover:bg-white/90" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-white/60">Or continue with</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your full name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    placeholder="Create a password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-white">Mobile Number</Label>
                  <Input 
                    id="mobile" 
                    type="tel" 
                    placeholder="Enter your mobile number"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-white">Select Role</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Athlete', 'Coach', 'SAI Admin'].map((role) => (
                      <Button
                        key={role}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button className="w-full btn-hero bg-white text-primary hover:bg-white/90">
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-white/80 text-sm text-center mb-4">
                Try the demo with these credentials:
              </p>
              <div className="space-y-2">
                {demoCredentials.map((cred) => (
                  <Button
                    key={cred.role}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(cred.role)}
                    disabled={isLoading}
                    className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 text-left justify-start"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{cred.label}</span>
                      <span className="text-xs text-white/60">{cred.email}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthFlow;