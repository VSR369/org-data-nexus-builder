import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  User, 
  Clock, 
  Database, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useAuthSession } from '@/hooks/useAuthSession';
import { clearAllAuthData } from '@/utils/authUtils';

const AuthDebugPanel: React.FC = () => {
  const { session, authenticated, getHealthStatus, refreshSession } = useAuthSession();
  const [healthData, setHealthData] = useState<any>(null);

  const checkHealth = () => {
    console.log('🔍 AUTH DEBUG - Checking authentication health...');
    const health = getHealthStatus();
    setHealthData(health);
    console.log('📊 AUTH DEBUG - Health data:', health);
  };

  const clearAuth = () => {
    console.log('🗑️ AUTH DEBUG - Clearing all authentication data...');
    clearAllAuthData();
    refreshSession();
    setHealthData(null);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Authentication Debug Panel
        </CardTitle>
        <div className="flex gap-2">
          <Button onClick={checkHealth} size="sm" variant="outline">
            <Database className="h-4 w-4 mr-2" />
            Check Health
          </Button>
          <Button onClick={refreshSession} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Session
          </Button>
          <Button onClick={clearAuth} size="sm" variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Auth Data
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Authentication Status */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Authentication Status
          </h3>
          <div className="flex items-center gap-2 mb-2">
            {authenticated ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Authenticated
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                Not Authenticated
              </Badge>
            )}
          </div>
        </div>

        {/* Current Session */}
        {session && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Current Session
            </h3>
            <div className="bg-gray-50 p-3 rounded space-y-2">
              <div><strong>Organization:</strong> {session.organizationName}</div>
              <div><strong>Email:</strong> {session.email}</div>
              <div><strong>User ID:</strong> {session.userId}</div>
              <div><strong>Login Time:</strong> {new Date(session.loginTime).toLocaleString()}</div>
              <div><strong>Expiry Time:</strong> {new Date(session.expiryTime).toLocaleString()}</div>
              <div><strong>Session Token:</strong> {session.sessionToken.substring(0, 20)}...</div>
            </div>
          </div>
        )}

        {/* Health Data */}
        {healthData && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Service Health
            </h3>
            <div className="bg-gray-50 p-3 rounded space-y-2">
              <div><strong>Organizations Count:</strong> {healthData.organizationsCount}</div>
              <div><strong>Has Active Session:</strong> {healthData.hasActiveSession ? 'Yes' : 'No'}</div>
              <div><strong>Has Remember Me Data:</strong> {healthData.hasRememberMeData ? 'Yes' : 'No'}</div>
              <div><strong>Session Expiry Hours:</strong> {healthData.config.sessionExpiryHours}</div>
              <div><strong>Remember Me Days:</strong> {healthData.config.rememberMeDays}</div>
              {healthData.sessionExpiry && (
                <div><strong>Current Session Expires:</strong> {new Date(healthData.sessionExpiry).toLocaleString()}</div>
              )}
            </div>
          </div>
        )}

        {/* Storage Keys */}
        <div>
          <h3 className="font-semibold mb-3">Storage Keys</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">registered_users</Badge>
            <Badge variant="outline">current_seeking_org_session</Badge>
            <Badge variant="outline">seeking_org_remember_me</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDebugPanel;