
import React, { useState, useEffect } from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domain-groups/domainGroupsDataManager';
import DomainGroupForm from './domain-groups/DomainGroupForm';
import ManualEntryWizard from './domain-groups/wizard/ManualEntryWizard';
import ActionsSection from './domain-groups/ActionsSection';
import CombinedHierarchyDisplay from './domain-groups/CombinedHierarchyDisplay';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, TreePine, FileSpreadsheet, Upload } from 'lucide-react';

const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: [],
  categories: [],
  subCategories: []
};

const DomainGroupsConfig: React.FC = () => {
  const [data, setData] = useState<DomainGroupsData>(defaultDomainGroupsData);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [newlyCreatedIds, setNewlyCreatedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadedData = domainGroupsDataManager.loadData();
    setData(loadedData);
  }, []);

  const handleDataUpdate = (newData: DomainGroupsData) => {
    // Identify newly created domain groups
    const existingIds = new Set(data.domainGroups.map(dg => dg.id));
    const newIds = new Set(
      newData.domainGroups
        .filter(dg => !existingIds.has(dg.id))
        .map(dg => dg.id)
    );
    
    setNewlyCreatedIds(newIds);
    setData(newData);
    
    // Clear the "new" indicators after 10 seconds
    if (newIds.size > 0) {
      setTimeout(() => {
        setNewlyCreatedIds(new Set());
      }, 10000);
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

  if (showManualEntry) {
    return (
      <div className="space-y-6">
        <ManualEntryWizard
          data={data}
          onDataUpdate={handleDataUpdate}
          onCancel={() => setShowManualEntry(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Domain Groups Configuration</h1>
          <p className="text-muted-foreground">Manage domain groups for the platform</p>
        </div>
      </div>

      <Tabs defaultValue="manual-entry" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manual-entry">
            <TreePine className="mr-2 h-4 w-4" />
            Manual Entry
          </TabsTrigger>
          <TabsTrigger disabled value="upload-excel">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Upload Excel
          </TabsTrigger>
          <TabsTrigger disabled value="upload-template">
            <Upload className="mr-2 h-4 w-4" />
            Upload Template
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual-entry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Domain Group Entry</CardTitle>
              <CardDescription>Create domain groups manually using the wizard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowManualEntry(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Start Manual Entry Wizard
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upload-excel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Excel</CardTitle>
              <CardDescription>Functionality coming soon.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upload-template" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Template</CardTitle>
              <CardDescription>Functionality coming soon.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DomainGroupForm data={data} onDataUpdate={handleDataUpdate} />
      
      <CombinedHierarchyDisplay 
        data={data} 
        expandedGroups={expandedGroups}
        expandedCategories={expandedCategories}
        newlyCreatedIds={newlyCreatedIds}
        onToggleGroupExpansion={handleToggleGroupExpansion}
        onToggleCategoryExpansion={handleToggleCategoryExpansion}
        onDataUpdate={handleDataUpdate}
      />
      
      <ActionsSection 
        hasData={data.domainGroups.length > 0}
        isCreating={false}
        onShowDataEntry={() => setShowManualEntry(true)}
      />
    </div>
  );
};

export default DomainGroupsConfig;
