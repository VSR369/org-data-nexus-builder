
import React, { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import MasterDataContent from "@/components/MasterDataContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { MasterDataSeeder } from "@/utils/masterDataSeeder";
import { MasterDataRestorer } from "@/utils/masterDataRestorer";
import { EntityTypesRestorer } from "@/utils/entityTypesRestorer";
import { useToast } from "@/hooks/use-toast";

const MasterDataPortal = () => {
  const [activeSection, setActiveSection] = useState('domain-groups');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  const handleSignInComplete = () => {
    setIsLoggedIn(true);
  };

  const handleRestoreEntityTypes = async () => {
    console.log('🔧 User requested Entity Types restoration...');
    
    try {
      const result = EntityTypesRestorer.restoreEntityTypes();
      
      if (result.success) {
        toast({
          title: "Entity Types Restored",
          description: `Restored ${result.count} entity types from ${result.source}. Please refresh the Entity Types page to see the changes.`,
        });
        
        console.log('✅ Entity Types restoration successful:', result);
      } else {
        throw new Error('Restoration failed');
      }
    } catch (error) {
      console.error('❌ Entity Types restoration failed:', error);
      toast({
        title: "Restoration Failed",
        description: "Failed to restore Entity Types. Please check the console for details.",
        variant: "destructive",
      });
    }
  };

  const handleRestoreCustomData = async () => {
    console.log('🔧 User requested custom data restoration (custom-only mode)...');
    
    // Use the custom data restoration utility
    const { CustomDataRestoration } = await import('@/utils/customDataRestoration');
    const result = await CustomDataRestoration.restoreAllCustomDataOnly();
    
    if (result.customDataFound.length > 0) {
      toast({
        title: "Custom Data Restored",
        description: `Restored ${result.customDataFound.length} custom master data categories. Only custom configurations will be shown.`,
      });
      
      // Page will auto-reload from the restoration utility
    } else {
      toast({
        title: "No Custom Data Found",
        description: "No custom master data configurations found in storage.",
        variant: "destructive",
      });
      
      // Show what's available
      console.log('📋 Available storage keys:', Object.keys(localStorage).filter(k => k.startsWith('master_data_')));
    }
  };

  // Initialize master data on portal load with enhanced restoration and migration
  React.useEffect(() => {
    console.log('🔍 Master Data Portal - Enhanced initialization...');
    
    const initializeData = async () => {
      try {
        // Run master data migration from localStorage to Supabase
        const { masterDataMigrationService } = await import('@/services/MasterDataMigrationService');
        await masterDataMigrationService.migrateAllMasterData();
        
        // Import and run the enhanced restoration processor
        const { MasterDataRestoreProcessor } = await import('@/utils/masterDataRestoreProcessor');
        
        // Validate and restore custom data
        const healthReport = await MasterDataRestoreProcessor.validateCustomDataIntegrity();
        
        if (healthReport.totalConfigurations > 0) {
          console.log(`✅ Found ${healthReport.totalConfigurations} custom configurations`);
          console.log('🎯 Preserving custom master data configurations');
        } else {
          console.log('⚠️ No custom configurations found - initializing marketplace pricing system');
          
          // Initialize marketplace pricing system
          const { MasterDataSeeder } = await import('@/services/MasterDataSeeder');
          const { DataMigrationService } = await import('@/services/DataMigrationService');
          
          // Check if seeding is needed
          const seedingStatus = await MasterDataSeeder.checkSeedingStatus();
          if (seedingStatus.needsSeeding) {
            console.log('🌱 Seeding marketplace pricing master data...');
            const seedResult = await MasterDataSeeder.seedAllMasterData();
            
            if (seedResult.success) {
              toast({
                title: "Marketplace Pricing Initialized",
                description: `Seeded ${seedResult.totalRecords} records across ${seedResult.tablesSeeded.length} tables`,
              });
            }
          }
          
          // Run configuration migration
          const migrationResult = await DataMigrationService.migrateAllConfigurations();
          if (migrationResult.migratedConfigurations > 0) {
            toast({
              title: "Configurations Migrated", 
              description: `Migrated ${migrationResult.migratedConfigurations} pricing configurations to new marketplace system`,
            });
          }
        }
      } catch (error) {
        console.error('❌ Initialization failed:', error);
        toast({
          title: "Initialization Warning",
          description: "Some initialization steps failed. Please check console for details.",
          variant: "destructive",
        });
      }
    };
    
    initializeData();
  }, [toast]);

  console.log('MasterDataPortal - activeSection:', activeSection);

  return (
    <div className="dashboard-layout no-horizontal-scroll">
      <SidebarProvider defaultOpen={true}>
        <div className="dashboard-main">
          {/* Sidebar */}
          <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          
          {/* Main Content Area */}
          <SidebarInset className="flex-1 min-w-0 no-horizontal-scroll">
            {/* Header */}
            <header className="bg-background border-b border-border shadow-sm z-10 sticky top-0 w-full">
              <div className="px-3 sm:px-4 lg:px-6 w-full">
                <div className="flex items-center justify-between h-14 sm:h-16 w-full">
                  <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 min-w-0 flex-1">
                    <SidebarTrigger className="md:hidden" />
                    <Link to="/">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2 shrink-0 px-2 sm:px-3">
                        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline text-sm">Back to CoInnovator</span>
                        <span className="sm:hidden text-xs">Back</span>
                      </Button>
                    </Link>
                    <div className="h-4 sm:h-6 w-px bg-border shrink-0 hidden sm:block" />
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shrink-0">
                        <Database className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h1 className="font-bold text-sm sm:text-lg lg:text-xl text-foreground truncate">
                          Master Data Portal
                        </h1>
                        <p className="text-xs lg:text-sm text-muted-foreground truncate hidden sm:block">
                          Configuration Management System
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                    <Button
                      variant="outline"
                      onClick={handleRestoreEntityTypes}
                      size="sm"
                      className="hidden md:flex items-center gap-2 px-2 lg:px-3"
                    >
                      <RefreshCw className="h-3 w-3 lg:h-4 lg:w-4" />
                      <span className="hidden lg:inline text-xs lg:text-sm">Restore Entity Types</span>
                      <span className="lg:hidden text-xs">Restore ET</span>
                    </Button>
                    <Button
                      onClick={handleRestoreCustomData}
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 sm:gap-2 px-2 lg:px-3"
                    >
                      <RefreshCw className="h-3 w-3 lg:h-4 lg:w-4" />
                      <span className="hidden lg:inline text-xs lg:text-sm">Restore Custom Data</span>
                      <span className="hidden sm:inline lg:hidden text-xs">Restore Data</span>
                      <span className="sm:hidden text-xs">Restore</span>
                    </Button>
                    {/* Mobile menu for first button */}
                    <Button
                      variant="outline"
                      onClick={handleRestoreEntityTypes}
                      size="sm"
                      className="md:hidden flex items-center gap-1 px-2"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span className="text-xs">ET</span>
                    </Button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <div className="dashboard-content">
              <MasterDataContent activeSection={activeSection} setActiveSection={setActiveSection} />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MasterDataPortal;
