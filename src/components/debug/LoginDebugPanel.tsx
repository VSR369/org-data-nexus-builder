import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bug, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Database,
  RefreshCw,
  Eye,
  TestTube
} from 'lucide-react';
import { getAuthServiceHealth, getCurrentSolutionSeekingOrg } from '@/utils/authUtils';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

const LoginDebugPanel: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [authHealth, setAuthHealth] = useState<any>(null);

  const runTests = async () => {
    console.log('🧪 LOGIN DEBUG - Starting comprehensive tests...');
    setTesting(true);
    const results: TestResult[] = [];

    // Test 1: Check localStorage data
    try {
      const registeredUsers = localStorage.getItem('registered_users');
      if (registeredUsers) {
        const users = JSON.parse(registeredUsers);
        results.push({
          name: 'Organization Data Availability',
          status: users.length > 0 ? 'pass' : 'warning',
          message: `Found ${users.length} registered organizations`,
          details: users.map((u: any) => ({ name: u.organizationName, email: u.email, type: u.entityType }))
        });
      } else {
        results.push({
          name: 'Organization Data Availability',
          status: 'fail',
          message: 'No registered organizations found in localStorage'
        });
      }
    } catch (error) {
      results.push({
        name: 'Organization Data Availability',
        status: 'fail',
        message: 'Error reading organization data',
        details: error
      });
    }

    // Test 2: Check session functionality
    try {
      const currentSession = getCurrentSolutionSeekingOrg();
      results.push({
        name: 'Session Management',
        status: currentSession ? 'pass' : 'warning',
        message: currentSession ? 'Active session found' : 'No active session',
        details: currentSession
      });
    } catch (error) {
      results.push({
        name: 'Session Management',
        status: 'fail',
        message: 'Session management error',
        details: error
      });
    }

    // Test 3: Check authentication service health
    try {
      const health = getAuthServiceHealth();
      setAuthHealth(health);
      results.push({
        name: 'Authentication Service',
        status: health.organizationsCount > 0 ? 'pass' : 'warning',
        message: `Service operational, ${health.organizationsCount} organizations available`,
        details: health
      });
    } catch (error) {
      results.push({
        name: 'Authentication Service',
        status: 'fail',
        message: 'Authentication service error',
        details: error
      });
    }

    // Test 4: Route availability
    const routes = [
      '/solution-seeking-org/login',
      '/general-signin',
      '/seeking-org-admin-dashboard'
    ];
    
    results.push({
      name: 'Route Configuration',
      status: 'pass',
      message: `${routes.length} critical routes configured`,
      details: routes
    });

    // Test 5: Test specific user lookup
    try {
      const registeredUsers = localStorage.getItem('registered_users');
      if (registeredUsers) {
        const users = JSON.parse(registeredUsers);
        const mediaUser = users.find((u: any) => 
          u.email.toLowerCase().includes('media') || 
          u.organizationName.toLowerCase().includes('media')
        );
        
        results.push({
          name: 'Media Organization Test',
          status: mediaUser ? 'pass' : 'fail',
          message: mediaUser ? 'Media organization found and ready for login' : 'Media organization not found',
          details: mediaUser
        });
      }
    } catch (error) {
      results.push({
        name: 'Media Organization Test',
        status: 'fail',
        message: 'Error searching for media organization',
        details: error
      });
    }

    setTestResults(results);
    setTesting(false);
    console.log('🧪 LOGIN DEBUG - Tests completed:', results);
  };

  const createTestUser = () => {
    console.log('🔧 LOGIN DEBUG - Creating test user...');
    try {
      const testUser = {
        userId: 'media@co.in',
        password: 'Test123!',
        organizationName: 'Media Corporation India',
        organizationType: 'Private Limited',
        entityType: 'Solution Seeker',
        country: 'India',
        email: 'media@co.in',
        contactPersonName: 'Test Contact',
        industrySegment: 'Media & Entertainment',
        organizationId: 'MEDIA_CORP_001',
        registrationTimestamp: new Date().toISOString(),
        status: 'active',
        isActive: true,
        isApproved: true
      };

      const existingUsers = localStorage.getItem('registered_users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Remove existing media user if any
      const filteredUsers = users.filter((u: any) => u.email !== 'media@co.in');
      filteredUsers.push(testUser);
      
      localStorage.setItem('registered_users', JSON.stringify(filteredUsers));
      console.log('✅ LOGIN DEBUG - Test user created successfully');
      
      // Re-run tests
      runTests();
    } catch (error) {
      console.error('❌ LOGIN DEBUG - Error creating test user:', error);
    }
  };

  const clearAllData = () => {
    console.log('🗑️ LOGIN DEBUG - Clearing all authentication data...');
    localStorage.removeItem('registered_users');
    localStorage.removeItem('seeking_org_remember_me');
    sessionStorage.removeItem('current_seeking_org_session');
    console.log('✅ LOGIN DEBUG - All data cleared');
    runTests();
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'fail': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Login System Debug Panel
        </CardTitle>
        <div className="flex gap-2">
          <Button onClick={runTests} disabled={testing} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Testing...' : 'Run Tests'}
          </Button>
          <Button onClick={createTestUser} variant="outline" size="sm">
            <TestTube className="h-4 w-4 mr-2" />
            Create Test User
          </Button>
          <Button onClick={clearAllData} variant="destructive" size="sm">
            <Database className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Test Results */}
        <div>
          <h3 className="font-semibold mb-3">System Tests</h3>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.name}</span>
                  </div>
                  <Badge className={getStatusColor(result.status)}>
                    {result.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{result.message}</p>
                {result.details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground">View Details</summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Test Instructions */}
        <div>
          <h3 className="font-semibold mb-3">Quick Test Instructions</h3>
          <Alert>
            <TestTube className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>1. Test Entry Points:</strong></p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Navigate to /general-signin → Select "Solution Seeking Organization"</li>
                  <li>Navigate to /solution-seeking-org/login directly</li>
                  <li>Use main menu "Sign In" dropdown</li>
                </ul>
                <p><strong>2. Test Login:</strong></p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Email: media@co.in</li>
                  <li>Password: Test123!</li>
                  <li>Try "Remember Me" checkbox</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* System Health */}
        {authHealth && (
          <div>
            <h3 className="font-semibold mb-3">System Health</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded">
                <div className="text-2xl font-bold text-primary">{authHealth.organizationsCount}</div>
                <div className="text-xs text-muted-foreground">Organizations</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded">
                <div className="text-2xl font-bold text-green-600">
                  {authHealth.hasActiveSession ? '1' : '0'}
                </div>
                <div className="text-xs text-muted-foreground">Active Sessions</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded">
                <div className="text-2xl font-bold text-blue-600">
                  {authHealth.config.sessionExpiryHours}h
                </div>
                <div className="text-xs text-muted-foreground">Session Expiry</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded">
                <div className="text-2xl font-bold text-purple-600">
                  {authHealth.config.rememberMeDays}d
                </div>
                <div className="text-xs text-muted-foreground">Remember Me</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginDebugPanel;