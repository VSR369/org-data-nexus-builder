// Enhanced Master Data Diagnostics with Transition Support
// Handles both raw and wrapped data formats during the migration period

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Wrench,
  Database
} from 'lucide-react';

interface EnhancedDataKeyInfo {
  key: string;
  exists: boolean;
  format: 'raw' | 'wrapped' | 'invalid' | 'missing';
  isValid: boolean;
  itemCount: number;
  issues: string[];
  canAutoFix: boolean;
  needsMigration: boolean;
}

interface EnhancedDiagnosticReport {
  totalKeys: number;
  healthyKeys: number;
  issueKeys: number;
  missingKeys: number;
  keysNeedingMigration: number;
  masterDataKeys: EnhancedDataKeyInfo[];
  lastChecked: string;
}

const MASTER_DATA_KEYS = [
  'master_data_currencies',
  'master_data_seeker_membership_fees',
  'master_data_countries',
  'master_data_organization_types',
  'master_data_entity_types',
  'master_data_departments',
  'master_data_industry_segments',
  'master_data_domain_groups',
  'master_data_competency_capabilities',
  'master_data_engagement_models',
  'master_data_pricing_configs',
  'master_data_challenge_statuses',
  'master_data_solution_statuses',
  'master_data_reward_types',
  'master_data_communication_types'
];

