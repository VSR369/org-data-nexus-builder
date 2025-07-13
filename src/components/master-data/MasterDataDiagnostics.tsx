import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Database,
  FileText,
  Users,
  Building,
  Globe
} from 'lucide-react';
// MembershipFeeFixer removed - using Supabase as single source of truth

interface MasterDataKeyInfo {
  key: string;
  category: string;
  exists: boolean;
  isValid: boolean;
  dataType: string;
  size: number;
  itemCount: number;
  expectedStructure: any;
  actualStructure: any;
  issues: string[];
  lastModified?: string;
}

interface SolutionSeekingOrgField {
  field: string;
  required: boolean;
  expectedType: string;
  exists: boolean;
  actualValue: any;
  isValid: boolean;
  issues: string[];
}

interface DiagnosticReport {
  totalKeys: number;
  healthyKeys: number;
  brokenKeys: number;
  missingKeys: number;
  masterDataKeys: MasterDataKeyInfo[];
  solutionSeekingOrgFields: SolutionSeekingOrgField[];
  lastChecked: string;
}

const EXPECTED_MASTER_DATA_KEYS = {
  // Foundation Data
  'master_data_countries': {
    category: 'Foundation',
    expectedStructure: { id: 'string', name: 'string', code: 'string', isUserCreated: 'boolean' },
    requiredFields: ['id', 'name', 'code']
  },
  'master_data_currencies': {
    category: 'Foundation', 
    expectedStructure: { id: 'string', code: 'string', name: 'string', symbol: 'string', isUserCreated: 'boolean' },
    requiredFields: ['id', 'code', 'name', 'symbol']
  },
  'master_data_entity_types': {
    category: 'Foundation',
    expectedStructure: 'string[]',
    requiredFields: []
  },
  'master_data_departments': {
    category: 'Foundation',
    expectedStructure: 'string[]',
    requiredFields: []
  },
  
  // Organization Data
  'master_data_organization_types': {
    category: 'Organization',
    expectedStructure: 'string[]',
    requiredFields: []
  },
  'master_data_industry_segments': {
    category: 'Organization',
    expectedStructure: { industrySegments: 'array' },
    requiredFields: ['industrySegments']
  },
  'master_data_domain_groups': {
    category: 'Organization',
    expectedStructure: { domainGroups: 'array' },
    requiredFields: ['domainGroups']
  },
  'master_data_competency_capabilities': {
    category: 'Organization',
    expectedStructure: 'array',
    requiredFields: []
  },

  // System Data
  'master_data_engagement_models': {
    category: 'System',
    expectedStructure: 'array',
    requiredFields: []
  },
  'master_data_pricing_configs': {
    category: 'System',
    expectedStructure: 'array',
    requiredFields: []
  },
  'master_data_seeker_membership_fees': {
    category: 'System',
    expectedStructure: { 
      id: 'string', 
      country: 'string', 
      organizationType: 'string',
      entityType: 'string',
      quarterlyAmount: 'number',
      quarterlyCurrency: 'string',
      halfYearlyAmount: 'number', 
      halfYearlyCurrency: 'string',
      annualAmount: 'number',
      annualCurrency: 'string',
      createdAt: 'string',
      updatedAt: 'string',
      isUserCreated: 'boolean'
    },
    requiredFields: ['id', 'country', 'organizationType', 'entityType', 'quarterlyAmount', 'quarterlyCurrency']
  },

  // Challenge/Solution Data
  'master_data_challenge_statuses': {
    category: 'Challenge',
    expectedStructure: 'string[]',
    requiredFields: []
  },
  'master_data_solution_statuses': {
    category: 'Challenge',
    expectedStructure: 'string[]',
    requiredFields: []
  },
  'master_data_reward_types': {
    category: 'Challenge',
    expectedStructure: 'string[]',
    requiredFields: []
  },
  'master_data_communication_types': {
    category: 'Challenge',
    expectedStructure: 'string[]',
    requiredFields: []
  }
};

