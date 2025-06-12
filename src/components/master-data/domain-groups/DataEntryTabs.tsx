
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, TreePine, FileSpreadsheet, Upload } from 'lucide-react';

interface DataEntryTabsProps {
  onStartManualEntry: () => void;
}

const DataEntryTabs: React.FC<DataEntryTabsProps> = ({ onStartManualEntry }) => {
  return (
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
        <Button onClick={onStartManualEntry} className="mb-4">
          <Plus className="mr-2 h-4 w-4" />
          Submit
        </Button>
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
  );
};

export default DataEntryTabs;
