import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const SeekerLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border border-slate-200">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-slate-800">
              Solution Seeking Organization Login
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              System Cleaned Successfully
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-orange-900 mb-1">
                    Login System Removed
                  </h4>
                  <p className="text-sm text-orange-700 mb-3">
                    All Solution Seeking Organization sign-in functionality has been completely removed as requested. The system is now clean and ready for fresh implementation.
                  </p>
                  <div className="text-xs text-orange-600 space-y-1">
                    <div>✅ All login components deleted</div>
                    <div>✅ Authentication services removed</div>
                    <div>✅ Dashboard components cleaned</div>
                    <div>✅ Routes and hooks removed</div>
                    <div>✅ localStorage/cache cleared</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link to="/" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Back to Home
                </Button>
              </Link>
              
              <Link to="/general-signin" className="block">
                <Button className="w-full" size="lg">
                  General Sign In
                </Button>
              </Link>
            </div>

            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Ready to build new sign-in system from scratch
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerLogin;