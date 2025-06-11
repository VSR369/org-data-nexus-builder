
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bug } from 'lucide-react';
import { DomainGroupsData } from '@/types/domainGroups';

interface DebugPanelProps {
  data: DomainGroupsData;
  debugInfo: any;
  hasData: boolean;
  hierarchyExists: boolean;
  onTestDataLoad: () => void;
  onClearAllData: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  data,
  debugInfo,
  hasData,
  hierarchyExists,
  onTestDataLoad,
  onClearAllData
}) => {
  return (
    <Card className="bg-red-50 border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <Bug className="w-5 h-5" />
          Debug Panel - Data Flow Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-red-700">Props Data</h4>
            <p>Domain Groups: {data.domainGroups?.length || 0}</p>
            <p>Categories: {data.categories?.length || 0}</p>
            <p>Sub-Categories: {data.subCategories?.length || 0}</p>
          </div>
          <div>
            <h4 className="font-semibold text-red-700">localStorage</h4>
            <p>Raw Data: {debugInfo.storedRaw ? 'Found' : 'Empty/Null'}</p>
            <p>Manager Has Data: {debugInfo.managerHasData?.toString()}</p>
          </div>
          <div>
            <h4 className="font-semibold text-red-700">Render State</h4>
            <p>Has Data: {hasData.toString()}</p>
            <p>Hierarchy Exists: {hierarchyExists.toString()}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onTestDataLoad} variant="outline" size="sm">
            Force Reload Data
          </Button>
          <Button onClick={onClearAllData} variant="destructive" size="sm">
            Clear All Data
          </Button>
        </div>
        
        <details className="text-xs">
          <summary className="cursor-pointer font-medium text-red-700">Raw Debug Data</summary>
          <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto max-h-40">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;
