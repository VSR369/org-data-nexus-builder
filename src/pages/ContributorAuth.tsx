
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import ContributorLoginForm from "@/components/auth/ContributorLoginForm";
import ContributorSignUpForm from "@/components/auth/ContributorSignUpForm";

const ContributorAuth = () => {
  const [activeTab, setActiveTab] = useState('signin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Contributor Portal</h1>
          <p className="text-gray-600 mt-2">Access for solution providers and innovation partners</p>
        </div>

        {/* Auth Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Contributor Access</CardTitle>
            <CardDescription className="text-center">
              Sign in to your contributor account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-4">
                <ContributorLoginForm />
              </TabsContent>
              
              <TabsContent value="signup" className="mt-4">
                <ContributorSignUpForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Looking for organization access?{' '}
            <Link to="/auth" className="text-purple-600 hover:underline">
              Sign in as Organization
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContributorAuth;
