
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Users, LogIn, Building2, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const navigate = useNavigate();

  const handleContinue = () => {
    console.log('🔄 SignIn handleContinue called with selectedRole:', selectedRole);
    
    if (selectedRole === 'seeking-organization') {
      console.log('🏢 Navigating to solution seeking organization login');
      navigate('/seeking-org-admin-login');
    } else if (selectedRole === 'contributor') {
      console.log('👥 Navigating to contributor login');
      navigate('/contributor-login');
    } else if (selectedRole === 'seeking-org-administrator') {
      console.log('🔧 Navigating to seeking org administrator login');
      navigate('/seeking-org-admin-login');
    } else if (selectedRole === 'org-administrator') {
      console.log('🛡️ Navigating to organization administrator login');
      navigate('/seeking-org-admin-login');
    } else {
      console.log('❌ No valid role selected');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <LogIn className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Sign In
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Select your role to continue
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <RadioGroup 
              value={selectedRole} 
              onValueChange={setSelectedRole}
              className="space-y-4"
            >
              {/* Solution Seeking Organization Option - First */}
              <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === 'seeking-organization' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="seeking-organization" id="seeking-organization" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="seeking-organization" className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-gray-900">Solution Seeking Organization</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Sign in as a solution seeking organization to manage your membership, engagement models, and organizational settings.
                      </p>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Contributor Option - Second */}
              <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === 'contributor' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="contributor" id="contributor" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="contributor" className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-gray-900">Contributor</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Sign in as a contributor. A contributor could be a solution provider or solution assessor who offers expertise and evaluates solutions.
                      </p>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Seeking Org Administrator Option - Third */}
              <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === 'seeking-org-administrator' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="seeking-org-administrator" id="seeking-org-administrator" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="seeking-org-administrator" className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-orange-600" />
                        <span className="font-semibold text-gray-900">Seeking Org Administrator</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Sign in as a seeking organization administrator to manage admin functions and organizational settings.
                      </p>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Solution Seeking Org Administrator Option - Fourth */}
              <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === 'org-administrator' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="org-administrator" id="org-administrator" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="org-administrator" className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Solution Seeking Org Administrator</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Sign in as an administrator to manage organizational users, permissions, and administrative settings.
                      </p>
                    </Label>
                  </div>
                </div>
              </div>
            </RadioGroup>

            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleContinue}
                disabled={!selectedRole}
                className="w-full"
                size="lg"
              >
                Continue
              </Button>
              
              <Link to="/">
                <Button variant="outline" className="w-full" size="lg">
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
