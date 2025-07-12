import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import SeekerRegistrationForm from '@/components/seeker-registration/SeekerRegistrationForm';

const SeekerRegistration = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Solution Seeking Organization Registration
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Register your organization to find solutions and connect with experts
              </p>
            </div>
            <Link to="/signup">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-4">
        <SeekerRegistrationForm />
      </div>

      {/* Footer */}
      <div className="bg-white/60 backdrop-blur-sm border-t border-slate-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/general-signin" className="text-blue-600 hover:underline font-medium">
                Sign In
              </Link>
              {' | '}
              <Link to="/" className="text-slate-600 hover:underline font-medium">
                Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerRegistration;