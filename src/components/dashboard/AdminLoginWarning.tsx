
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminLoginWarningProps {
  onRefresh: () => void;
}

const AdminLoginWarning: React.FC<AdminLoginWarningProps> = ({ onRefresh }) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          No Organization Data Found
        </h3>
        <p className="text-red-700 mb-4">
          No seeking organization registration data was found. Please complete the registration process first.
        </p>
        <div className="space-x-4">
          <Link to="/seeker-registration">
            <Button className="bg-red-600 hover:bg-red-700">
              Complete Registration
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={onRefresh}
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginWarning;
