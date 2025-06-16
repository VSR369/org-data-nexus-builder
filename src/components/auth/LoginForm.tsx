
import React, { useState } from 'react';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { findRegisteredUser, checkUserExistsForBetterError, getUserStorageDiagnostics } from '@/utils/userAuthUtils';
import { saveSessionData } from '@/utils/sessionDataUtils';
import { userDataManager } from '@/utils/storage/UserDataManager';

const LoginForm = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🔐 === LOGIN ATTEMPT START ===');
    console.log('🔐 Attempting login for userId:', userId);
    
    try {
      // First check database health
      const healthCheck = await userDataManager.checkDatabaseHealth();
      if (!healthCheck.healthy) {
        console.error('❌ Database health check failed:', healthCheck.error);
        toast({
          title: "Database Error",
          description: "Unable to connect to user database. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Run storage diagnostics
      const diagnostics = await getUserStorageDiagnostics();
      console.log('📊 Storage diagnostics:', diagnostics);

      if (!userId.trim() || !password.trim()) {
        toast({
          title: "Login Failed",
          description: "Please enter both User ID and password",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const registeredUser = await findRegisteredUser(userId.trim(), password);

      if (registeredUser) {
        console.log('✅ Login successful for user:', registeredUser.userId);
        console.log('✅ User details:', {
          userId: registeredUser.userId,
          organizationName: registeredUser.organizationName,
          entityType: registeredUser.entityType,
          country: registeredUser.country,
          email: registeredUser.email,
          contactPersonName: registeredUser.contactPersonName
        });
        
        // Save session data
        saveSessionData(registeredUser);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${registeredUser.contactPersonName}! Redirecting to dashboard...`,
        });

        // Navigate to dashboard with user details
        setTimeout(() => {
          navigate('/seeker-dashboard', { 
            state: { 
              userId: registeredUser.userId,
              organizationName: registeredUser.organizationName,
              entityType: registeredUser.entityType,
              country: registeredUser.country,
              email: registeredUser.email,
              contactPersonName: registeredUser.contactPersonName
            }
          });
        }, 1000);
      } else {
        console.log('❌ Login failed for userId:', userId);
        
        // Provide better error messages
        const userStatus = await checkUserExistsForBetterError(userId.trim());
        let errorMessage = "Login failed. Please check your credentials.";
        
        if (userStatus === 'no_users') {
          errorMessage = "No registered users found. Please register first.";
        } else if (userStatus === 'user_not_found') {
          errorMessage = `User ID "${userId}" not found. Please check your User ID or register first.`;
        } else if (userStatus === 'user_exists') {
          errorMessage = "User ID exists but password is incorrect. Please check your password.";
        }
        
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('IndexedDB')) {
          errorMessage = "Database connection error. Please refresh the page and try again.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "Request timed out. Please check your connection and try again.";
        }
      }
      
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log('🔐 === LOGIN ATTEMPT END ===');
    }
  };

  return (
    <CardContent className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userId">User ID</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="pl-10"
              placeholder="Enter your User ID"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </div>
          )}
        </Button>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/seeker-registration" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </div>
      </form>
    </CardContent>
  );
};

export default LoginForm;
