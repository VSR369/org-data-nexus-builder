
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

  const handleRestoreCustomData = async () => {
    console.log('🔧 User requested comprehensive data restoration...');
    
    // Use the enhanced restoration processor
    const { MasterDataRestoreProcessor } = await import('@/utils/masterDataRestoreProcessor');
    const result = await MasterDataRestoreProcessor.restoreAllCustomData();
    
    if (result.customDataFound.length > 0) {
      toast({
        title: "Custom Data Restored",
        description: `Successfully restored ${result.customDataFound.length} master data categories with ${result.totalCustomConfigurations} total configurations`,
      });
      
      // Refresh the page to ensure all components reload with custom data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast({
        title: "No Custom Data Found",
        description: "No custom master data configurations found. System will use defaults.",
        variant: "destructive",
      });
      
      // Show what's available
      console.log('📋 Available storage keys:', Object.keys(localStorage).filter(k => k.startsWith('master_data_')));
    }
  };

  // Initialize master data on portal load with enhanced restoration
  React.useEffect(() => {
    console.log('🔍 Master Data Portal - Enhanced custom data analysis...');
    
    const initializeCustomData = async () => {
      // Import and run the enhanced restoration processor
      const { MasterDataRestoreProcessor } = await import('@/utils/masterDataRestoreProcessor');
      
      // Validate and restore custom data
      const healthReport = await MasterDataRestoreProcessor.validateCustomDataIntegrity();
      
      if (healthReport.totalConfigurations > 0) {
        console.log(`✅ Found ${healthReport.totalConfigurations} custom configurations across ${healthReport.customDataPercentage}% of master data categories`);
        console.log('🎯 Preserving custom master data configurations');
      } else {
        console.log('⚠️ No custom configurations found - will initialize defaults');
        // Only seed if truly no custom data exists
        const { MasterDataSeeder } = await import('@/utils/masterDataSeeder');
        MasterDataSeeder.seedAllMasterData();
      }
    };
    
    initializeCustomData().catch(console.error);
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
