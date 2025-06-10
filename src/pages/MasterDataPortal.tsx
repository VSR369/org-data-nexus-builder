
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MasterDataContent } from "@/components/MasterDataContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database } from "lucide-react";
import { Link } from "react-router-dom";

const MasterDataPortal = () => {
  const [activeSection, setActiveSection] = useState('domain-groups');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignInComplete = () => {
    setIsLoggedIn(true);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex w-full">
        {/* Sidebar */}
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm z-10">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
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
                
                <div className="flex items-center space-x-4">
                  {isLoggedIn ? (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-muted-foreground">Authenticated</span>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm font-medium">A</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm">
                        Sign In
                      </Button>
                      <Button size="sm">
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <MasterDataContent 
                activeSection={activeSection} 
                onSignInComplete={handleSignInComplete}
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MasterDataPortal;
