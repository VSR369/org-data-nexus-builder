import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, User, Lock, AlertCircle, Loader2, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { sessionStorageManager } from '@/utils/storage/SessionStorageManager';

const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or Username is required")
    .refine((value) => {
      // Allow email format or username
      if (value.includes('@')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      }
      return value.length >= 3;
    }, "Please enter a valid email address or username (min 3 characters)"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface SolutionSeekingOrgLoginProps {
  onSuccess?: (userData: any) => void;
  redirectUrl?: string;
  showRegisterLink?: boolean;
  showHelpLink?: boolean;
  className?: string;
}

const SolutionSeekingOrgLogin: React.FC<SolutionSeekingOrgLoginProps> = ({
  onSuccess,
  redirectUrl = '/seeking-org-admin-dashboard',
  showRegisterLink = true,
  showHelpLink = true,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
  });

  // Load remember me data on component mount
  useEffect(() => {
    const rememberData = localStorage.getItem('seeking_org_remember_me');
    if (rememberData) {
      try {
        const data = JSON.parse(rememberData);
        const expiryDate = new Date(data.expiryDate);
        const now = new Date();
        
        if (now < expiryDate) {
          form.setValue('identifier', data.identifier || '');
          form.setValue('rememberMe', true);
        } else {
          localStorage.removeItem('seeking_org_remember_me');
        }
      } catch (error) {
        localStorage.removeItem('seeking_org_remember_me');
      }
    }
    
    setError('');
    setSuccess('');
  }, [form]);

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>\"'&]/g, '');
  };

  const validatePasswordStrength = (password: string): { score: number; feedback: string[] } => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('One lowercase letter');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('One uppercase letter');

    if (/\d/.test(password)) score += 1;
    else feedback.push('One number');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

    return { score, feedback };
  };

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    console.log('🔄 Solution Seeking Organization Login - Form submitted');
    
    try {
      // Sanitize inputs
      const sanitizedIdentifier = sanitizeInput(data.identifier);
      const sanitizedPassword = sanitizeInput(data.password);
      
      // Check if user exists using SessionStorageManager
      console.log('🔍 Checking user credentials...');
      const loginResult = sessionStorageManager.findUser(sanitizedIdentifier, sanitizedPassword);
      
      if (!loginResult) {
        console.log('❌ Login failed - user not found or invalid credentials');
        setError('Invalid email/username or password. Please check your credentials and try again.');
        return;
      }
      
      console.log('✅ User found:', loginResult);
      
      // Check if this is a solution seeking organization
      const userData = loginResult;
      const isSolutionSeeker = userData.entityType?.toLowerCase().includes('solution') ||
                              userData.entityType?.toLowerCase().includes('seeker') ||
                              userData.entityType === 'solution-seeker' ||
                              userData.entityType === 'Solution Seeker';
      
      if (!isSolutionSeeker) {
        console.log('❌ User is not a solution seeking organization');
        setError('This account is not registered as a Solution Seeking Organization. Please check your credentials or contact support.');
        return;
      }
      
      console.log('✅ Valid solution seeking organization user');
      
      // Save remember me data if checked
      if (data.rememberMe) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        const rememberData = {
          identifier: sanitizedIdentifier,
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
      setSuccess(`Welcome back, ${userData.organizationName}!`);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.organizationName}! Redirecting to your dashboard...`,
      });
      
      // Reset form
      form.reset();
      setShowPassword(false);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(userData);
      }
      
      // Navigate to dashboard after delay
      setTimeout(() => {
        navigate(redirectUrl);
      }, 1500);
      
    } catch (error) {
      console.error('💥 Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const passwordStrength = form.watch('password') ? validatePasswordStrength(form.watch('password')) : { score: 0, feedback: [] };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Organization Portal</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Sign in to access your solution seeking organization dashboard
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-900">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email/Username Field */}
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Email or Username
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      type="text"
                      className="pl-10"
                      placeholder="Enter your organization email or username"
                      autoComplete="username"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck="false"
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
                
                {/* Password Strength Indicator */}
                {field.value && (
                  <div className="mt-2">
                    <div className="flex space-x-1 mb-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            passwordStrength.score >= level
                              ? passwordStrength.score <= 2
                                ? 'bg-red-400'
                                : passwordStrength.score === 3
                                ? 'bg-yellow-400'
                                : 'bg-green-400'
                              : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Missing: {passwordStrength.feedback.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </FormItem>
            )}
          />

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-1 h-4 w-4 text-primary focus:ring-primary border-input rounded"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-foreground cursor-pointer">
                      Remember me for 30 days
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            {showHelpLink && (
              <div className="text-sm">
                <span className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  Forgot Password?
                </span>
              </div>
            )}
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || !form.formState.isValid}
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

          {/* Reset Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={resetForm}
            disabled={isLoading}
          >
            Reset Form
          </Button>
        </form>
      </Form>

      {/* Footer Links */}
      {(showRegisterLink || showHelpLink) && (
        <div className="text-center pt-4 border-t border-border space-y-2">
          {showRegisterLink && (
            <p className="text-sm text-muted-foreground">
              Don't have an organization account?{' '}
              <Link to="/seeker-registration" className="text-primary hover:underline font-medium">
                Register Organization
              </Link>
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Need to access a different area?{' '}
            <Link to="/signin" className="text-primary hover:underline font-medium">
              General Sign In
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default SolutionSeekingOrgLogin;