
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MasterDataContent } from "@/components/MasterDataContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database } from "lucide-react";
import { Link } from "react-router-dom";

const MasterDataPortal = () => {
  const [activeSection, setActiveSection] = useState('master-data-structure');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignInComplete = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
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
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)] w-full">
        <SidebarProvider>
          <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <MasterDataContent 
                activeSection={activeSection} 
                onSignInComplete={handleSignInComplete}
              />
            </div>
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default MasterDataPortal;
