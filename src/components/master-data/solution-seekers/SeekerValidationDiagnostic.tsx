import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Users, 
  Database,
  Settings,
  Search,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import { EngagementValidator } from '@/utils/engagementValidator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DiagnosticResult {
  category: string;
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  details?: any;
  count?: number;
}

const SeekerValidationDiagnostic: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [rawUserData, setRawUserData] = useState<any[]>([]);
  const [engagementData, setEngagementData] = useState<any>(null);

  const runDiagnostics = async () => {
    setLoading(true);
    const results: DiagnosticResult[] = [];
    
    try {
      console.log('🔍 Starting Solution Seekers Validation Diagnostics...');
      
      // 1. Check if unified user storage service is working
      try {
        await unifiedUserStorageService.initialize();
        results.push({
          category: 'System',
          status: 'success',
          message: 'Unified User Storage Service initialized successfully'
        });
      } catch (error) {
        results.push({
          category: 'System',
          status: 'error',
          message: `Failed to initialize user storage: ${error}`
        });
      }

      // 2. Check total users in system
      let allUsers: any[] = [];
      try {
        allUsers = await unifiedUserStorageService.getAllUsers();
        setRawUserData(allUsers);
        results.push({
          category: 'Data',
          status: allUsers.length > 0 ? 'success' : 'warning',
          message: `Total users found in system: ${allUsers.length}`,
          count: allUsers.length,
          details: allUsers.length === 0 ? 'No users registered in the system. This could be why no seekers are showing.' : null
        });
      } catch (error) {
        results.push({
          category: 'Data',
          status: 'error',
          message: `Failed to load users: ${error}`
        });
      }

      // 3. Check for solution seekers specifically
      if (allUsers.length > 0) {
        const solutionSeekers = allUsers.filter(user => {
          const isSolutionSeeker = user.entityType?.toLowerCase().includes('solution') ||
                                 user.entityType?.toLowerCase().includes('seeker') ||
                                 user.entityType === 'solution-seeker' ||
                                 user.entityType === 'Solution Seeker';
          
          const isOrgSeeker = user.organizationType?.toLowerCase().includes('seeker');
          
          return isSolutionSeeker || isOrgSeeker;
        });

        results.push({
          category: 'Filtering',
          status: solutionSeekers.length > 0 ? 'success' : 'warning',
          message: `Solution seekers identified: ${solutionSeekers.length}`,
          count: solutionSeekers.length,
          details: solutionSeekers.length === 0 ? 
            'No users have entity type containing "solution" or "seeker", or organization type containing "seeker"' : 
            solutionSeekers.map(s => ({
              name: s.organizationName,
              entityType: s.entityType,
              organizationType: s.organizationType,
              userId: s.userId
            }))
        });

        // 4. Check engagement validation for each seeker
        if (solutionSeekers.length > 0) {
          const engagementResults = solutionSeekers.map(seeker => {
            const validation = EngagementValidator.validateSeekerEngagement(
              seeker.id, seeker.organizationId, seeker.organizationName
            );
            return {
              seeker: seeker.organizationName,
              hasEngagement: validation.hasEngagementModel,
              hasPricing: validation.hasPricing,
              isValid: validation.isValid,
              missingDetails: validation.missingDetails
            };
          });

          const seekersWithEngagement = engagementResults.filter(r => r.hasEngagement);
          const seekersWithoutEngagement = engagementResults.filter(r => !r.hasEngagement);

          results.push({
            category: 'Engagement',
            status: seekersWithEngagement.length > 0 ? 'success' : 'warning',
            message: `Seekers with engagement details: ${seekersWithEngagement.length}`,
            count: seekersWithEngagement.length,
            details: engagementResults
          });

          if (seekersWithoutEngagement.length > 0) {
            results.push({
              category: 'Engagement',
              status: 'warning',
              message: `Seekers without engagement details: ${seekersWithoutEngagement.length}`,
              count: seekersWithoutEngagement.length,
              details: seekersWithoutEngagement.map(s => ({
                name: s.seeker,
                missing: s.missingDetails
              }))
            });
          }
        }

        // 5. Show entity and organization type breakdown
        const entityTypes = allUsers.reduce((acc: any, user) => {
          const type = user.entityType || 'Unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const orgTypes = allUsers.reduce((acc: any, user) => {
          const type = user.organizationType || 'Unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        results.push({
          category: 'Analysis',
          status: 'info',
          message: 'Entity type breakdown',
          details: entityTypes
        });

        results.push({
          category: 'Analysis',
          status: 'info',
          message: 'Organization type breakdown',
          details: orgTypes
        });
      }

      // 6. Check engagement model data in localStorage
      const engagementKeys = [
        'engagement_model_selection',
        'selected_engagement_model',
        'current_engagement_model',
        'global_engagement_config'
      ];

      let foundEngagementData = null;
      for (const key of engagementKeys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            foundEngagementData = { key, data: parsed };
            break;
          } catch (e) {
            // Continue checking
          }
        }
      }

      if (foundEngagementData) {
        setEngagementData(foundEngagementData);
        results.push({
          category: 'Engagement Storage',
          status: 'success',
          message: `Engagement data found in localStorage (${foundEngagementData.key})`,
          details: foundEngagementData.data
        });
      } else {
        results.push({
          category: 'Engagement Storage',
          status: 'warning',
          message: 'No engagement model data found in localStorage',
          details: 'This may be why solution seekers cannot be approved/rejected. The solution seeking organization needs to login and select an engagement model first.'
        });
      }

      // 7. Check global engagement validation
      const globalValidation = EngagementValidator.validateGlobalEngagement();
      results.push({
        category: 'Global Engagement',
        status: globalValidation.isValid ? 'success' : 'warning',
        message: globalValidation.isValid ? 'Global engagement validation passed' : 'Global engagement validation failed',
        details: {
          isValid: globalValidation.isValid,
          missingDetails: globalValidation.missingDetails,
          message: EngagementValidator.getValidationMessage(globalValidation)
        }
      });

      // 8. Check localStorage size and health
      try {
        const storageInfo = {
          totalKeys: Object.keys(localStorage).length,
          keysWithData: Object.keys(localStorage).filter(key => localStorage.getItem(key)).length,
          estimatedSize: JSON.stringify(localStorage).length
        };

        results.push({
          category: 'Storage Health',
          status: 'info',
          message: `localStorage contains ${storageInfo.totalKeys} keys, ~${Math.round(storageInfo.estimatedSize / 1024)}KB`,
          details: storageInfo
        });
      } catch (error) {
        results.push({
          category: 'Storage Health',
          status: 'error',
          message: `localStorage access error: ${error}`
        });
      }

    } catch (error) {
      results.push({
        category: 'System',
        status: 'error',
        message: `Diagnostic error: ${error}`
      });
    }

    setDiagnostics(results);
    setLoading(false);
    console.log('✅ Diagnostics completed:', results);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Solution Seekers Validation Diagnostics
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={runDiagnostics} disabled={loading} size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Running...' : 'Re-run Diagnostics'}
            </Button>
            <Button 
              onClick={() => setShowRawData(!showRawData)} 
              variant="outline" 
              size="sm"
            >
              {showRawData ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showRawData ? 'Hide' : 'Show'} Raw Data
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {diagnostics.map((result, index) => (
            <Alert key={index} className={getStatusColor(result.status)}>
              <div className="flex items-start gap-3">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{result.category}</Badge>
                    {result.count !== undefined && (
                      <Badge variant="secondary">{result.count}</Badge>
                    )}
                  </div>
                  <AlertDescription className="mb-2">
                    {result.message}
                  </AlertDescription>
                  {result.details && (
                    <Collapsible>
                      <CollapsibleTrigger className="text-sm text-blue-600 hover:text-blue-800">
                        View Details
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                          {typeof result.details === 'string' ? 
                            result.details : 
                            JSON.stringify(result.details, null, 2)
                          }
                        </pre>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              </div>
            </Alert>
          ))}

          {showRawData && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Raw Data Inspection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">All Users ({rawUserData.length})</h4>
                  <pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto max-h-40">
                    {JSON.stringify(rawUserData, null, 2)}
                  </pre>
                </div>
                
                {engagementData && (
                  <div>
                    <h4 className="font-medium mb-2">Engagement Data</h4>
                    <pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto max-h-40">
                      {JSON.stringify(engagementData, null, 2)}
                    </pre>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">localStorage Keys</h4>
                  <div className="text-xs bg-gray-50 p-3 rounded border max-h-40 overflow-auto">
                    {Object.keys(localStorage).map(key => (
                      <div key={key} className="mb-1">
                        <strong>{key}:</strong> {localStorage.getItem(key)?.substring(0, 100)}
                        {localStorage.getItem(key)?.length && localStorage.getItem(key)!.length > 100 ? '...' : ''}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SeekerValidationDiagnostic;