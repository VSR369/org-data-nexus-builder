
import React from 'react';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContributorLoginForm } from '@/hooks/useContributorLoginForm';

const ContributorLoginForm = () => {
  const { formData, errors, isLoading, handleInputChange, handleLogin } = useContributorLoginForm();

  return (
    <CardContent className="p-6">
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In as Contributor'}
        </Button>
        
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Button variant="link" className="p-0 h-auto text-purple-600">
            Contact Admin for Access
          </Button>
        </div>
      </form>
    </CardContent>
  );
};

export default ContributorLoginForm;
