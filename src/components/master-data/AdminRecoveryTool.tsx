import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  RefreshCw, 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  Shield,
  Activity,
  Wrench
} from 'lucide-react';
import { AdminDataRecoveryService } from '@/utils/AdminDataRecoveryService';
import { useToast } from "@/hooks/use-toast";

interface RecoveryStatus {
  totalCount: number;
  completeCount: number;
  incompleteCount: number;
  healthPercentage: number;
  issues: string[];
}

const AdminRecoveryTool: React.FC = () => {
  const [recoveryStatus, setRecoveryStatus] = useState<RecoveryStatus | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [lastRecovery, setLastRecovery] = useState<string>('');
  const [recoveryResult, setRecoveryResult] = useState<any>(null);
  const { toast } = useToast();

  const loadHealthStatus = () => {
    console.log('🏥 Loading administrator data health status...');
    const status = AdminDataRecoveryService.getDataHealthStatus();
    setRecoveryStatus(status);
    console.log('📊 Health status:', status);
  };

  const performRecovery = async () => {
    setIsRecovering(true);
    setRecoveryResult(null);
    
    try {
      console.log('🔧 Starting comprehensive administrator data recovery...');
      
      toast({
        title: "Recovery Started",
        description: "Analyzing and recovering administrator data. This may take a moment...",
      });

      const result = await AdminDataRecoveryService.performCompleteRecovery();
      
      console.log('📊 Recovery result:', result);
      setRecoveryResult(result);
      setLastRecovery(new Date().toLocaleString());
      
      // Refresh health status
      loadHealthStatus();
      
      if (result.success) {
        toast({
          title: "✅ Recovery Completed",
          description: result.summary,
        });
      } else {
        toast({
          title: "⚠️ Recovery Issues",
          description: `Recovery completed with ${result.errors.length} errors. Check the results for details.`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('❌ Recovery failed:', error);
      toast({
        title: "Recovery Failed",
        description: `Recovery process failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsRecovering(false);
    }
  };

  useEffect(() => {
    loadHealthStatus();
  }, []);

  const getHealthColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBadge = (percentage: number) => {
    if (percentage >= 80) return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
    if (percentage >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Needs Attention</Badge>;
    return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-600" />
            Administrator Data Recovery Tool
            <Button
              variant="outline"
              size="sm"
              onClick={loadHealthStatus}
              disabled={isRecovering}
              className="ml-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRecovering ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Health Status Overview */}
          {recoveryStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Data Health Status</h3>
                  {getHealthBadge(recoveryStatus.healthPercentage)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Health Score</span>
                    <span className={`font-medium ${getHealthColor(recoveryStatus.healthPercentage)}`}>
                      {recoveryStatus.healthPercentage}%
                    </span>
                  </div>
                  <Progress value={recoveryStatus.healthPercentage} className="h-2" />
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Administrator Records</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Records</span>
                    <Badge variant="outline">{recoveryStatus.totalCount}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Complete Records</span>
                    <Badge className="bg-green-100 text-green-800">{recoveryStatus.completeCount}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Incomplete Records</span>
                    <Badge variant={recoveryStatus.incompleteCount > 0 ? "destructive" : "secondary"}>
                      {recoveryStatus.incompleteCount}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Issues Detection */}
          {recoveryStatus && recoveryStatus.issues.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Data Issues Detected:</div>
                <ul className="list-disc list-inside space-y-1">
                  {recoveryStatus.issues.map((issue, index) => (
                    <li key={index} className="text-sm">{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Recovery Action */}
          <div className="p-4 rounded-lg border bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-amber-900">Data Recovery</h3>
            </div>
            <p className="text-sm text-amber-700 mb-4">
              The recovery process will analyze existing administrator data, reconstruct incomplete records 
              using seeker information, and recover data from legacy storage sources.
            </p>
            <Button 
              onClick={performRecovery} 
              disabled={isRecovering}
              className="w-full"
            >
              {isRecovering ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Recovering Data...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Start Data Recovery
                </>
              )}
            </Button>
          </div>

          {/* Recovery Results */}
          {recoveryResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  {recoveryResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  Recovery Results
                  {lastRecovery && (
                    <span className="text-xs text-gray-500 font-normal ml-auto">
                      {lastRecovery}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded bg-gray-50">
                  <p className="text-sm text-gray-700">{recoveryResult.summary}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Records Recovered:</span>
                    <Badge className="ml-2 bg-blue-100 text-blue-800">
                      {recoveryResult.recoveredCount}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Records Repaired:</span>
                    <Badge className="ml-2 bg-green-100 text-green-800">
                      {recoveryResult.repairedCount}
                    </Badge>
                  </div>
                </div>

                {recoveryResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-800">Errors Encountered:</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {recoveryResult.errors.map((error: string, index: number) => (
                        <div key={index} className="text-xs text-red-700 p-2 bg-red-50 rounded">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
            <h4 className="font-medium text-blue-900 mb-2">How Recovery Works:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Analyzes existing administrator data for completeness</li>
              <li>Reconstructs incomplete records using seeker information</li>
              <li>Recovers administrator data from legacy storage locations</li>
              <li>Removes duplicate entries and validates data integrity</li>
              <li>Saves the recovered data to unified storage</li>
              <li>Provides verification and health status updates</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRecoveryTool;