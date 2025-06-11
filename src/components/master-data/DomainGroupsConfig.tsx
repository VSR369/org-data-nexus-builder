
import React, { useState, useEffect } from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domain-groups/domainGroupsDataManager';
import DomainGroupForm from './domain-groups/DomainGroupForm';
import ManualEntryWizard from './domain-groups/wizard/ManualEntryWizard';
import DomainGroupDisplay from './domain-groups/DomainGroupDisplay';
import HierarchyDisplay from './domain-groups/HierarchyDisplay';
import ActionsSection from './domain-groups/ActionsSection';
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

  useEffect(() => {
    const loadedData = domainGroupsDataManager.loadData();
    setData(loadedData);
  }, []);

  const handleDataUpdate = (newData: DomainGroupsData) => {
    setData(newData);
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

  const handleCreateLifeSciencesHierarchy = () => {
    // Implementation for creating Life Sciences hierarchy
    console.log('Creating Life Sciences hierarchy...');
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
      <DomainGroupDisplay data={data} onDataUpdate={handleDataUpdate} />
      <HierarchyDisplay 
        data={data} 
        expandedGroups={expandedGroups}
        expandedCategories={expandedCategories}
        onToggleGroupExpansion={handleToggleGroupExpansion}
        onToggleCategoryExpansion={handleToggleCategoryExpansion}
      />
      <ActionsSection 
        hasData={data.domainGroups.length > 0}
        isCreating={false}
        onShowDataEntry={() => setShowManualEntry(true)}
        onCreateLifeSciencesHierarchy={handleCreateLifeSciencesHierarchy}
      />
    </div>
  );
};

export default DomainGroupsConfig;
