
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MainHeader } from "./MainHeader";

interface MainLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
  showSidebar?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  activeSection = 'countries',
  setActiveSection = () => {},
  showSidebar = false 
}) => {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      {showSidebar ? (
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-[calc(100vh-4rem)] w-full">
            <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <SidebarInset className="flex-1 min-w-0">
              <div className="container mx-auto p-4 space-y-6">
                {children}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      ) : (
        <main className="container mx-auto px-6 py-8">
          {children}
        </main>
      )}
    </div>
  );
};
