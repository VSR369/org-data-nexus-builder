
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState('signin');

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setActiveTab('signup');
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log('User is authenticated, redirecting to home page');
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-lg">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-blue-50 to-indigo-50 py-4 sm:py-8 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 shrink-0">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Seeking Organization Portal</h1>
          <p className="text-gray-600 mt-2 px-4">Access for organizations seeking solutions and innovations</p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-lg w-full">
          <CardHeader>
            <CardTitle className="text-center text-xl">Organization Access</CardTitle>
            <CardDescription className="text-center">
              Sign in to your organization account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-6">
                <SignInForm />
              </TabsContent>
              
              <TabsContent value="signup" className="mt-6">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-sm text-gray-600 px-4">
            Looking for contributor access?{' '}
            <Link to="/contributor-auth" className="text-blue-600 hover:underline">
              Sign in as Contributor
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
