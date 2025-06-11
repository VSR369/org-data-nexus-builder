
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Users, Target, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === 'seeker') {
      // Navigate to Solution Seeker organization registration
      navigate('/seeker-registration');
    } else if (selectedRole === 'contributor') {
      // Navigate to contributor enrollment flow
      console.log('Navigating to Contributor registration');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Choose Your Role
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Select how you want to participate in our platform
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <RadioGroup 
              value={selectedRole} 
              onValueChange={setSelectedRole}
              className="space-y-4"
            >
              {/* Solution Seeker Option */}
              <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === 'seeker' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="seeker" id="seeker" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="seeker" className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Solution Seeker</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        I'm looking for solutions to challenges and problems. I want to find experts and providers who can help solve my organization's needs.
                      </p>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Contributor Option */}
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
                        I want to contribute to the platform. A contributor could be a solution provider or solution assessor who offers expertise and evaluates solutions.
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
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/" className="text-blue-600 hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