export const DiagnosticEnhancedTool: React.FC = () => {
  const [report, setReport] = useState<EnhancedDiagnosticReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

  const analyzeKey = (key: string): EnhancedDataKeyInfo => {
    const rawValue = localStorage.getItem(key);
    const keyInfo: EnhancedDataKeyInfo = {
      key,
      exists: rawValue !== null,
      format: 'missing',
      isValid: false,
      itemCount: 0,
      issues: [],
      canAutoFix: true,
      needsMigration: false
    };

    if (!rawValue) {
      keyInfo.format = 'missing';
      keyInfo.issues.push('Key does not exist');
      return keyInfo;
    }

    try {
      const parsed = JSON.parse(rawValue);
      
      // Check for wrapped format (from MasterDataPersistenceManager)
      if (parsed && typeof parsed === 'object' && (parsed.data || parsed.version)) {
        keyInfo.format = 'wrapped';
        keyInfo.needsMigration = true;
        keyInfo.issues.push('Data is in wrapped format - needs migration to raw format');
        
        if (parsed.data && Array.isArray(parsed.data)) {
          keyInfo.itemCount = parsed.data.length;
          keyInfo.isValid = parsed.data.length > 0;
        } else {
          keyInfo.issues.push('Wrapped data is invalid or empty');
        }
        return keyInfo;
      }
      
      // Check for raw array format (preferred)
      if (Array.isArray(parsed)) {
        keyInfo.format = 'raw';
        keyInfo.itemCount = parsed.length;
        keyInfo.isValid = parsed.length > 0;
        
        if (parsed.length === 0) {
          keyInfo.issues.push('Array is empty');
        } else {
          // Basic validation
          const isValidArray = parsed.every(item => 
            typeof item === 'object' && item !== null || typeof item === 'string'
          );
          if (!isValidArray) {
            keyInfo.issues.push('Array contains invalid items');
            keyInfo.isValid = false;
          }
        }
        return keyInfo;
      }
      
      // Other object formats
      keyInfo.format = 'invalid';
      keyInfo.issues.push('Unrecognized data format');
      keyInfo.isValid = false;
      
    } catch (error) {
      keyInfo.format = 'invalid';
      keyInfo.issues.push(`JSON parse error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }

    return keyInfo;
  };

  const runDiagnostics = () => {
    console.log('🔍 === ENHANCED MASTER DATA DIAGNOSTICS START ===');
    setIsRunning(true);

    try {
      const newReport: EnhancedDiagnosticReport = {
        totalKeys: MASTER_DATA_KEYS.length,
        healthyKeys: 0,
        issueKeys: 0,
        missingKeys: 0,
        keysNeedingMigration: 0,
        masterDataKeys: [],
        lastChecked: new Date().toISOString()
      };

      MASTER_DATA_KEYS.forEach(key => {
        const keyInfo = analyzeKey(key);
        newReport.masterDataKeys.push(keyInfo);
        
        if (!keyInfo.exists) {
          newReport.missingKeys++;
        } else if (keyInfo.isValid && keyInfo.format === 'raw') {
          newReport.healthyKeys++;
        } else {
          newReport.issueKeys++;
        }
        
        if (keyInfo.needsMigration) {
          newReport.keysNeedingMigration++;
        }
      });

      setReport(newReport);
      console.log('🔍 === ENHANCED DIAGNOSTICS COMPLETE ===', newReport);

    } catch (error) {
      console.error('❌ Enhanced diagnostics error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAutoFix = async () => {
    console.log('🔧 === RUNNING AUTO-FIX ===');
    setIsFixing(true);

    try {
      // Use the new unified structure fixer
      const { MasterDataStructureFixer } = await import('@/utils/masterDataStructureFixer');
      const fixResult = MasterDataStructureFixer.fixAllMasterDataStructures();
      
      console.log('🔧 Auto-fix complete:', {
        fixed: fixResult.totalKeysFixed,
        total: fixResult.totalKeysChecked,
        errors: fixResult.errors.length
      });

      // Re-run diagnostics to show results
      setTimeout(runDiagnostics, 500);
      
    } catch (error) {
      console.error('❌ Auto-fix error:', error);
    } finally {
      setIsFixing(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (keyInfo: EnhancedDataKeyInfo) => {
    if (!keyInfo.exists) return <XCircle className="h-4 w-4 text-destructive" />;
    if (keyInfo.isValid && keyInfo.format === 'raw') return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
  };

  const getFormatBadge = (format: string, needsMigration: boolean) => {
    if (format === 'raw') return <Badge variant="default">Raw</Badge>;
    if (format === 'wrapped') return <Badge variant="secondary">Wrapped {needsMigration && '→ Migrate'}</Badge>;
    if (format === 'missing') return <Badge variant="destructive">Missing</Badge>;
    return <Badge variant="outline">Invalid</Badge>;
  };

  if (!report) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Running enhanced diagnostics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Master Data Diagnostics</h2>
          <p className="text-muted-foreground">
            Transition-aware diagnostics with auto-migration support
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runDiagnostics} disabled={isRunning}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Scanning...' : 'Scan'}
          </Button>
          <Button onClick={runAutoFix} disabled={isFixing} variant="outline">
            <Wrench className={`h-4 w-4 mr-2 ${isFixing ? 'animate-spin' : ''}`} />
            {isFixing ? 'Fixing...' : 'Auto-Fix'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{report.totalKeys}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Healthy</p>
                <p className="text-2xl font-bold text-green-600">{report.healthyKeys}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Issues</p>
                <p className="text-2xl font-bold text-yellow-600">{report.issueKeys}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium">Missing</p>
                <p className="text-2xl font-bold text-destructive">{report.missingKeys}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Need Migration</p>
                <p className="text-2xl font-bold text-blue-600">{report.keysNeedingMigration}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Migration Alert */}
      {report.keysNeedingMigration > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{report.keysNeedingMigration} keys</strong> are in wrapped format and need migration to raw format. 
            Click "Auto-Fix" to migrate them automatically.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.masterDataKeys.map((keyInfo) => (
              <div key={keyInfo.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(keyInfo)}
                  <div>
                    <p className="font-medium">{keyInfo.key}</p>
                    <p className="text-sm text-muted-foreground">
                      {keyInfo.itemCount} items
                      {keyInfo.issues.length > 0 && ` • ${keyInfo.issues[0]}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getFormatBadge(keyInfo.format, keyInfo.needsMigration)}
                  {keyInfo.canAutoFix && keyInfo.issues.length > 0 && (
                    <Badge variant="outline" className="text-xs">Auto-fixable</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticEnhancedTool;
