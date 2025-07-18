
import React from 'react';
import { Calendar } from 'lucide-react';
import { SidebarHeader } from "@/components/ui/sidebar";

export const AppSidebarHeader: React.FC = () => {
  return (
    <SidebarHeader className="border-b p-3 sm:p-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-sm sm:text-base truncate">Master Data</h2>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">Configuration Hub</p>
        </div>
      </div>
    </SidebarHeader>
  );
};
