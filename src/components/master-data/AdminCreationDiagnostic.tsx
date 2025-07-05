import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Database, 
  Users, 
  Key,
  Eye,
  AlertCircle,
  Info,
  Bug
} from 'lucide-react';
import { AdminDataManager } from '@/utils/adminDataManager';

interface StorageHealth {
  mainStorage: { exists: boolean; count: number; valid: boolean; error: string | null };
  legacyStorage: { exists: boolean; count: number; valid: boolean; error: string | null };
  unified: { totalCount: number; duplicates: number };
}

interface AdminData {
  id: string;
  name?: string;
  adminName?: string;
  email?: string;
  adminEmail?: string;
  contactNumber?: string;
  userId?: string;
  adminId?: string;
  sourceSeekerId: string;
  organizationName?: string;
}

const AdminCreationDiagnostic: React.FC = () => {
  const [storageHealth, setStorageHealth] = useState<StorageHealth | null>(null);
  const [mainAdmins, setMainAdmins] = useState<AdminData[]>([]);
  const [legacyAdmins, setLegacyAdmins] = useState<AdminData[]>([]);
  const [issues, setIssues] = useState<string[]>([]);
  const [showRawData, setShowRawData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const analyzeAdminData = () => {
    console.log('🔍 Admin Creation Diagnostic - Starting analysis...');
    const foundIssues: string[] = [];
    
    // Get storage health
    const health = AdminDataManager.getStorageHealth();
    setStorageHealth(health);
    
    // Load main storage data
    try {
      const mainData = localStorage.getItem('administrators');
      if (mainData) {
        const parsed = JSON.parse(mainData);
        setMainAdmins(Array.isArray(parsed) ? parsed : []);
        console.log('📊 Main storage loaded:', parsed.length, 'administrators');
      } else {
        setMainAdmins([]);
        console.log('📭 No main storage data found');
      }
    } catch (error) {
      foundIssues.push(`Main storage parse error: ${error}`);
      setMainAdmins([]);
    }

    // Load legacy storage data
    try {
      const legacyData = localStorage.getItem('created_administrators');
      if (legacyData) {
        const parsed = JSON.parse(legacyData);
        setLegacyAdmins(Array.isArray(parsed) ? parsed : []);
        console.log('📊 Legacy storage loaded:', parsed.length, 'administrators');
      } else {
        setLegacyAdmins([]);
        console.log('📭 No legacy storage data found');
      }
    } catch (error) {
      foundIssues.push(`Legacy storage parse error: ${error}`);
      setLegacyAdmins([]);
    }

    // Analyze data quality issues
    if (health.mainStorage.exists && !health.mainStorage.valid) {
      foundIssues.push('Main storage contains invalid data format');
    }
    
    if (health.legacyStorage.exists && !health.legacyStorage.valid) {
      foundIssues.push('Legacy storage contains invalid data format');
    }

    if (health.unified.duplicates > 0) {
      foundIssues.push(`Found ${health.unified.duplicates} duplicate administrators across storages`);
    }

    // Check for missing required fields
    [...mainAdmins, ...legacyAdmins].forEach((admin, index) => {
      const source = index < mainAdmins.length ? 'main' : 'legacy';
      const adminName = admin.name || admin.adminName || `Admin ${index + 1}`;
      
      if (!admin.name && !admin.adminName) {
        foundIssues.push(`${source} storage: ${adminName} missing name field`);
      }
      
      if (!admin.email && !admin.adminEmail) {
        foundIssues.push(`${source} storage: ${adminName} missing email field`);
      }
      
      if (!admin.sourceSeekerId) {
        foundIssues.push(`${source} storage: ${adminName} missing sourceSeekerId`);
      }
    });

    setIssues(foundIssues);
    console.log('🔍 Analysis complete - Found', foundIssues.length, 'issues');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      analyzeAdminData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleMigration = async () => {
    const result = await AdminDataManager.migrateLegacyData();
    if (result.success) {
      console.log(`✅ Migration successful: ${result.migratedCount} administrators migrated`);
      analyzeAdminData(); // Refresh after migration
    } else {
      console.error('❌ Migration failed:', result.errors);
    }
  };

  useEffect(() => {
    analyzeAdminData();
  }, []);

  const renderStorageStatus = (storage: any, title: string) => (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        <span className="font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {storage.exists ? (
          <>
            <Badge variant={storage.valid ? "default" : "destructive"}>
              {storage.count} records
            </Badge>
            {storage.valid ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
          </>
        ) : (
          <Badge variant="secondary">Not found</Badge>
        )}
      </div>
    </div>
  );

  const renderAdminData = (admin: AdminData, source: string, index: number) => (
    <div key={`${source}-${index}`} className="p-3 border rounded-lg bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">
          {admin.name || admin.adminName || `Admin ${index + 1}`}
        </span>
        <Badge variant="outline" className="text-xs">
          {source}
        </Badge>
      </div>
      <div className="space-y-1 text-xs text-gray-600">
        <div><span className="font-medium">Email:</span> {admin.email || admin.adminEmail || 'Missing'}</div>
        <div><span className="font-medium">User ID:</span> {admin.userId || admin.adminId || 'Missing'}</div>
        <div><span className="font-medium">Contact:</span> {admin.contactNumber || 'Missing'}</div>
        <div><span className="font-medium">Seeker ID:</span> {admin.sourceSeekerId || 'Missing'}</div>
        <div><span className="font-medium">Organization:</span> {admin.organizationName || 'Missing'}</div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Key className="h-6 w-6" />
            Admin Creation Diagnostic
          </h1>
          <p className="text-gray-600 mt-1">
            Analyze administrator storage, diagnose issues, and troubleshoot data retrieval problems
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Analysis
        </Button>
      </div>

      {/* Storage Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage Health Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {storageHealth && (
            <>
              {renderStorageStatus(storageHealth.mainStorage, "Main Administrator Storage")}
              {renderStorageStatus(storageHealth.legacyStorage, "Legacy Administrator Storage")}
              
              <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Unified View</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{storageHealth.unified.totalCount} total</Badge>
                  {storageHealth.unified.duplicates > 0 && (
                    <Badge variant="destructive">{storageHealth.unified.duplicates} duplicates</Badge>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Issues Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Detected Issues ({issues.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>No issues detected</span>
            </div>
          ) : (
            <div className="space-y-2">
              {issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-800">{issue}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Admin Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Edit Administrator Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Common Edit Admin Issues:</h4>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• Form fields showing blank: Data format mismatch between storage formats</li>
              <li>• "Administrator not found": Missing sourceSeekerId mapping</li>
              <li>• Missing contact/user ID: Legacy data doesn't have these fields</li>
              <li>• Form not populating: Timing issues with form reset</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Data Migration Solution:</h4>
            <p className="text-sm text-blue-700 mb-3">
              Migrate legacy administrator data to the unified format to resolve edit issues.
            </p>
            <Button onClick={handleMigration} variant="outline" size="sm">
              Migrate Legacy Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Administrator Data View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Administrator Data ({mainAdmins.length + legacyAdmins.length} total)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowRawData(!showRawData)} 
              variant="outline" 
              size="sm"
            >
              {showRawData ? 'Hide' : 'Show'} Raw Data
            </Button>
            <Info className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              View stored administrator data to understand format differences
            </span>
          </div>

          {showRawData && (
            <>
              {mainAdmins.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Main Storage ({mainAdmins.length})</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {mainAdmins.map((admin, index) => renderAdminData(admin, 'main', index))}
                  </div>
                </div>
              )}

              {legacyAdmins.length > 0 && (
                <div>
                  <Separator className="my-4" />
                  <h4 className="font-medium mb-3">Legacy Storage ({legacyAdmins.length})</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {legacyAdmins.map((admin, index) => renderAdminData(admin, 'legacy', index))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCreationDiagnostic;