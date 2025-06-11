import React, { useState, useEffect } from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domain-groups/domainGroupsDataManager';
import DomainGroupForm from './domain-groups/DomainGroupForm';
import ManualEntryWizard from './domain-groups/wizard/ManualEntryWizard';
import DomainGroupDisplay from './domain-groups/DomainGroupDisplay';
import HierarchyDisplay from './domain-groups/HierarchyDisplay';
import ActionsSection from './domain-groups/ActionsSection';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, TreePine, FileSpreadsheet, Upload } from 'lucide-react';

const defaultDomainGroupsData: DomainGroupsData = {
  domainGroups: []
};

const DomainGroupsConfig: React.FC = () => {
  const [data, setData] = useState<DomainGroupsData>(defaultDomainGroupsData);

  useEffect(() => {
    const loadedData = domainGroupsDataManager.loadData();
    setData(loadedData);
  }, []);

  const handleDataUpdate = (newData: DomainGroupsData) => {
    setData(newData);
  };

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
              <CardContent>
                <ManualEntryWizard
                  existingData={data}
                  onClose={() => { }}
                  onSubmit={(newData: DomainGroupsData) => {
                    handleDataUpdate(newData);
                  }}
                />
              </CardContent>
            </CardHeader>
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
      <HierarchyDisplay data={data} />
      <ActionsSection data={data} onDataUpdate={handleDataUpdate} />
    </div>
  );
};

export default DomainGroupsConfig;
