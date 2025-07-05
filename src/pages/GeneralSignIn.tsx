import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Users, LogIn, Building2, Shield, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const GeneralSignIn = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const navigate = useNavigate();

  const handleContinue = () => {
    console.log('🔄 GENERAL SIGNIN - handleContinue called with selectedRole:', selectedRole);
    
    if (selectedRole === 'seeking-organization') {
      console.log('🏢 GENERAL SIGNIN - Navigating to solution seeking organization login');
      navigate('/solution-seeking-org/login', { 
        state: { fromGeneralSignin: true } 
      });
    } else if (selectedRole === 'contributor') {
      console.log('👥 GENERAL SIGNIN - Navigating to contributor login');
      navigate('/contributor-login');
    } else if (selectedRole === 'seeking-org-administrator') {
      console.log('🔧 GENERAL SIGNIN - Navigating to seeking org administrator login');
      navigate('/seeking-org-administrator-login');
    } else {
      console.log('❌ GENERAL SIGNIN - No valid role selected');
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
              General Sign In
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Select your user type to continue to the appropriate login screen
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <RadioGroup 
              value={selectedRole} 
              onValueChange={setSelectedRole}
              className="space-y-4"
            >
              {/* Solution Seeking Organization Option - Highlighted */}
              <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === 'seeking-organization' 
                  ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
              }`}>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="seeking-organization" id="seeking-organization" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="seeking-organization" className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-gray-900">Solution Seeking Organization</span>
                        {selectedRole === 'seeking-organization' && (
                          <ArrowRight className="h-4 w-4 text-green-600 ml-auto" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Organizations looking for solutions to their business challenges. Access your dashboard, manage memberships, and explore engagement models.
                      </p>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Other User Types */}
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
                        Solution providers and assessors who offer expertise and evaluate solutions for organizations.
                      </p>
                    </Label>
                  </div>
                </div>
              </div>

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
                        <span className="font-semibold text-gray-900">Organization Administrator</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Administrative access for managing organization settings and user accounts.
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
                {selectedRole === 'seeking-organization' 
                  ? 'Continue to Organization Login' 
                  : selectedRole 
                    ? 'Continue to Login' 
                    : 'Select User Type'
                }
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Link to="/">
                <Button variant="outline" className="w-full" size="lg">
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* Quick Access for Solution Seeking Organizations */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Building2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">
                    Solution Seeking Organization?
                  </h4>
                  <p className="text-sm text-green-700 mb-2">
                    Skip the selection and go directly to your login screen.
                  </p>
                  <Link to="/solution-seeking-org/login">
                    <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
                      Direct Login
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                  Sign Up
                </Link>
                {' | '}
                <Link to="/seeker-registration" className="text-green-600 hover:underline font-medium">
                  Register Organization
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneralSignIn;
