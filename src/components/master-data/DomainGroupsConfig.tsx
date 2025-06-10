import React, { useState, useEffect } from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domain-groups/domainGroupsDataManager';
import DomainGroupForm from './domain-groups/DomainGroupForm';
import DomainGroupDisplay from './domain-groups/DomainGroupDisplay';
import BulkDomainGroupCreator from './domain-groups/BulkDomainGroupCreator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, ChevronDown, ChevronRight, FolderTree, Building2, Target, BarChart3 } from 'lucide-react';

const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: [],
  categories: [],
  subCategories: []
};

const DomainGroupsConfig: React.FC = () => {
  const [data, setData] = useState<DomainGroupsData>(defaultDomainGroupsData);
  const [showCreationForms, setShowCreationForms] = useState(false);

  // Load data on component mount
  useEffect(() => {
    console.log('=== DomainGroupsConfig: Loading data ===');
    const loadedData = domainGroupsDataManager.loadData();
    
    console.log('📊 Loaded domain groups data:', loadedData);
    setData(loadedData);
    
    // If no data exists, show creation forms by default
    if (!loadedData.domainGroups || loadedData.domainGroups.length === 0) {
      setShowCreationForms(true);
    }
  }, []);

  const handleDataUpdate = (newData: DomainGroupsData) => {
    console.log('🔄 DomainGroupsConfig: Updating data:', newData);
    console.log('📊 New data structure:', {
      domainGroups: newData.domainGroups?.length || 0,
      categories: newData.categories?.length || 0,
      subCategories: newData.subCategories?.length || 0
    });
    
    // Save the data through the data manager
    domainGroupsDataManager.saveData(newData);
    
    // Update local state
    setData(newData);
    
    // Hide creation forms after successful creation
    if (newData.domainGroups?.length > 0) {
      setShowCreationForms(false);
    }
    
    console.log('✅ Domain groups data saved and state updated');
  };

  const hasExistingHierarchies = data.domainGroups && data.domainGroups.length > 0;

  // Get statistics for display
  const getStats = () => {
    const domainGroupsCount = data.domainGroups?.length || 0;
    const categoriesCount = data.categories?.length || 0;
    const subCategoriesCount = data.subCategories?.length || 0;
    
    // Group by industry segments
    const industrySegments = new Set(data.domainGroups?.map(dg => dg.industrySegmentName) || []);
    
    return {
      domainGroupsCount,
      categoriesCount,
      subCategoriesCount,
      industrySegmentsCount: industrySegments.size
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Domain Group Hierarchies</h1>
          <p className="text-muted-foreground">
            {hasExistingHierarchies 
              ? "Manage your domain group hierarchies and create new ones"
              : "Create complete domain group hierarchy for competency evaluation"
            }
          </p>
        </div>
        {hasExistingHierarchies && (
          <Button 
            onClick={() => setShowCreationForms(!showCreationForms)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Hierarchy
          </Button>
        )}
      </div>

      {/* Overview Stats Card */}
      {hasExistingHierarchies && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Hierarchy Overview
            </CardTitle>
            <CardDescription>
              Current state of your domain group hierarchies
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
      )}

      {/* Status Banner */}
      {hasExistingHierarchies ? (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FolderTree className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-green-900">Hierarchies Configured Successfully</h3>
                <p className="text-sm text-green-700">
                  Your domain group hierarchies are saved and ready for use in competency evaluations. 
                  You can view them below or add additional hierarchies.
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {stats.domainGroupsCount} Saved
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900">No Hierarchies Found</h3>
                <p className="text-sm text-blue-700">
                  Create your first domain group hierarchy to enable competency evaluations. 
                  Each hierarchy includes Industry Segment → Domain Group → Category → Sub Category.
                </p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Get Started
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Hierarchies Display */}
      {hasExistingHierarchies && (
        <DomainGroupDisplay data={data} onDataUpdate={handleDataUpdate} />
      )}

      {/* Creation Forms Section */}
      {(!hasExistingHierarchies || showCreationForms) && (
        <div className="space-y-6">
          {hasExistingHierarchies ? (
            <Collapsible open={showCreationForms} onOpenChange={setShowCreationForms}>
              <CollapsibleTrigger asChild>
                <Card className="cursor-pointer hover:bg-muted/30 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add New Domain Group Hierarchy
                      </CardTitle>
                      {showCreationForms ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                    <CardDescription>
                      Create additional hierarchies for different industry segments or domain groups
                    </CardDescription>
                  </CardHeader>
                </Card>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-6">
                <BulkDomainGroupCreator data={data} onDataUpdate={handleDataUpdate} />
                <DomainGroupForm data={data} onDataUpdate={handleDataUpdate} />
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <>
              <BulkDomainGroupCreator data={data} onDataUpdate={handleDataUpdate} />
              <DomainGroupForm data={data} onDataUpdate={handleDataUpdate} />
            </>
          )}
        </div>
      )}

      {/* Help Section */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</div>
            <div>
              <p className="font-medium text-sm">Create Hierarchies</p>
              <p className="text-xs text-muted-foreground">Define Industry Segment → Domain Group → Category → Sub Category structures</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</div>
            <div>
              <p className="font-medium text-sm">Save & View</p>
              <p className="text-xs text-muted-foreground">Hierarchies are automatically saved and displayed in expandable format</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</div>
            <div>
              <p className="font-medium text-sm">Use in Evaluations</p>
              <p className="text-xs text-muted-foreground">Navigate to Self Enrollment → Competency Evaluation to use these hierarchies for assessments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainGroupsConfig;