const SOLUTION_SEEKING_ORG_FIELDS = [
  { field: 'userId', required: true, expectedType: 'string' },
  { field: 'password', required: true, expectedType: 'string' },
  { field: 'organizationName', required: true, expectedType: 'string' },
  { field: 'organizationType', required: true, expectedType: 'string' },
  { field: 'entityType', required: true, expectedType: 'string' },
  { field: 'country', required: true, expectedType: 'string' },
  { field: 'email', required: true, expectedType: 'string' },
  { field: 'contactPersonName', required: true, expectedType: 'string' },
  { field: 'industrySegment', required: false, expectedType: 'string' },
  { field: 'organizationId', required: false, expectedType: 'string' },
  { field: 'registrationTimestamp', required: true, expectedType: 'string' }
];

export const MasterDataDiagnostics: React.FC = () => {
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = () => {
    console.log('🔍 === MASTER DATA DIAGNOSTICS START ===');
    setIsRunning(true);

    try {
      console.log('🔍 Creating diagnostic report structure...');
      const report: DiagnosticReport = {
        totalKeys: 0,
        healthyKeys: 0,
        brokenKeys: 0,
        missingKeys: 0,
        masterDataKeys: [],
        solutionSeekingOrgFields: [],
        lastChecked: new Date().toISOString()
      };
      console.log('🔍 Initial report created:', report);

      // Check each expected master data key
      console.log('🔍 Analyzing master data keys...');
      Object.entries(EXPECTED_MASTER_DATA_KEYS).forEach(([key, config]) => {
        console.log(`🔍 Processing key: ${key}`);
        const keyInfo = analyzeMasterDataKey(key, config);
        report.masterDataKeys.push(keyInfo);
        
        if (keyInfo.exists && keyInfo.isValid) {
          report.healthyKeys++;
        } else if (keyInfo.exists && !keyInfo.isValid) {
          report.brokenKeys++;
        } else {
          report.missingKeys++;
        }
      });
      console.log('🔍 Master data keys analysis complete. Keys processed:', report.masterDataKeys.length);

      report.totalKeys = report.masterDataKeys.length;

      // Analyze Solution Seeking Organization fields
      console.log('🔍 Analyzing solution seeking org fields...');
      report.solutionSeekingOrgFields = analyzeSolutionSeekingOrgFields();
      console.log('🔍 Solution seeking org fields analysis complete. Fields processed:', report.solutionSeekingOrgFields.length);

      console.log('🔍 Setting diagnostic report...');
      setDiagnosticReport(report);
      console.log('🔍 === MASTER DATA DIAGNOSTICS COMPLETE ===', report);

    } catch (error) {
      console.error('❌ Diagnostics error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const analyzeMasterDataKey = (key: string, config: any): MasterDataKeyInfo => {
    console.log(`🔍 Analyzing ${key}...`);
    
    // Membership fees now handled by Supabase - no localStorage fixes needed
    if (key === 'master_data_seeker_membership_fees') {
      console.log('ℹ️ Membership fees now managed by Supabase - localStorage diagnostics deprecated');
    }
    
    const rawValue = localStorage.getItem(key);
    const keyInfo: MasterDataKeyInfo = {
      key,
      category: config.category,
      exists: rawValue !== null,
      isValid: false,
      dataType: 'null',
      size: 0,
      itemCount: 0,
      expectedStructure: config.expectedStructure,
      actualStructure: null,
      issues: []
    };

    if (!rawValue) {
      keyInfo.issues.push('Key does not exist in localStorage');
      return keyInfo;
    }

    keyInfo.size = Math.round(new Blob([rawValue]).size / 1024 * 100) / 100;

    try {
      let parsedValue = JSON.parse(rawValue);
      keyInfo.actualStructure = getDataStructure(parsedValue);
      keyInfo.dataType = Array.isArray(parsedValue) ? 'array' : typeof parsedValue;

      if (Array.isArray(parsedValue)) {
        keyInfo.itemCount = parsedValue.length;
      } else if (typeof parsedValue === 'object' && parsedValue !== null) {
        keyInfo.itemCount = Object.keys(parsedValue).length;
      }

      // Validate structure
      const structureValid = validateStructure(parsedValue, config);
      keyInfo.isValid = structureValid.isValid;
      keyInfo.issues = structureValid.issues;

    } catch (error) {
      keyInfo.issues.push(`JSON parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      keyInfo.dataType = 'invalid-json';
    }

    return keyInfo;
  };

  const analyzeSolutionSeekingOrgFields = (): SolutionSeekingOrgField[] => {
    console.log('👥 Analyzing Solution Seeking Organization fields...');
    
    const registeredUsersRaw = localStorage.getItem('registered_users');
    let users: any[] = [];

    if (registeredUsersRaw) {
      try {
        users = JSON.parse(registeredUsersRaw);
        if (!Array.isArray(users)) users = [];
      } catch (error) {
        users = [];
      }
    }

    return SOLUTION_SEEKING_ORG_FIELDS.map(fieldConfig => {
      const fieldInfo: SolutionSeekingOrgField = {
        field: fieldConfig.field,
        required: fieldConfig.required,
        expectedType: fieldConfig.expectedType,
        exists: false,
        actualValue: null,
        isValid: true,
        issues: []
      };

      if (users.length === 0) {
        fieldInfo.issues.push('No registered users found');
        fieldInfo.isValid = false;
        return fieldInfo;
      }

      // Check each user for this field
      const missingInUsers: number[] = [];
      const wrongTypeInUsers: number[] = [];
      const emptyInUsers: number[] = [];

      users.forEach((user, index) => {
        if (!(fieldConfig.field in user)) {
          missingInUsers.push(index + 1);
        } else {
          fieldInfo.exists = true;
          const value = user[fieldConfig.field];
          fieldInfo.actualValue = value; // Store last user's value as example

          if (typeof value !== fieldConfig.expectedType) {
            wrongTypeInUsers.push(index + 1);
          }

          if (fieldConfig.required && (!value || value.toString().trim() === '')) {
            emptyInUsers.push(index + 1);
          }
        }
      });

      if (missingInUsers.length > 0) {
        fieldInfo.issues.push(`Missing in users: ${missingInUsers.join(', ')}`);
        fieldInfo.isValid = false;
      }

      if (wrongTypeInUsers.length > 0) {
        fieldInfo.issues.push(`Wrong type in users: ${wrongTypeInUsers.join(', ')}`);
        fieldInfo.isValid = false;
      }

      if (emptyInUsers.length > 0) {
        fieldInfo.issues.push(`Empty/null in users: ${emptyInUsers.join(', ')}`);
        fieldInfo.isValid = false;
      }

      return fieldInfo;
    });
  };

  const getDataStructure = (data: any): any => {
    if (Array.isArray(data)) {
      if (data.length === 0) return 'empty-array';
      return `array[${data.length}] of ${typeof data[0]}`;
    }
    
    if (typeof data === 'object' && data !== null) {
      const keys = Object.keys(data);
      return keys.reduce((acc, key) => {
        acc[key] = typeof data[key];
        return acc;
      }, {} as any);
    }
    
    return typeof data;
  };

  const validateStructure = (data: any, config: any) => {
    const result = { isValid: true, issues: [] as string[] };

    if (config.expectedStructure === 'string[]') {
      if (!Array.isArray(data)) {
        result.isValid = false;
        result.issues.push('Expected array of strings');
      } else {
        const nonStrings = data.filter(item => typeof item !== 'string');
        if (nonStrings.length > 0) {
          result.isValid = false;
          result.issues.push(`${nonStrings.length} non-string items found`);
        }
      }
    } else if (typeof config.expectedStructure === 'object') {
      if (Array.isArray(data)) {
        // Validate array items structure
        data.forEach((item, index) => {
          config.requiredFields.forEach((field: string) => {
            if (!(field in item)) {
              result.isValid = false;
              result.issues.push(`Item ${index}: missing field '${field}'`);
            }
          });
        });
      } else if (typeof data === 'object' && data !== null) {
        // Validate object structure
        config.requiredFields.forEach((field: string) => {
          if (!(field in data)) {
            result.isValid = false;
            result.issues.push(`Missing required field '${field}'`);
          }
        });
      } else {
        result.isValid = false;
        result.issues.push('Expected object or array');
      }
    }

    return result;
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getHealthIcon = (isHealthy: boolean, exists: boolean) => {
    if (!exists) return <XCircle className="h-4 w-4 text-destructive" />;
    if (isHealthy) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Foundation': return <Database className="h-4 w-4" />;
      case 'Organization': return <Building className="h-4 w-4" />;
      case 'System': return <FileText className="h-4 w-4" />;
      case 'Challenge': return <Globe className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = (isHealthy: boolean, exists: boolean) => {
    if (!exists) return 'destructive';
    if (isHealthy) return 'default';
    return 'secondary';
  };

  if (!diagnosticReport) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Running diagnostics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Master Data Diagnostics</h2>
          <p className="text-muted-foreground">
            Complete health check of localStorage master data and Solution Seeking organization fields
          </p>
        </div>
        <Button onClick={runDiagnostics} disabled={isRunning}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running...' : 'Refresh'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Keys</p>
                <p className="text-2xl font-bold">{diagnosticReport.totalKeys}</p>
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
                <p className="text-2xl font-bold text-green-600">{diagnosticReport.healthyKeys}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{diagnosticReport.brokenKeys}</p>
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
                <p className="text-2xl font-bold text-destructive">{diagnosticReport.missingKeys}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="master-data" className="w-full">
        <TabsList>
          <TabsTrigger value="master-data">Master Data Keys</TabsTrigger>
          <TabsTrigger value="solution-seekers">Solution Seeking Orgs</TabsTrigger>
        </TabsList>

        <TabsContent value="master-data" className="space-y-4">
          {['Foundation', 'Organization', 'System', 'Challenge'].map(category => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getCategoryIcon(category)}
                  <span>{category} Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {diagnosticReport.masterDataKeys
                    .filter(key => key.category === category)
                    .map(keyInfo => (
                      <div key={keyInfo.key} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getHealthIcon(keyInfo.isValid, keyInfo.exists)}
                            <span className="font-medium">{keyInfo.key}</span>
                            <Badge variant={getBadgeVariant(keyInfo.isValid, keyInfo.exists)}>
                              {!keyInfo.exists ? 'Missing' : keyInfo.isValid ? 'Healthy' : 'Issues'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {keyInfo.size} KB • {keyInfo.itemCount} items
                          </div>
                        </div>

                        {keyInfo.issues.length > 0 && (
                          <Alert className="mt-2">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Issues Found:</strong>
                              <ul className="list-disc pl-4 mt-1">
                                {keyInfo.issues.map((issue, index) => (
                                  <li key={index}>{issue}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="mt-2 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium">Expected Structure:</p>
                              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(keyInfo.expectedStructure, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <p className="font-medium">Actual Structure:</p>
                              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(keyInfo.actualStructure, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="solution-seekers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Solution Seeking Organization Fields</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {diagnosticReport.solutionSeekingOrgFields.map(field => (
                  <div key={field.field} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getHealthIcon(field.isValid, field.exists)}
                        <span className="font-medium">{field.field}</span>
                        <Badge variant={field.required ? 'destructive' : 'secondary'}>
                          {field.required ? 'Required' : 'Optional'}
                        </Badge>
                        <Badge variant="outline">
                          {field.expectedType}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {field.exists ? 'Present' : 'Missing'}
                      </div>
                    </div>

                    {field.issues.length > 0 && (
                      <Alert className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Field Issues:</strong>
                          <ul className="list-disc pl-4 mt-1">
                            {field.issues.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {field.actualValue && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium">Sample Value:</p>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(field.actualValue, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Last checked: {new Date(diagnosticReport.lastChecked).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterDataDiagnostics;