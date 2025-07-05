import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import SeekingOrgAdminLoginForm from '@/components/auth/SeekingOrgAdminLoginForm';

const SeekingOrgAdministratorLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Link to="/signin">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Solution Seeking Organization Administrator
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sign in to your administrator account
            </p>
          </CardHeader>
          
          <SeekingOrgAdminLoginForm />
        </Card>
        
        <div className="text-center mt-6">
          <Link to="/">
            <Button variant="outline" className="text-gray-600 hover:text-gray-800">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SeekingOrgAdministratorLogin;