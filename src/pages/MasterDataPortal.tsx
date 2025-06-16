
import React, { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import MasterDataContent from "@/components/MasterDataContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { MasterDataSeeder } from "@/utils/masterDataSeeder";

const MasterDataPortal = () => {
  const [activeSection, setActiveSection] = useState('domain-groups');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignInComplete = () => {
    setIsLoggedIn(true);
  };

  // Initialize master data on portal load
  React.useEffect(() => {
    MasterDataSeeder.seedAllMasterData();
  }, []);

  console.log('MasterDataPortal - activeSection:', activeSection);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex w-full">
        {/* Sidebar */}
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        {/* Main Content Area */}
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger className="md:hidden" />
                  <Link to="/">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back to CoInnovator
                    </Button>
                  </Link>
                  <div className="h-6 w-px bg-gray-300" />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <Database className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h1 className="font-bold text-xl text-gray-900">
                        Master Data Portal
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Configuration Management System
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <MasterDataContent activeSection={activeSection} setActiveSection={setActiveSection} />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MasterDataPortal;
