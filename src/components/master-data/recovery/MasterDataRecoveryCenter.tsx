
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Database,
  Github,
  FileText,
  Save,
  RotateCcw
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { seedingService } from '@/utils/core/UniversalSeedingService';
import { domainGroupsDataManager } from '../domain-groups/domainGroupsDataManager';
import { countriesDataManager, organizationTypesDataManager } from '@/utils/sharedDataManagers';

interface DataHealthStatus {
  [key: string]: {
    status: 'healthy' | 'warning' | 'error';
    message: string;
    dataCount: number;
  };
}

const MasterDataRecoveryCenter: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<DataHealthStatus>({});
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [gistUrl, setGistUrl] = useState('');
  const [lastBackupTime, setLastBackupTime] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    checkDataHealth();
    loadBackupSettings();
  }, []);

  const checkDataHealth = async () => {
    const status: DataHealthStatus = {};

    // Check domain groups
    try {
      const domainData = await domainGroupsDataManager.loadData();
      status.domainGroups = {
        status: domainData.domainGroups.length > 0 ? 'healthy' : 'warning',
        message: `${domainData.domainGroups.length} domain groups found`,
        dataCount: domainData.domainGroups.length
      };
    } catch (error) {
      status.domainGroups = {
        status: 'error',
        message: 'Failed to load domain groups',
        dataCount: 0
      };
    }

    // Check countries
    try {
      const countries = countriesDataManager.loadData();
      status.countries = {
        status: countries.length > 0 ? 'healthy' : 'warning',
        message: `${countries.length} countries found`,
        dataCount: countries.length
      };
    } catch (error) {
      status.countries = {
        status: 'error',
        message: 'Failed to load countries',
        dataCount: 0
      };
    }

    // Check organization types
    try {
      const orgTypes = organizationTypesDataManager.loadData();
      status.organizationTypes = {
        status: orgTypes.length > 0 ? 'healthy' : 'warning',
        message: `${orgTypes.length} organization types found`,
        dataCount: orgTypes.length
      };
    } catch (error) {
      status.organizationTypes = {
        status: 'error',
        message: 'Failed to load organization types',
        dataCount: 0
      };
    }

    setHealthStatus(status);
  };

  const loadBackupSettings = () => {
    const lastBackup = localStorage.getItem('master_data_last_backup');
    if (lastBackup) {
      setLastBackupTime(new Date(lastBackup).toLocaleString());
    }

    const savedGistUrl = localStorage.getItem('master_data_gist_url');
    if (savedGistUrl) {
      setGistUrl(savedGistUrl);
    }
  };

  const exportAllMasterData = async () => {
    setIsExporting(true);
    try {
      const masterData = {
        domainGroups: domainGroupsDataManager.loadData(),
        countries: countriesDataManager.loadData(),
        organizationTypes: organizationTypesDataManager.loadData(),
        exportTimestamp: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(masterData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `master-data-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      // Save backup timestamp
      localStorage.setItem('master_data_last_backup', new Date().toISOString());
      setLastBackupTime(new Date().toLocaleString());

      toast({
        title: "Export Successful",
        description: "Master data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export master data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const importMasterData = async (file: File) => {
    setIsImporting(true);
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);

      // Validate imported data structure
      if (!importedData.domainGroups || !importedData.countries || !importedData.organizationTypes) {
        throw new Error('Invalid master data format');
      }

      // Import each data type
      if (importedData.domainGroups) {
        domainGroupsDataManager.saveData(importedData.domainGroups);
      }
      if (importedData.countries) {
        countriesDataManager.saveData(importedData.countries);
      }
      if (importedData.organizationTypes) {
        organizationTypesDataManager.saveData(importedData.organizationTypes);
      }

      checkDataHealth();

      toast({
        title: "Import Successful",
        description: "Master data imported and restored successfully",
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import master data. Please check the file format.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const syncToGist = async () => {
    if (!gistUrl) {
      toast({
        title: "GitHub Gist URL Required",
        description: "Please provide a GitHub Gist URL for remote sync",
        variant: "destructive"
      });
      return;
    }

    setSyncProgress(10);
    try {
      const masterData = {
        domainGroups: domainGroupsDataManager.loadData(),
        countries: countriesDataManager.loadData(),
        organizationTypes: organizationTypesDataManager.loadData(),
        syncTimestamp: new Date().toISOString(),
        version: '1.0'
      };

      setSyncProgress(50);

      // In a real implementation, you would use GitHub API to update the Gist
      // For now, we'll simulate the sync and provide the JSON for manual upload
      console.log('Master data to sync:', masterData);
      
      // Save the Gist URL for future use
      localStorage.setItem('master_data_gist_url', gistUrl);
      localStorage.setItem('master_data_last_sync', new Date().toISOString());

      setSyncProgress(100);

      // Download the JSON for manual upload to Gist
      const blob = new Blob([JSON.stringify(masterData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'master-data-gist-sync.json';
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Sync Prepared",
        description: "Master data JSON downloaded. Please manually upload to your GitHub Gist.",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to prepare data for GitHub Gist sync",
        variant: "destructive"
      });
    } finally {
      setSyncProgress(0);
    }
  };

  const restoreCustomData = () => {
    try {
      console.log('🔍 Checking for custom master data backups...');
      
      // Check for any existing custom data in localStorage
      const customDataKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('master_data') && !key.includes('last_backup') && !key.includes('gist_url')) {
          customDataKeys.push(key);
        }
      }

      if (customDataKeys.length > 0) {
        console.log('✅ Found custom master data keys:', customDataKeys);
        
        // Restore from existing custom data
        customDataKeys.forEach(key => {
          const data = localStorage.getItem(key);
          if (data) {
            console.log(`📥 Restoring custom data for ${key}`);
            // Force refresh the data managers
            if (key.includes('domain_groups')) {
              domainGroupsDataManager.saveData(JSON.parse(data));
            } else if (key.includes('countries')) {
              countriesDataManager.saveData(JSON.parse(data));
            } else if (key.includes('organization_types')) {
              organizationTypesDataManager.saveData(JSON.parse(data));
            }
          }
        });
        
        checkDataHealth();
        
        toast({
          title: "Custom Data Restored ✅",
          description: `Successfully restored your custom master data from ${customDataKeys.length} sources`,
        });
      } else {
        // Check for backup files or other recovery options
        toast({
          title: "No Custom Data Found",
          description: "No custom master data found in storage. Please import from backup file or configure manually.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Error restoring custom data:', error);
      toast({
        title: "Restore Failed",
        description: "Failed to restore custom master data",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: 'healthy' | 'warning' | 'error') => {
    const config = {
      healthy: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      warning: { variant: 'secondary' as const, icon: AlertTriangle, color: 'text-yellow-600' },
      error: { variant: 'destructive' as const, icon: AlertTriangle, color: 'text-red-600' }
    };
    
    const { variant, icon: Icon, color } = config[status];
    
    return (
      <Badge variant={variant} className="ml-2">
        <Icon className={`w-3 h-3 mr-1 ${color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Master Data Recovery Center
        </CardTitle>
        <CardDescription>
          Comprehensive master data management, backup, and recovery tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="health" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="health">Health Status</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
            <TabsTrigger value="sync">Remote Sync</TabsTrigger>
            <TabsTrigger value="recovery">Emergency Recovery</TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Data Health Dashboard</h3>
              <Button onClick={checkDataHealth} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="grid gap-4">
              {Object.entries(healthStatus).map(([key, status]) => (
                <div key={key} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                      <p className="text-sm text-muted-foreground">{status.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{status.dataCount} items</Badge>
                      {getStatusBadge(status.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {lastBackupTime && (
              <Alert>
                <Database className="w-4 h-4" />
                <AlertDescription>
                  Last backup: {lastBackupTime}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Export Master Data</h3>
              <Button 
                onClick={exportAllMasterData} 
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Exporting...' : 'Export All Data'}
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Import Master Data</h3>
              <div className="space-y-4">
                <Label htmlFor="import-file">Upload JSON File</Label>
                <Input
                  id="import-file"
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      importMasterData(file);
                    }
                  }}
                  disabled={isImporting}
                />
                {isImporting && (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Importing data...</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sync" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">GitHub Gist Sync</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gist-url">GitHub Gist URL</Label>
                  <Input
                    id="gist-url"
                    value={gistUrl}
                    onChange={(e) => setGistUrl(e.target.value)}
                    placeholder="https://gist.github.com/username/gist-id"
                  />
                </div>
                
                <Button 
                  onClick={syncToGist} 
                  disabled={!gistUrl || syncProgress > 0}
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  Sync to Gist
                </Button>

                {syncProgress > 0 && (
                  <div className="space-y-2">
                    <Progress value={syncProgress} />
                    <p className="text-sm text-muted-foreground">Preparing data for sync...</p>
                  </div>
                )}
              </div>
            </div>

            <Alert>
              <FileText className="w-4 h-4" />
              <AlertDescription>
                Currently, manual upload to GitHub Gist is required. Future versions will support automatic API sync.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="recovery" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Emergency Recovery Actions</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-medium mb-2">Restore Custom Data</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Restore your custom master data configurations from local storage backups.
                  </p>
                  <Button 
                    onClick={restoreCustomData}
                    variant="default"
                    className="flex items-center gap-2 mr-4"
                  >
                    <Save className="w-4 h-4" />
                    Restore Custom Data
                  </Button>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Restore All Defaults</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    This will reset all master data to default values. Use this only if you want to start fresh.
                  </p>
                  <Button 
                    onClick={() => {
                      seedingService.seedAll();
                      checkDataHealth();
                      toast({
                        title: "Defaults Restored",
                        description: "All master data restored to default values",
                      });
                    }}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restore All Defaults
                  </Button>
                </div>

                <div className="p-4 border rounded-lg bg-destructive/10">
                  <h4 className="font-medium mb-2">Clear All Storage</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    This will completely clear all local storage. Only use as a last resort.
                  </p>
                  <Button 
                    onClick={() => {
                      localStorage.clear();
                      sessionStorage.clear();
                      checkDataHealth();
                      toast({
                        title: "Storage Cleared",
                        description: "All storage cleared. Please refresh to reinitialize.",
                        variant: "destructive"
                      });
                    }}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Clear All Storage
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MasterDataRecoveryCenter;
