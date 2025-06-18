
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const SeekingOrgAdminLoginHeader = () => {
  return (
    <CardHeader className="text-center pb-6">
      <div className="flex items-center justify-center gap-4 mb-4">
        <Link to="/signin">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
          <Shield className="h-6 w-6 text-white" />
        </div>
      </div>
      <CardTitle className="text-2xl font-bold text-gray-900">
        Seeking Organization Administrator
      </CardTitle>
      <p className="text-gray-600 mt-2">
        Sign in to your administrator account
      </p>
    </CardHeader>
  );
};

export default SeekingOrgAdminLoginHeader;
