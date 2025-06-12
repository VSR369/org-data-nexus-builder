
import React from 'react';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLoginForm } from '@/hooks/useLoginForm';

const LoginForm = () => {
  const {
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleLogin
  } = useLoginForm();

  return (
    <CardContent>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <Label htmlFor="userId">User ID *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="userId"
              value={formData.userId}
              onChange={(e) => handleInputChange('userId', e.target.value)}
              className={`pl-10 ${errors.userId ? 'border-red-500' : ''}`}
              placeholder="Enter your user ID"
            />
          </div>
          {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId}</p>}
        </div>

        <div>
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Enter your password"
            />
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Login'}
        </Button>

        <div className="text-center">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot your password?
          </Link>
        </div>
      </form>
    </CardContent>
  );
};

export default LoginForm;
