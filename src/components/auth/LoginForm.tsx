
import React, { useState } from 'react';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { authenticateUser, saveUserSession, checkStorageHealth } from '@/utils/unifiedAuthUtils';

const LoginForm = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🔐 === UNIFIED LOGIN ATTEMPT START ===');
    console.log('🔐 Attempting unified login for userId:', userId);
    
    try {
      // Check storage health first
      const healthCheck = await checkStorageHealth();
      console.log('📊 Storage health check:', healthCheck);
      
      if (!healthCheck.healthy) {
        console.error('❌ Storage health check failed:', healthCheck.error);
        toast.error("Storage Error", {
          description: "Unable to access user storage. Please try refreshing the page.",
        });
        setIsLoading(false);
        return;
      }

      // Authenticate user
      const result = await authenticateUser(userId, password);

      if (result.success && result.user) {
        console.log('✅ Unified login successful for user:', result.user.userId);
        console.log('✅ User details:', {
          userId: result.user.userId,
          organizationName: result.user.organizationName,
          entityType: result.user.entityType,
          country: result.user.country,
          email: result.user.email,
          contactPersonName: result.user.contactPersonName
        });
        
        // Save session data
        const sessionSaved = await saveUserSession(result.user);
        if (!sessionSaved) {
          console.warn('⚠️ Session save failed, but continuing with login');
        }
        
        toast.success("Login Successful", {
          description: `Welcome back, ${result.user.contactPersonName}! Redirecting to dashboard...`,
        });

        // Navigate to dashboard with user details
        setTimeout(() => {
          navigate('/seeker-dashboard', { 
            state: { 
              userId: result.user!.userId,
              organizationName: result.user!.organizationName,
              entityType: result.user!.entityType,
              country: result.user!.country,
              email: result.user!.email,
              contactPersonName: result.user!.contactPersonName
            }
          });
        }, 1000);
      } else {
        console.log('❌ Unified login failed:', result.error);
        
        toast.error("Login Failed", {
          description: result.error || "Login failed. Please check your credentials.",
        });
      }
    } catch (error) {
      console.error('❌ Unified login error:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('IndexedDB')) {
          errorMessage = "Database connection error. Please refresh the page and try again.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "Request timed out. Please check your connection and try again.";
        }
      }
      
      toast.error("Login Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
      console.log('🔐 === UNIFIED LOGIN ATTEMPT END ===');
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
