
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginForm } from '@/hooks/useLoginForm';
import { debugStorageData } from '@/utils/debugStorageData';

const LoginForm = () => {
  const { formData, errors, isLoading, handleInputChange, handleLogin } = useLoginForm();

  const handleDebugStorage = () => {
    debugStorageData();
  };

  return (
    <CardContent className="p-6">
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            type="text"
            placeholder="Enter your User ID"
            value={formData.userId}
            onChange={(e) => handleInputChange('userId', e.target.value)}
            className={errors.userId ? 'border-red-500' : ''}
          />
          {errors.userId && (
            <p className="text-sm text-red-500">{errors.userId}</p>
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
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleDebugStorage}
        >
          Debug Storage Data
        </Button>
      </form>
    </CardContent>
  );
};

export default LoginForm;
