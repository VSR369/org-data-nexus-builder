
import React from 'react';
import { Calendar } from 'lucide-react';
import { SidebarHeader } from "@/components/ui/sidebar";

export const AppSidebarHeader: React.FC = () => {
  return (
    <SidebarHeader className="border-b p-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-6 h-6" />
        <div>
          <h2 className="font-semibold">Master Data</h2>
          <p className="text-sm text-muted-foreground">Configuration Hub</p>
        </div>
      </div>
    </SidebarHeader>
  );
};
