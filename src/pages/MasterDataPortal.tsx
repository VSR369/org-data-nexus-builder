
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import MasterDataContent from "@/components/MasterDataContent";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MasterDataPortal = () => {
  const [activeSection, setActiveSection] = useState('domain-groups');
  const { toast } = useToast();

  const handleRestoreEntityTypes = async () => {
    console.log('🔧 User requested Entity Types restoration...');
    
    try {
      // Import and use entity types restorer if available
      const { EntityTypesRestorer } = await import('@/utils/entityTypesRestorer');
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
    
    try {
      // Use the custom data restoration utility
      const { CustomDataRestoration } = await import('@/utils/customDataRestoration');
      const result = await CustomDataRestoration.restoreAllCustomDataOnly();
      
      if (result.customDataFound.length > 0) {
        toast({
          title: "Custom Data Restored",
          description: `Restored ${result.customDataFound.length} custom master data categories. Only custom configurations will be shown.`,
        });
      } else {
        toast({
          title: "No Custom Data Found",
          description: "No custom master data configurations found in storage.",
          variant: "destructive",
        });
        
        // Show what's available
        console.log('📋 Available storage keys:', Object.keys(localStorage).filter(k => k.startsWith('master_data_')));
      }
    } catch (error) {
      console.error('❌ Custom data restoration failed:', error);
      toast({
        title: "Restoration Failed",
        description: "Failed to restore custom data. Please check the console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Database className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">
                  Master Data Portal
                </h1>
                <p className="text-sm text-muted-foreground">
                  Configuration Management System
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleRestoreEntityTypes}
                size="sm"
                className="hidden md:flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Restore Entity Types
              </Button>
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
      </div>

      {/* Main Content with Sidebar */}
      <MainLayout 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        showSidebar={true}
      >
        <MasterDataContent activeSection={activeSection} setActiveSection={setActiveSection} />
      </MainLayout>
    </div>
  );
};

export default MasterDataPortal;
