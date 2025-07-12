import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, User, Lock, AlertCircle, Loader2, Building2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const SeekerLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto-focus on first input field and debug storage
  useEffect(() => {
    const identifierInput = document.getElementById('identifier');
    if (identifierInput) {
      identifierInput.focus();
    }
    
    // Debug storage on page load
    const debugStorage = async () => {
      const { StorageDebugger } = await import('@/utils/storageDebugger');
      await StorageDebugger.debugUserStorage('media@media.co.in');
      
      // Also check if the specific user exists
      const userCheck = await StorageDebugger.checkUserExists('media@media.co.in');
      console.log('🎯 SPECIFIC USER CHECK for media@media.co.in:', userCheck);
    };
    
    debugStorage().catch(console.error);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter both email/username and password.');
      setIsLoading(false);
      return;
    }

    // Email format validation if identifier contains @
    if (identifier.includes('@') && !validateEmail(identifier)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 Starting login process for:', identifier);
      let user = null;

      // First check localStorage
      const usersData = localStorage.getItem('registered_users');
      if (usersData) {
        try {
          const users = JSON.parse(usersData);
          user = users.find((u: any) => 
            (u.email.toLowerCase() === identifier.toLowerCase() || 
             u.userId.toLowerCase() === identifier.toLowerCase()) &&
            u.password === password
          );
          if (user) {
            console.log('✅ User found in localStorage');
          }
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
        }
      }

      // If not found in localStorage, check IndexedDB using userDataManager
      if (!user) {
        console.log('🔍 Checking IndexedDB for user...');
        try {
          const { userDataManager } = await import('@/utils/storage/UserDataManager');
          const foundUser = await userDataManager.findUser(identifier, password);
          if (foundUser) {
            user = foundUser;
            console.log('✅ User found in IndexedDB');
            
            // Sync to localStorage for faster future access
            const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
            const userExists = existingUsers.find((u: any) => u.userId === foundUser.userId);
            if (!userExists) {
              existingUsers.push(foundUser);
              localStorage.setItem('registered_users', JSON.stringify(existingUsers));
              console.log('📥 Synced user data to localStorage');
            }
          }
        } catch (error) {
          console.error('Error checking IndexedDB:', error);
        }
      }

      if (!user) {
        setError('Invalid credentials. Please check your email/username and password.');
        setIsLoading(false);
        return;
      }

      // Store user session
      const sessionData = {
        userId: user.userId,
        organizationName: user.organizationName,
        entityType: user.entityType,
        country: user.country,
        contactPersonName: user.contactPersonName,
        email: user.email,
        loginTimestamp: new Date().toISOString()
      };
      
      sessionStorage.setItem('seeker_session', JSON.stringify(sessionData));
      console.log('💾 User session stored');

      // Successful login
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.contactPersonName}!`,
      });

      // Navigate to organization dashboard
      setTimeout(() => {
        navigate('/organization-dashboard');
      }, 1500);

    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Link to="/signin">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Solution Seeking Organization
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sign in to your organization account
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                  Email or User ID
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email or user ID"
                    autoComplete="username"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  size="lg"
                  disabled={isLoading || !identifier.trim() || !password.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
                
                <Link to="/signin">
                  <Button variant="outline" className="w-full" size="lg" disabled={isLoading}>
                    Back to Menu
                  </Button>
                </Link>
              </div>
            </form>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/seeker-registration" className="text-green-600 hover:underline font-medium">
                  Register Organization
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerLogin;