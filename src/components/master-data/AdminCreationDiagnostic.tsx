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
  storage: { exists: boolean; count: number; valid: boolean; error: string | null };
  totalCount: number;
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
  createdAt?: string;
}

const AdminCreationDiagnostic: React.FC = () => {
  const [storageHealth, setStorageHealth] = useState<StorageHealth | null>(null);
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [issues, setIssues] = useState<string[]>([]);
  const [showRawData, setShowRawData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const analyzeAdminData = () => {
    console.log('🔍 Admin Creation Diagnostic - Starting analysis...');
    const foundIssues: string[] = [];
    
    // Get storage health
    const health = AdminDataManager.getStorageHealth();
    setStorageHealth(health);
    
    // Load administrator data with detailed logging
    try {
      const adminData = localStorage.getItem('administrators');
      console.log('🔍 RAW ADMIN DATA:', adminData);
      
      if (adminData) {
        const parsed = JSON.parse(adminData);
        console.log('🔍 PARSED ADMIN DATA:', JSON.stringify(parsed, null, 2));
        
        // Log each admin's structure
        if (Array.isArray(parsed)) {
          parsed.forEach((admin, index) => {
            console.log(`🔍 Admin ${index + 1} structure:`, {
              id: admin.id,
              hasName: !!(admin.name || admin.adminName),
              hasEmail: !!(admin.email || admin.adminEmail),
              hasUserId: !!(admin.userId || admin.adminId),
              hasContact: !!admin.contactNumber,
              hasSeekerId: !!admin.sourceSeekerId,
              hasOrgName: !!admin.organizationName,
              allFields: Object.keys(admin)
            });
          });
        }
        
        setAdmins(Array.isArray(parsed) ? parsed : []);
        console.log('📊 Administrator storage loaded:', parsed.length, 'administrators');
      } else {
        setAdmins([]);
        console.log('📭 No administrator data found');
      }
    } catch (error) {
      console.error('❌ Admin data parse error:', error);
      foundIssues.push(`Administrator storage parse error: ${error}`);
      setAdmins([]);
    }

    // Analyze data quality issues
    if (health.storage.exists && !health.storage.valid) {
      foundIssues.push('Administrator storage contains invalid data format');
    }

    // Check for missing required fields in administrators
    admins.forEach((admin, index) => {
      const adminName = admin.name || admin.adminName || `Admin ${index + 1}`;
      
      if (!admin.name && !admin.adminName) {
        foundIssues.push(`❌ Administrator ${adminName} missing name field - Edit form will be blank`);
      }
      
      if (!admin.email && !admin.adminEmail) {
        foundIssues.push(`❌ Administrator ${adminName} missing email field - Edit form will be blank`);
      }
      
      if (!admin.userId && !admin.adminId) {
        foundIssues.push(`❌ Administrator ${adminName} missing userId field - Edit form will be blank`);
      }
      
      if (!admin.contactNumber) {
        foundIssues.push(`⚠️ Administrator ${adminName} missing contactNumber field`);
      }
      
      if (!admin.sourceSeekerId) {
        foundIssues.push(`❌ Administrator ${adminName} missing sourceSeekerId - Cannot link to organization`);
      }
      
      // Check for incomplete data structure (only has id, sourceSeekerId, createdAt)
      const hasOnlyBasicFields = admin.id && admin.sourceSeekerId && admin.createdAt && 
                                 !admin.name && !admin.adminName && !admin.email && !admin.adminEmail;
      if (hasOnlyBasicFields) {
        foundIssues.push(`🚨 CRITICAL: Administrator ${admin.id} has incomplete data structure - Edit form will be completely blank!`);
      }
    });

    setIssues(foundIssues);
    console.log('🔍 Analysis complete - Found', foundIssues.length, 'issues');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
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

  const renderStorageStatus = () => (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        <span className="font-medium">Administrator Storage</span>
      </div>
      <div className="flex items-center gap-2">
        {storageHealth?.storage.exists ? (
          <>
            <Badge variant={storageHealth.storage.valid ? "default" : "destructive"}>
              {storageHealth.storage.count} records
            </Badge>
            {storageHealth.storage.valid ? (
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

  const renderAdminData = (admin: AdminData, index: number) => {
    // Comprehensive field checking with debugging
    const name = admin.name || admin.adminName || `Admin ${index + 1}`;
    const email = admin.email || admin.adminEmail || 'Missing';
    const userId = admin.userId || admin.adminId || 'Missing';
    const contact = admin.contactNumber || 'Missing';
    const seekerId = admin.sourceSeekerId || 'Missing';
    const orgName = admin.organizationName || 'Missing';
    
    console.log(`🔍 Rendering Admin ${index + 1}:`, {
      name, email, userId, contact, seekerId, orgName,
      rawAdmin: admin
    });
    
    return (
      <div key={index} className="p-3 border rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm">{name}</span>
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs">
              Unified Storage
            </Badge>
            {Object.keys(admin).length <= 3 && (
              <Badge variant="destructive" className="text-xs">
                Incomplete Data
              </Badge>
            )}
          </div>
        </div>
        <div className="space-y-1 text-xs text-gray-600">
          <div><span className="font-medium">Email:</span> <span className={email === 'Missing' ? 'text-red-600' : ''}>{email}</span></div>
          <div><span className="font-medium">User ID:</span> <span className={userId === 'Missing' ? 'text-red-600' : ''}>{userId}</span></div>
          <div><span className="font-medium">Contact:</span> <span className={contact === 'Missing' ? 'text-red-600' : ''}>{contact}</span></div>
          <div><span className="font-medium">Seeker ID:</span> <span className={seekerId === 'Missing' ? 'text-red-600' : ''}>{seekerId}</span></div>
          <div><span className="font-medium">Organization:</span> <span className={orgName === 'Missing' ? 'text-red-600' : ''}>{orgName}</span></div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium">Available Fields:</span> {Object.keys(admin).join(', ')}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Key className="h-6 w-6" />
            Admin Creation Diagnostic
          </h1>
          <p className="text-gray-600 mt-1">
            Unified administrator storage analysis and troubleshooting
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
              {renderStorageStatus()}
              
              <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Total Administrators</span>
                </div>
                <Badge variant="default">{storageHealth.totalCount} total</Badge>
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

      {/* Recovery Solution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Data Recovery & Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {issues.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">🚨 Critical Issues Detected:</h4>
              <p className="text-sm text-red-700 mb-3">
                Administrator data is corrupted or incomplete. This is why the Edit Administrator dialog shows blank fields.
              </p>
              <div className="text-sm text-red-700 space-y-1">
                <p><strong>Root Cause:</strong> Password encryption process corrupted the data structure</p>
                <p><strong>Impact:</strong> Edit forms show blank fields because essential data is missing</p>
                <p><strong>Solution:</strong> Use the Data Recovery Tool to reconstruct complete administrator records</p>
              </div>
            </div>
          )}
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">🔧 Recovery Options:</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• <strong>Automatic Recovery:</strong> Reconstruct missing data from seeker records</li>
              <li>• <strong>Data Validation:</strong> Verify and fix corrupted administrator records</li>
              <li>• <strong>Prevention:</strong> Implement data integrity checks for future operations</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Administrator Data View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Administrator Data ({admins.length} total)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowRawData(!showRawData)} 
              variant="outline" 
              size="sm"
            >
              {showRawData ? 'Hide' : 'Show'} Administrator Details
            </Button>
            <Info className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              View stored administrator data from unified storage
            </span>
          </div>

          {showRawData && (
            <>
              {admins.length > 0 ? (
                <div>
                  <h4 className="font-medium mb-3">Administrators ({admins.length})</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {admins.map((admin, index) => renderAdminData(admin, index))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No administrators found in storage</p>
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