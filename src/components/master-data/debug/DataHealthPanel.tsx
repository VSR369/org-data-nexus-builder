import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertTriangle, CheckCircle, Database, Download, Upload, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { seedingService } from '@/utils/core/UniversalSeedingService';
import { domainGroupsDataManager } from '../domain-groups/domainGroupsDataManager';
import MasterDataRecoveryCenter from '../recovery/MasterDataRecoveryCenter';

const DataHealthPanel: React.FC = () => {
  const [healthData, setHealthData] = useState<any>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRecoveryCenter, setShowRecoveryCenter] = useState(false);
  const { toast } = useToast();

  const refreshHealthData = () => {
    console.log('🔄 Refreshing health data...');
    setIsRefreshing(true);
    
    try {
      const systemHealth = seedingService.getSystemHealth();
      const domainGroupsHealth = domainGroupsDataManager.getDataHealth();
      
      setHealthData({
        system: systemHealth,
        domainGroups: domainGroupsHealth,
        localStorage: Object.keys(localStorage).filter(key => key.includes('master_data')),
        sessionStorage: Object.keys(sessionStorage).filter(key => key.includes('master_data'))
      });
    } catch (error) {
      console.error('❌ Error refreshing health data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshHealthData();
  }, []);

  const handleReseedAll = () => {
    try {
      seedingService.seedAll();
      toast({
        title: "Success",
        description: "All master data has been reseeded successfully",
      });
      refreshHealthData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reseed all data",
        variant: "destructive"
      });
    }
  };

  const handleReseedDomainGroups = () => {
    try {
      domainGroupsDataManager.forceReseed();
      toast({
        title: "Success",
        description: "Domain groups data has been reseeded successfully",
      });
      refreshHealthData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reseed domain groups",
        variant: "destructive"
      });
    }
  };

  const exportAllData = () => {
    try {
      const allData = {
        domainGroups: domainGroupsDataManager.loadData(),
        localStorage: Object.keys(localStorage).reduce((acc, key) => {
          if (key.includes('master_data')) {
            acc[key] = localStorage.getItem(key);
          }
          return acc;
        }, {} as any),
        timestamp: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `master-data-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Master data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  const getHealthBadge = (isHealthy: boolean) => (
    <Badge variant={isHealthy ? "default" : "destructive"} className="ml-2">
      {isHealthy ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
      {isHealthy ? 'Healthy' : 'Issues'}
    </Badge>
  );

  if (showRecoveryCenter) {
    return (
      <div className="space-y-4">
        <Button 
          onClick={() => setShowRecoveryCenter(false)}
          variant="outline"
          className="mb-4"
        >
          ← Back to Health Panel
        </Button>
        <MasterDataRecoveryCenter />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data Health Monitor
            </CardTitle>
            <CardDescription>
              Real-time monitoring of master data persistence and storage health
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowRecoveryCenter(true)}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Recovery Center
            </Button>
            <Button
              onClick={refreshHealthData}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={exportAllData}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Domain Groups Health */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            Domain Groups Storage
            {healthData.domainGroups && getHealthBadge(
              healthData.domainGroups.localStorage && 
              healthData.domainGroups.memory && 
              healthData.domainGroups.isValid
            )}
          </h3>
          
          {healthData.domainGroups && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-3 border rounded-lg">
                <div className="text-sm text-muted-foreground">localStorage</div>
                <div className={`font-medium ${healthData.domainGroups.localStorage ? 'text-green-600' : 'text-red-600'}`}>
                  {healthData.domainGroups.localStorage ? 'Available' : 'Missing'}
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-sm text-muted-foreground">sessionStorage</div>
                <div className={`font-medium ${healthData.domainGroups.sessionStorage ? 'text-green-600' : 'text-red-600'}`}>
                  {healthData.domainGroups.sessionStorage ? 'Available' : 'Missing'}
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-sm text-muted-foreground">Backup</div>
                <div className={`font-medium ${healthData.domainGroups.backup ? 'text-green-600' : 'text-red-600'}`}>
                  {healthData.domainGroups.backup ? 'Available' : 'Missing'}
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-sm text-muted-foreground">Memory Cache</div>
                <div className={`font-medium ${healthData.domainGroups.memory ? 'text-green-600' : 'text-red-600'}`}>
                  {healthData.domainGroups.memory ? 'Loaded' : 'Empty'}
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleReseedDomainGroups}
            variant="outline"
            size="sm"
            className="mr-2"
          >
            Reseed Domain Groups
          </Button>
        </div>

        {/* Storage Overview */}
        <div>
          <h3 className="text-lg font-medium mb-3">Storage Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">localStorage Keys</div>
              <div className="text-sm">
                {healthData.localStorage?.length || 0} master data keys found
              </div>
              {healthData.localStorage?.slice(0, 3).map((key: string) => (
                <div key={key} className="text-xs text-muted-foreground truncate">
                  {key}
                </div>
              ))}
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">sessionStorage Keys</div>
              <div className="text-sm">
                {healthData.sessionStorage?.length || 0} master data keys found
              </div>
              {healthData.sessionStorage?.slice(0, 3).map((key: string) => (
                <div key={key} className="text-xs text-muted-foreground truncate">
                  {key}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Actions */}
        <div>
          <h3 className="text-lg font-medium mb-3">Quick Recovery</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleReseedAll}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              🌱 Reseed All Data
            </Button>
            <Button
              onClick={() => setShowRecoveryCenter(true)}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Full Recovery Center
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataHealthPanel;
