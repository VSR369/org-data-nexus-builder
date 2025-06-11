
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Lock, Target } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface LoginFormData {
  userId: string;
  password: string;
}

const SeekerLogin = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    userId: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.userId) newErrors.userId = 'User ID is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Here you would typically authenticate with your backend
      // For now, we'll simulate a successful login
      console.log('Login attempt:', formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to seeker dashboard with user context
      navigate('/seeker-dashboard', { 
        state: { 
          userId: formData.userId,
          // In real implementation, you'd get this from the backend response
          organizationName: 'Sample Organization',
          isMember: false // This would come from backend
        }
      });

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Link to="/signin">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Solution Seeker Login
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sign in to your seeker account
            </p>
          </CardHeader>
          
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
        </Card>
      </div>
    </div>
  );
};

export default SeekerLogin;
