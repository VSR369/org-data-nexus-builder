
import React, { useState } from 'react';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';

const LoginForm = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🔐 === LOGIN ATTEMPT START ===');
    console.log('🔐 Login attempt for userId:', userId);

    try {
      if (!userId.trim() || !password) {
        throw new Error('Please enter both User ID and password');
      }

      // Initialize unified storage service
      await unifiedUserStorageService.initialize();

      // Authenticate user
      const authResult = await unifiedUserStorageService.authenticateUser(
        userId.trim(), 
        password
      );
      
      console.log('🔐 Authentication result:', authResult);
      
      if (!authResult.success || !authResult.user) {
        throw new Error(authResult.error || 'Authentication failed');
      }

      const user = authResult.user;
      console.log('✅ Login successful for user:', user.userId);
      console.log('📋 User data:', {
        organizationName: user.organizationName,
        organizationType: user.organizationType,
        entityType: user.entityType,
        country: user.country,
        contactPersonName: user.contactPersonName
      });
      
      // Save complete session data with all organization details
      await unifiedUserStorageService.saveSession({
        userId: user.userId,
        organizationName: user.organizationName,
        organizationType: user.organizationType || user.entityType,
        entityType: user.entityType,
        country: user.country,
        email: user.email,
        contactPersonName: user.contactPersonName,
        industrySegment: user.industrySegment || 'Not Specified',
        organizationId: user.organizationId || user.userId,
        loginTimestamp: new Date().toISOString()
      });
      
      // Route based on current path
      if (location.pathname === '/seeker-login') {
        toast.success(`Successfully signed in as Solution Seeker!`);
        navigate('/seeker-dashboard', { 
          state: { 
            userId: user.userId,
            organizationName: user.organizationName,
            organizationType: user.organizationType,
            entityType: user.entityType,
            country: user.country,
            email: user.email,
            contactPersonName: user.contactPersonName,
            industrySegment: user.industrySegment,
            organizationId: user.organizationId
          }
        });
      } else if (location.pathname === '/contributor-login') {
        toast.success('Successfully signed in as Contributor!');
        navigate('/contributor-enrollment');
      } else {
        toast.success('Successfully signed in!');
        navigate('/');
      }
      
      console.log('🔐 === LOGIN ATTEMPT SUCCESS ===');
      
    } catch (error: any) {
      console.log('❌ Login error:', error.message);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.message.includes('password')) {
        errorMessage = "Incorrect password. Please check your password and try again.";
      } else if (error.message.includes('not found')) {
        errorMessage = "User ID not found. Please check your User ID or register first.";
      } else if (error.message.includes('No registered users')) {
        errorMessage = "No registered users found. Please register first.";
      } else if (error.message.includes('User ID') || error.message.includes('password')) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      console.log('🔐 === LOGIN ATTEMPT FAILED ===');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContent className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userId" className="text-sm font-medium text-gray-700">
            User ID
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="pl-10"
              placeholder="Enter your User ID"
              autoComplete="username"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              data-form-type="other"
              required
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
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              data-form-type="other"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </Label>
          </div>
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/seeker-registration" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </CardContent>
  );
};

export default LoginForm;
