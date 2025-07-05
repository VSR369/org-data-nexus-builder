
import React, { useState, useEffect } from 'react';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSeekingOrgAdminAuth } from '@/hooks/useSeekingOrgAdminAuth';

const SeekingOrgAdminLoginForm = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading, getRememberMeData } = useSeekingOrgAdminAuth();

  // Load remember me data on component mount
  useEffect(() => {
    const rememberData = getRememberMeData();
    if (rememberData) {
      setIdentifier(rememberData.email || rememberData.userId || '');
      setRememberMe(true);
    }
    
    // Clear any error when component mounts
    setError('');
  }, [getRememberMeData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log('🔄 FORM SUBMIT TRIGGERED with identifier:', identifier);
    console.log('🔄 Password length:', password.length);
    console.log('🔄 Remember me checked:', rememberMe);
    
    // Check if localStorage has any administrators
    const adminData = localStorage.getItem('administrators');
    console.log('🔍 Raw administrator data in localStorage:', adminData);
    
    if (!identifier.trim() || !password.trim()) {
      console.log('❌ Form validation failed - missing fields');
      setError('Please enter both email/user ID and password.');
      return;
    }
    
    console.log('✅ Form validation passed, calling login function...');
    try {
      const result = await login(identifier.trim(), password, rememberMe);
      console.log('📋 Login result received:', result);
      
      if (!result.success && result.error) {
        console.log('❌ Login failed, setting error message:', result.error);
        setError(result.error);
      } else if (result.success) {
        console.log('✅ Login successful, clearing form...');
        setIdentifier('');
        setPassword('');
        setShowPassword(false);
        setError('');
      } else {
        console.log('⚠️ Unexpected result format:', result);
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('💥 Login function threw an error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <CardContent className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="org-identifier" className="text-sm font-medium text-gray-700">
            Email or User ID
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="org-identifier"
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
          <Label htmlFor="org-password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="org-password"
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
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-org"
              name="remember-org"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <Label htmlFor="remember-org" className="ml-2 block text-sm text-gray-700 cursor-pointer">
              Remember me for 30 days
            </Label>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Need help?</span>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
          size="lg"
          disabled={isLoading || !identifier.trim() || !password.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In to Administrator Portal'
          )}
        </Button>
      </form>

      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-600">
          Need to access a different area?{' '}
          <Link to="/signin" className="text-blue-600 hover:underline font-medium">
            General Sign In
          </Link>
        </p>
      </div>
    </CardContent>
  );
};

export default SeekingOrgAdminLoginForm;
