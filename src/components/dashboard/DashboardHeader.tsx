
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  onLogout: (userId?: string) => void;
  userId: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onLogout, userId }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Seeker Dashboard</h1>
      <Button onClick={() => onLogout(userId)} variant="outline" className="flex items-center gap-2">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};

export default DashboardHeader;
