import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Database, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SuperAdminAuth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSupabaseAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log('Super admin is authenticated, redirecting to master data portal');
      navigate('/master-data-portal');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const checkSuperAdminRole = async (userId: string) => {
    try {
      console.log('🔍 Checking super admin role for user:', userId);
      
      const { data, error } = await supabase
        .from('platform_administrators')
        .select(`
          *,
          admin_roles!inner(
            role_name
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .eq('admin_roles.role_name', 'super_admin')
        .single();

      if (error) {
        console.error('❌ Error checking super admin role:', error);
        return false;
      }

      if (data) {
        console.log('✅ Super admin role confirmed for:', data.admin_email);
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Unexpected error checking super admin role:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('🔐 Super Admin login attempt for:', formData.email);

    try {
      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password
      });

      if (signInError) {
        console.error('❌ Super admin sign in error:', signInError);
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        console.log('✅ User authenticated, checking super admin role...');
        
        // Check if user has super admin role
        const isSuperAdmin = await checkSuperAdminRole(data.user.id);
        
        if (!isSuperAdmin) {
          console.error('❌ User is not a super admin');
          setError('Access denied. Super admin privileges required.');
          // Sign out the user since they don't have proper permissions
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        console.log('✅ Super admin login successful');
        toast.success('Welcome, Super Administrator!');
        navigate('/master-data-portal');
      }
    } catch (error) {
      console.error('❌ Unexpected super admin login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-lg">Redirecting to admin portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center mx-auto mb-4 shrink-0">
            <Database className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Portal</h1>
          <p className="text-gray-600 mt-2">Administrative access to master data configuration</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">Administrator Access</CardTitle>
            <CardDescription className="text-center">
              Sign in with your super administrator credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@system.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter admin password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In as Administrator'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Need organization access?{' '}
            <Link to="/auth" className="text-blue-600 hover:underline">
              Organization Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAuth;