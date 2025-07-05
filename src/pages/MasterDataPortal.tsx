
import React, { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import MasterDataContent from "@/components/MasterDataContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { MasterDataSeeder } from "@/utils/masterDataSeeder";
import { MasterDataRestorer } from "@/utils/masterDataRestorer";
import { useToast } from "@/hooks/use-toast";

const MasterDataPortal = () => {
  const [activeSection, setActiveSection] = useState('domain-groups');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  const handleSignInComplete = () => {
    setIsLoggedIn(true);
  };

  const handleRestoreCustomData = () => {
    console.log('🔧 User requested data restoration...');
    const result = MasterDataRestorer.restoreUserData();
    
    if (result.success) {
      toast({
        title: "Custom Data Restored",
        description: result.message,
      });
      // Refresh the page to ensure all components reload
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      toast({
        title: "No Custom Data Found",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  // Initialize master data on portal load
  React.useEffect(() => {
    console.log('🔍 Master Data Portal - Checking for existing user data...');
    
    // Check if user has any custom master data
    const userDataKeys = [
      'master_data_currencies',
      'master_data_countries', 
      'master_data_industry_segments',
      'master_data_organization_types',
      'master_data_entity_types',
      'master_data_departments',
      'master_data_domain_groups',
      'master_data_engagement_models',
      'master_data_seeker_membership_fees',
      'master_data_competency_capabilities'
    ];
    
    const hasUserData = userDataKeys.some(key => {
      const data = localStorage.getItem(key);
      return data && data !== 'null' && data !== '[]';
    });
    
    if (hasUserData) {
      console.log('✅ Found existing user master data - preserving custom configuration');
      // Don't seed - let components load existing user data
    } else {
      console.log('🌱 No user data found - initializing with defaults');
      MasterDataSeeder.seedAllMasterData();
    }
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
                
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={handleRestoreCustomData}
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Restore Custom Data
                  </Button>
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
