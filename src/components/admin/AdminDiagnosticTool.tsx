import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Users, 
  Shield,
  Activity,
  AlertTriangle,
  Info
} from 'lucide-react';
import { administratorStorageService, Administrator } from '@/services/AdministratorStorageService';

interface HealthStatus {
  healthy: boolean;
  adminCount: number;
  indexedDBWorking: boolean;
  localStorageWorking: boolean;
  sessionExists: boolean;
  error?: string;
}

const AdminDiagnosticTool: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const runDiagnostics = async () => {
    setIsLoading(true);
    console.log('🔍 === ADMIN DIAGNOSTIC TOOL START ===');

    try {
      // Get health status
      const health = await administratorStorageService.getAdminHealthStatus();
      setHealthStatus(health);
      console.log('🏥 Health status:', health);

      // Get all administrators
      const admins = await administratorStorageService.getAllAdministrators();
      setAdministrators(admins);
      console.log('👥 All administrators:', admins.length);

      // Get current session
      const session = await administratorStorageService.loadSession();
      setCurrentSession(session);
      console.log('📱 Current session:', session ? 'Active' : 'None');

      setLastUpdated(new Date().toLocaleString());
      console.log('✅ Diagnostics completed successfully');

    } catch (error) {
      console.error('❌ Diagnostics failed:', error);
    } finally {
      setIsLoading(false);
      console.log('🔍 === ADMIN DIAGNOSTIC TOOL END ===');
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (status: boolean, trueText: string, falseText: string) => {
    return (
      <Badge variant={status ? "default" : "destructive"} className="ml-2">
        {status ? trueText : falseText}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Administrator System Diagnostics
            <Button
              variant="outline"
              size="sm"
              onClick={runDiagnostics}
              disabled={isLoading}
              className="ml-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Running...' : 'Refresh'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {healthStatus && (
            <>
              {/* Overall Health Status */}
              <div className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">System Health</h3>
                  {getStatusBadge(healthStatus.healthy, 'Healthy', 'Issues Detected')}
                </div>
                <p className="text-sm text-blue-700">
                  {healthStatus.healthy 
                    ? 'All administrator systems are functioning properly'
                    : 'Administrator system has detected issues that need attention'
                  }
                </p>
                {healthStatus.error && (
                  <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-700">{healthStatus.error}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Storage Systems */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Storage Systems</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>IndexedDB</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(healthStatus.indexedDBWorking)}
                        <span className={healthStatus.indexedDBWorking ? 'text-green-600' : 'text-red-600'}>
                          {healthStatus.indexedDBWorking ? 'Working' : 'Failed'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>LocalStorage</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(healthStatus.localStorageWorking)}
                        <span className={healthStatus.localStorageWorking ? 'text-green-600' : 'text-red-600'}>
                          {healthStatus.localStorageWorking ? 'Working' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Administrator Data</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Total Administrators</span>
                      <Badge variant="outline">
                        {healthStatus.adminCount}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Active Session</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(healthStatus.sessionExists)}
                        <span className={healthStatus.sessionExists ? 'text-green-600' : 'text-gray-600'}>
                          {healthStatus.sessionExists ? 'Active' : 'None'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Current Session Info */}
          {currentSession && (
            <div className="p-4 rounded-lg border bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold text-green-900">Active Administrator Session</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Admin ID:</strong> {currentSession.adminId}</p>
                  <p><strong>Name:</strong> {currentSession.adminName}</p>
                  <p><strong>Email:</strong> {currentSession.adminEmail}</p>
                </div>
                <div>
                  <p><strong>Organization:</strong> {currentSession.organizationName}</p>
                  <p><strong>Role:</strong> {currentSession.role}</p>
                  <p><strong>Login Time:</strong> {new Date(currentSession.loginTimestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Administrators List */}
          {administrators.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Registered Administrators ({administrators.length})
              </h3>
              <div className="space-y-2">
                {administrators.map((admin, index) => (
                  <div key={admin.id} className="p-3 rounded-lg border bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{admin.adminName}</span>
                          <Badge variant={admin.isActive ? "default" : "secondary"}>
                            {admin.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline">{admin.role}</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>ID: {admin.adminId} | Email: {admin.adminEmail}</p>
                          <p>Organization: {admin.organizationName}</p>
                          <p>Created: {new Date(admin.createdAt).toLocaleDateString()}</p>
                          {admin.lastLoginAt && (
                            <p>Last Login: {new Date(admin.lastLoginAt).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Administrators Message */}
          {healthStatus && healthStatus.adminCount === 0 && (
            <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">No Administrators Found</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                No administrators are currently registered in the system. Register your first administrator to get started.
              </p>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-xs text-gray-500 text-center pt-2 border-t">
              Last updated: {lastUpdated}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDiagnosticTool;