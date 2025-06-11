import React, { useState, useEffect } from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domain-groups/domainGroupsDataManager';
import DomainGroupDisplay from './domain-groups/DomainGroupDisplay';
import ExcelUploadWizard from './domain-groups/wizard/ExcelUploadWizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderTree, Building2, Target, BarChart3, RefreshCw, Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: [],
  categories: [],
  subCategories: []
};

const DomainGroupsConfig: React.FC = () => {
  const [data, setData] = useState<DomainGroupsData>(defaultDomainGroupsData);
  const [showWizard, setShowWizard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Enhanced data loading with better persistence
  useEffect(() => {
    loadDomainGroupsData();
  }, []);

  const loadDomainGroupsData = () => {
    console.log('=== DomainGroupsConfig: Enhanced Loading ===');
    setIsLoading(true);
    
    try {
      const loadedData = domainGroupsDataManager.loadData();
      console.log('📊 Enhanced loaded domain groups data:', loadedData);
      
      // Validate the loaded data
      const validData = {
        domainGroups: Array.isArray(loadedData.domainGroups) ? loadedData.domainGroups : [],
        categories: Array.isArray(loadedData.categories) ? loadedData.categories : [],
        subCategories: Array.isArray(loadedData.subCategories) ? loadedData.subCategories : []
      };
      
      setData(validData);
      
      // Only show creation forms if no data exists
      const hasData = validData.domainGroups.length > 0;
      setShowWizard(!hasData);
      
      console.log('✅ Enhanced domain groups data loaded successfully:', {
        domainGroups: validData.domainGroups.length,
        categories: validData.categories.length,
        subCategories: validData.subCategories.length,
        showWizard: !hasData
      });
      
    } catch (error) {
      console.error('❌ Error loading domain groups data:', error);
      setData(defaultDomainGroupsData);
      setShowWizard(true);
      
      toast({
        title: "Warning",
        description: "Could not load saved domain groups data. Starting fresh.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataUpdate = (newData: DomainGroupsData) => {
    console.log('🔄 DomainGroupsConfig: Enhanced data update:', newData);
    console.log('📊 New data structure:', {
      domainGroups: newData.domainGroups?.length || 0,
      categories: newData.categories?.length || 0,
      subCategories: newData.subCategories?.length || 0
    });
    
    try {
      // Validate new data
      const validatedData = {
        domainGroups: Array.isArray(newData.domainGroups) ? newData.domainGroups : [],
        categories: Array.isArray(newData.categories) ? newData.categories : [],
        subCategories: Array.isArray(newData.subCategories) ? newData.subCategories : []
      };
      
      // Save through enhanced data manager
      domainGroupsDataManager.saveData(validatedData);
      
      // Update local state
      setData(validatedData);
      
      // Hide creation forms after successful creation
      if (validatedData.domainGroups.length > 0) {
        setShowWizard(false);
      }
      
      console.log('✅ Enhanced domain groups data saved and state updated');
      
      toast({
        title: "Success",
        description: `Domain groups data saved successfully! ${validatedData.domainGroups.length} groups, ${validatedData.categories.length} categories, ${validatedData.subCategories.length} sub-categories.`
      });
      
    } catch (error) {
      console.error('❌ Error updating domain groups data:', error);
      toast({
        title: "Error", 
        description: "Failed to save domain groups data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRefreshData = () => {
    console.log('🔄 Manual refresh requested');
    loadDomainGroupsData();
    toast({
      title: "Refreshed",
      description: "Domain groups data has been refreshed from storage."
    });
  };

  const hasExistingHierarchies = data.domainGroups && data.domainGroups.length > 0;

  // Get statistics for display
  const getStats = () => {
    const domainGroupsCount = data.domainGroups?.length || 0;
    const categoriesCount = data.categories?.length || 0;
    const subCategoriesCount = data.subCategories?.length || 0;
    
    // Group by industry segments
    const industrySegments = new Set(data.domainGroups?.map(dg => dg.industrySegmentName || 'Unknown') || []);
    
    return {
      domainGroupsCount,
      categoriesCount,
      subCategoriesCount,
      industrySegmentsCount: industrySegments.size
    };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          <span>Loading domain groups data...</span>
        </div>
      </div>
    );
  }

  // Show wizard if explicitly requested or no data exists
  if (showWizard || !hasExistingHierarchies) {
    return (
      <div className="space-y-6">
        <ExcelUploadWizard
          data={data}
          onDataUpdate={handleDataUpdate}
          onCancel={() => setShowWizard(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Domain Group Hierarchies</h1>
          <p className="text-muted-foreground">
            Manage your domain group hierarchies with Excel upload, manual entry, or templates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleRefreshData}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button 
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Create New Hierarchy
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FolderTree className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-green-900">Hierarchies Configured Successfully</h3>
              <p className="text-sm text-green-700">
                Your domain group hierarchies are saved and ready for use. Use the wizard to add more hierarchies 
                with Excel upload, manual entry, or pre-built templates.
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {stats.domainGroupsCount} Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Choose how you'd like to add more domain group hierarchies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => setShowWizard(true)}
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm">Excel Upload</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => setShowWizard(true)}
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm">Manual Entry</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => setShowWizard(true)}
            >
              <Target className="w-6 h-6" />
              <span className="text-sm">Use Template</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Hierarchy Overview
          </CardTitle>
          <CardDescription>
            Current state of your domain group hierarchies (persisted across sessions)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.industrySegmentsCount}</div>
              <div className="text-sm text-muted-foreground">Industry Segments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.domainGroupsCount}</div>
              <div className="text-sm text-muted-foreground">Domain Groups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.categoriesCount}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.subCategoriesCount}</div>
              <div className="text-sm text-muted-foreground">Sub-Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Hierarchies Display */}
      <DomainGroupDisplay data={data} onDataUpdate={handleDataUpdate} />

      {/* Help Section */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Enhanced Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</div>
            <div>
              <p className="font-medium text-sm">Excel Upload</p>
              <p className="text-xs text-muted-foreground">Bulk upload hundreds of categories and sub-categories in seconds with validation</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</div>
            <div>
              <p className="font-medium text-sm">Industry Templates</p>
              <p className="text-xs text-muted-foreground">Pre-built hierarchies for Life Sciences, BFSI, Healthcare, and more</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</div>
            <div>
              <p className="font-medium text-sm">Smart Validation</p>
              <p className="text-xs text-muted-foreground">Automated validation against configured industry segments and duplicate detection</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainGroupsConfig;
