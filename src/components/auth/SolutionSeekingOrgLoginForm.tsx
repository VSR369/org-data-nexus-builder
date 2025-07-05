import React, { useState, useEffect } from 'react';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { sessionStorageManager } from '@/utils/storage/SessionStorageManager';

const SolutionSeekingOrgLoginForm = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load remember me data on component mount
  useEffect(() => {
    const rememberData = localStorage.getItem('seeking_org_remember_me');
    if (rememberData) {
      try {
        const data = JSON.parse(rememberData);
        const expiryDate = new Date(data.expiryDate);
        const now = new Date();
        
        if (now < expiryDate) {
          setIdentifier(data.identifier || '');
          setRememberMe(true);
        } else {
          localStorage.removeItem('seeking_org_remember_me');
        }
      } catch (error) {
        localStorage.removeItem('seeking_org_remember_me');
      }
    }
    
    setError('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log('🔄 Solution Seeking Organization Login - Form submitted');
    console.log('🔄 Identifier:', identifier);
    console.log('🔄 Password length:', password.length);
    
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter both email/user ID and password.');
      setIsLoading(false);
      return;
    }
    
    try {
      // Check if user exists using SessionStorageManager
      console.log('🔍 Checking user credentials with SessionStorageManager...');
      const loginResult = sessionStorageManager.findUser(identifier.trim(), password);
      
      if (!loginResult) {
        console.log('❌ Login failed - user not found or invalid credentials');
        setError('Invalid email/user ID or password. Please check your credentials and try again.');
        setIsLoading(false);
        return;
      }
      
      console.log('✅ User found:', loginResult);
      
      // Check if this is a solution seeking organization
      const userData = loginResult;
      const isSolutionSeeker = userData.entityType?.toLowerCase().includes('solution') ||
                              userData.entityType?.toLowerCase().includes('seeker') ||
                              userData.entityType === 'solution-seeker' ||
                              userData.entityType === 'Solution Seeker';
      
      // For now, assume any user with entityType containing 'seeker' is a solution seeking org
      // This may need refinement based on your actual data structure
      if (!isSolutionSeeker) {
        console.log('❌ User is not a solution seeking organization');
        setError('This account is not registered as a Solution Seeking Organization. Please check your credentials or contact support.');
        setIsLoading(false);
        return;
      }
      
      console.log('✅ Valid solution seeking organization user');
      
      // Save remember me data if checked
      if (rememberMe) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        const rememberData = {
          identifier: identifier.trim(),
          expiryDate: expiryDate.toISOString()
        };
        
        localStorage.setItem('seeking_org_remember_me', JSON.stringify(rememberData));
        console.log('💾 Remember me data saved');
      } else {
        localStorage.removeItem('seeking_org_remember_me');
      }
      
      // Store current session
      const sessionData = {
        userId: userData.userId,
        email: userData.email,
        organizationName: userData.organizationName,
        organizationId: userData.organizationId,
        entityType: userData.entityType,
        loginTime: new Date().toISOString(),
        userType: 'solution-seeking-organization'
      };
      
      localStorage.setItem('current_seeking_org_session', JSON.stringify(sessionData));
      console.log('💾 Session data stored:', sessionData);
      
      // Show success message
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.organizationName}! Redirecting to your dashboard...`,
      });
      
      // Clear form
      setIdentifier('');
      setPassword('');
      setShowPassword(false);
      setError('');
      
      // Navigate to seeking org admin dashboard
      setTimeout(() => {
        navigate('/seeking-org-admin-dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('💥 Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
              placeholder="Enter your organization email or user ID"
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
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
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
            'Sign In to Organization Portal'
          )}
        </Button>
      </form>

      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-600">
          Don't have an organization account?{' '}
          <Link to="/seeker-registration" className="text-green-600 hover:underline font-medium">
            Register Organization
          </Link>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Need to access a different area?{' '}
          <Link to="/signin" className="text-blue-600 hover:underline font-medium">
            General Sign In
          </Link>
        </p>
      </div>
    </CardContent>
  );
};

export default SolutionSeekingOrgLoginForm;