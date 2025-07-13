import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Upload, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domain-groups/domainGroupsDataManager';
import DomainGroupForm from './domain-groups/DomainGroupForm';
import CombinedHierarchyDisplay from './domain-groups/CombinedHierarchyDisplay';
import DomainGroupsHeader from './domain-groups/DomainGroupsHeader';
import ManualEntryWizard from './domain-groups/wizard/ManualEntryWizard';
import DomainGroupHierarchyManager from './domain-groups/DomainGroupHierarchyManager';

const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: [],
  categories: [],
  subCategories: []
};

const DomainGroupsConfig: React.FC = () => {
  const [data, setData] = useState<DomainGroupsData>({ domainGroups: [], categories: [], subCategories: [] });
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [newlyCreatedIds, setNewlyCreatedIds] = useState<Set<string>>(new Set());
  const [showWizard, setShowWizard] = useState(false);
  const [showHierarchyManager, setShowHierarchyManager] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Ref for scrolling to data entry section
  const dataEntryRef = useRef<HTMLDivElement>(null);

  // Function to load and refresh data
  const loadData = async () => {
    console.log('🔄 DomainGroupsConfig: Loading data...');
    setIsLoading(true);
    
    try {
      const loadedData = await domainGroupsDataManager.refreshData();
      console.log('✅ DomainGroupsConfig: Loaded data:', loadedData);
      setData(loadedData);
      
      // Show success message if data was loaded
      if (loadedData.domainGroups.length > 0) {
        toast({
          title: "Data Loaded",
          description: `Found ${loadedData.domainGroups.length} domain groups`,
        });
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load domain groups data. Using sample data.",
        variant: "destructive"
      });
      
      // Try to load sample data as fallback
      const sampleData = domainGroupsDataManager.forceReseed();
      setData(sampleData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceRefresh = () => {
    console.log('🔄 Force refresh requested');
    loadData();
  };

  const handleClearData = () => {
    console.log('🗑️ Clear data requested');
    domainGroupsDataManager.clearAllData();
    setData({ domainGroups: [], categories: [], subCategories: [] });
    toast({
      title: "Data Cleared",
      description: "All domain groups data has been cleared",
    });
  };

  const handleExportData = async () => {
    try {
      const exportData = await domainGroupsDataManager.exportData();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `domain-groups-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Domain groups data has been exported as JSON",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export domain groups data",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add effect to listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'master_data_domain_groups') {
        console.log('🔄 DomainGroupsConfig: Storage changed, reloading data...');
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDataUpdate = async (newData: DomainGroupsData) => {
    console.log('💾 Updating domain groups data:', newData);
    
    // Save the data first
    const saveSuccess = await domainGroupsDataManager.saveData(newData);
    
    if (saveSuccess) {
      // Identify newly created domain groups
      const existingIds = new Set(data.domainGroups.map(dg => dg.id));
      const newIds = new Set(
        newData.domainGroups
          .filter(dg => !existingIds.has(dg.id))
          .map(dg => dg.id)
      );
      
      setNewlyCreatedIds(newIds);
      setData(newData);
      
      toast({
        title: "Data Updated",
        description: `Successfully saved ${newData.domainGroups.length} domain groups`,
      });
      
      // Clear the "new" indicators after 10 seconds
      if (newIds.size > 0) {
        setTimeout(() => {
          setNewlyCreatedIds(new Set());
        }, 10000);
      }
    } else {
      toast({
        title: "Save Failed",
        description: "Failed to save domain groups data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleToggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const scrollToDataEntry = () => {
    dataEntryRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleStartManualEntry = () => {
    // No-op since manual entry is removed
  };

  const handleOpenWizard = () => {
    setShowWizard(true);
  };

  const handleCloseWizard = () => {
    setShowWizard(false);
    // Refresh data when closing wizard
    loadData();
  };

  const handleUploadExcel = () => {
    setShowHierarchyManager(true);
  };

  const handleBackFromHierarchyManager = () => {
    setShowHierarchyManager(false);
    // Force refresh data when returning from Excel upload
    console.log('🔄 Returning from hierarchy manager, refreshing data...');
    loadData();
  };

  // If hierarchy manager is open, show only the hierarchy manager
  if (showHierarchyManager) {
    return (
      <div className="space-y-6">
        <DomainGroupHierarchyManager onBack={handleBackFromHierarchyManager} />
      </div>
    );
  }

  // If wizard is open, show only the wizard
  if (showWizard) {
    return (
      <div className="space-y-6">
        <ManualEntryWizard 
          data={data}
          onDataUpdate={handleDataUpdate}
          onCancel={handleCloseWizard}
        />
      </div>
    );
  }

  const [dataStats, setDataStats] = useState({ domainGroups: 0, categories: 0, subCategories: 0 });

  // Update data stats when data changes
  useEffect(() => {
    const updateStats = async () => {
      const stats = await domainGroupsDataManager.getDataStats();
      setDataStats(stats);
    };
    updateStats();
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <DomainGroupsHeader 
            onStartManualEntry={handleStartManualEntry}
            onScrollToDataEntry={scrollToDataEntry}
            onOpenWizard={handleOpenWizard}
            onUploadExcel={handleUploadExcel}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleForceRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleExportData}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={handleClearData}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-destructive hover:text-destructive"
          >
            <AlertTriangle className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Data Statistics */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Currently configured: {dataStats.domainGroups} domain groups, {dataStats.categories} categories, {dataStats.subCategories} sub-categories
          </div>
          {dataStats.domainGroups === 0 && (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">No domain groups found - try refreshing or creating new ones</span>
            </div>
          )}
        </div>
      </div>

      {/* Display existing hierarchies */}
      <CombinedHierarchyDisplay 
        data={data} 
        expandedGroups={expandedGroups}
        expandedCategories={expandedCategories}
        newlyCreatedIds={newlyCreatedIds}
        onToggleGroupExpansion={handleToggleGroupExpansion}
        onToggleCategoryExpansion={handleToggleCategoryExpansion}
        onDataUpdate={handleDataUpdate}
      />

      {/* Data Entry Section */}
      <div ref={dataEntryRef} className="scroll-mt-6">
        <DomainGroupForm data={data} onDataUpdate={handleDataUpdate} />
      </div>
    </div>
  );
};

export default DomainGroupsConfig;
