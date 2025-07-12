import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  RefreshCw, 
  Download, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Database,
  History,
  Settings
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { PricingDataProtection } from '@/utils/pricingDataProtection';

const DataProtectionPanel = () => {
  const [healthStatus, setHealthStatus] = useState<{ healthy: boolean; issues: string[]; configCount: number } | null>(null);
  const [backups, setBackups] = useState<Array<{ key: string; timestamp: string; reason: string; dataCount: number }>>([]);
  const [protectionLog, setProtectionLog] = useState<Array<{ timestamp: string; action: string; details: any }>>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    loadProtectionData();
  }, []);

  const loadProtectionData = () => {
    try {
      // Get health status
      const health = PricingDataProtection.healthCheck();
      setHealthStatus(health);

      // Get available backups
      const availableBackups = PricingDataProtection.getAvailableBackups();
      setBackups(availableBackups);

      // Get protection log
      const log = PricingDataProtection.getProtectionLog().slice(-20); // Last 20 entries
      setProtectionLog(log);

      console.log('✅ Protection data loaded', { health, backups: availableBackups.length, logEntries: log.length });
    } catch (error) {
      console.error('❌ Error loading protection data:', error);
      toast({
        variant: "destructive",
        title: "Protection Data Error",
        description: "Failed to load data protection information."
      });
    }
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      const success = PricingDataProtection.createBackup('manual_user_backup');
      if (success) {
        toast({
          title: "Backup Created",
          description: "Your pricing configurations have been backed up successfully."
        });
        loadProtectionData(); // Refresh data
      } else {
        toast({
          variant: "destructive",
          title: "Backup Failed",
          description: "Failed to create backup. Please try again."
        });
      }
    } catch (error) {
      console.error('Backup error:', error);
      toast({
        variant: "destructive",
        title: "Backup Error",
        description: "An error occurred while creating the backup."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreBackup = async (backupKey: string) => {
    setLoading(true);
    try {
      const success = PricingDataProtection.restoreFromBackup(backupKey);
      if (success) {
        toast({
          title: "Restore Successful",
          description: "Your pricing configurations have been restored from backup."
        });
        loadProtectionData(); // Refresh data
        // Refresh the page to show restored data
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast({
          variant: "destructive",
          title: "Restore Failed",
          description: "Failed to restore from backup. Please try again."
        });
      }
    } catch (error) {
      console.error('Restore error:', error);
      toast({
        variant: "destructive",
        title: "Restore Error",
        description: "An error occurred while restoring the backup."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyRecovery = async () => {
    setLoading(true);
    try {
      const recoveredConfigs = PricingDataProtection.emergencyRecovery();
      toast({
        title: "Emergency Recovery Complete",
        description: `Recovered ${recoveredConfigs.length} pricing configurations from all available sources.`
      });
      loadProtectionData(); // Refresh data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Emergency recovery error:', error);
      toast({
        variant: "destructive",
        title: "Recovery Error",
        description: "An error occurred during emergency recovery."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnableCustomMode = async () => {
    setLoading(true);
    try {
      const success = PricingDataProtection.enableCustomOnlyMode();
      if (success) {
        toast({
          title: "Custom Mode Enabled",
          description: "System is now in custom-only mode. Only your custom configurations will be shown."
        });
        loadProtectionData(); // Refresh data
      } else {
        toast({
          variant: "destructive",
          title: "Mode Change Failed",
          description: "Failed to enable custom-only mode."
        });
      }
    } catch (error) {
      console.error('Mode change error:', error);
      toast({
        variant: "destructive",
        title: "Mode Change Error",
        description: "An error occurred while changing the mode."
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getHealthBadge = () => {
    if (!healthStatus) return <Badge variant="secondary">Unknown</Badge>;
    
    if (healthStatus.healthy) {
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Healthy</Badge>;
    } else {
      return <Badge variant="destructive">Issues Found</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          Data Protection Center
        </h2>
        <p className="text-lg text-muted-foreground">
          Robust safeguards for your custom pricing configurations
        </p>
      </div>

      {/* Health Status Card */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Health Status
            </div>
            {getHealthBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {healthStatus ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Configuration Count:</span>
                <Badge variant="outline">{healthStatus.configCount} configs</Badge>
              </div>
              
              {healthStatus.issues.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <strong>Issues detected:</strong>
                      <ul className="list-disc list-inside space-y-1">
                        {healthStatus.issues.map((issue, index) => (
                          <li key={index} className="text-sm">{issue}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              {healthStatus.healthy && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    All systems operational. Your pricing configurations are secure and protected.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Loading health status...
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="backups" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="backups" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Backups
          </TabsTrigger>
          <TabsTrigger value="protection-log" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="recovery" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Recovery
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="backups">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Backup Management</span>
                <Button onClick={handleCreateBackup} disabled={loading} size="sm">
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                  Create Backup
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {backups.length > 0 ? (
                <div className="space-y-3">
                  {backups.map((backup) => (
                    <div key={backup.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{formatTimestamp(backup.timestamp)}</div>
                        <div className="text-sm text-muted-foreground">
                          Reason: {backup.reason} • {backup.dataCount} configurations
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleRestoreBackup(backup.key)}
                        disabled={loading}
                        variant="outline"
                        size="sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Restore
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No backups available yet.</p>
                  <p className="text-sm">Create your first backup to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protection-log">
          <Card>
            <CardHeader>
              <CardTitle>Protection Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              {protectionLog.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {protectionLog.map((entry, index) => (
                    <div key={index} className="flex items-start justify-between p-2 border-l-2 border-l-primary/20 pl-3">
                      <div className="space-y-1 flex-1">
                        <div className="text-sm font-medium">{entry.action.replace(/_/g, ' ')}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </div>
                        {entry.details && Object.keys(entry.details).length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {JSON.stringify(entry.details)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No activity recorded yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recovery">
          <Card>
            <CardHeader>
              <CardTitle>Data Recovery Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Use these recovery options only if you're experiencing data loss or corruption issues.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleEmergencyRecovery}
                  disabled={loading}
                  variant="destructive"
                  className="w-full"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Emergency Data Recovery
                </Button>
                <p className="text-sm text-muted-foreground">
                  Attempts to recover configurations from all available sources including backups.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Protection Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Custom-Only Mode</div>
                    <div className="text-sm text-muted-foreground">
                      Show only your custom configurations, hiding all default data
                    </div>
                  </div>
                  <Button 
                    onClick={handleEnableCustomMode}
                    disabled={loading}
                    variant="outline"
                  >
                    {localStorage.getItem('master_data_mode') === 'custom_only' ? 'Enabled' : 'Enable'}
                  </Button>
                </div>
                
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Protection Features Active:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Automatic backups before deletions and major changes</li>
                      <li>Data validation on every save operation</li>
                      <li>Complete activity logging for audit trails</li>
                      <li>Emergency recovery from multiple data sources</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataProtectionPanel;