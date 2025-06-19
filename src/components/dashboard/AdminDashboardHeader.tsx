
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminDashboardHeaderProps {
  onRefreshData: () => void;
}

const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({ onRefreshData }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <Link to="/signin">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Sign Out
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">
                  Organization Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Membership & Engagement Management
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
            <Building2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Registered Organization</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminDashboardHeader;
