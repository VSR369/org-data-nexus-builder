
import React, { useState, useEffect } from 'react';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSeekingOrgAdminAuth } from '@/hooks/useSeekingOrgAdminAuth';

const SeekingOrgAdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useSeekingOrgAdminAuth();

  // Clear form data on component mount to ensure fresh state
  useEffect(() => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    
    // Clear any browser autofill data
    const emailInput = document.getElementById('org-email') as HTMLInputElement;
    const passwordInput = document.getElementById('org-password') as HTMLInputElement;
    
    if (emailInput) {
      emailInput.value = '';
      emailInput.autocomplete = 'off';
    }
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.autocomplete = 'off';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    
    // Clear form after submission attempt
    if (success) {
      setEmail('');
      setPassword('');
      setShowPassword(false);
    }
  };

  return (
    <CardContent className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="org-email" className="text-sm font-medium text-gray-700">
            Organization Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="org-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              placeholder="Enter organization email"
              autoComplete="off"
              required
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
              autoComplete="off"
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
              id="remember-org"
              name="remember-org"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled
            />
            <Label htmlFor="remember-org" className="ml-2 block text-sm text-gray-400">
              Remember me (disabled)
            </Label>
          </div>
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In to Organization'}
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
