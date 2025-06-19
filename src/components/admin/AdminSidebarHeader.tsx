
import React from 'react';
import { Shield } from 'lucide-react';
import { SidebarHeader } from "@/components/ui/sidebar";

export const AdminSidebarHeader: React.FC = () => {
  return (
    <SidebarHeader className="border-b p-4">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-green-600" />
        <div>
          <h2 className="font-semibold">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">Organization Management</p>
        </div>
      </div>
    </SidebarHeader>
  );
};
