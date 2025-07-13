import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Database, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TableStructure {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

interface TableData {
  tableName: string;
  displayName: string;
  structure: TableStructure[];
  sampleData: any[];
  recordCount: number;
  frontendFields: string[];
  isSupabaseEnabled: boolean;
}

const MasterDataTableTester = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const masterDataTables = [
    {
      tableName: 'master_countries',
      displayName: 'Countries',
      frontendFields: ['id', 'name', 'code', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_currencies', 
      displayName: 'Currencies',
      frontendFields: ['id', 'name', 'code', 'symbol', 'country', 'country_code', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_organization_types',
      displayName: 'Organization Types', 
      frontendFields: ['id', 'name', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_entity_types',
      displayName: 'Entity Types',
      frontendFields: ['id', 'name', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_industry_segments',
      displayName: 'Industry Segments',
      frontendFields: ['id', 'name', 'description', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_departments',
      displayName: 'Departments',
      frontendFields: ['id', 'name', 'description', 'organization_id', 'organization_name', 'is_active', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_challenge_statuses',
      displayName: 'Challenge Statuses',
      frontendFields: ['id', 'name', 'description', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_solution_statuses',
      displayName: 'Solution Statuses',
      frontendFields: ['id', 'name', 'description', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_communication_types',
      displayName: 'Communication Types',
      frontendFields: ['id', 'name', 'description', 'link', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_reward_types',
      displayName: 'Reward Types',
      frontendFields: ['id', 'name', 'description', 'type', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_engagement_models',
      displayName: 'Engagement Models',
      frontendFields: ['id', 'name', 'description', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_competency_capabilities',
      displayName: 'Competency Capabilities',
      frontendFields: ['id', 'name', 'description', 'category', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_domain_groups',
      displayName: 'Domain Groups',
      frontendFields: ['id', 'name', 'description', 'hierarchy', 'industry_segment_id', 'is_active', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_seeker_membership_fees',
      displayName: 'Seeker Membership Fees',
      frontendFields: ['id', 'country', 'organization_type', 'entity_type', 'quarterly_amount', 'half_yearly_amount', 'annual_amount', 'monthly_amount', 'quarterly_currency', 'half_yearly_currency', 'annual_currency', 'monthly_currency', 'description', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'pricing_configs',
      displayName: 'Pricing Configurations',
      frontendFields: ['id', 'country', 'organization_type', 'entity_type', 'engagement_model', 'membership_status', 'config_id', 'currency', 'annual_fee', 'half_yearly_fee', 'quarterly_fee', 'platform_fee_percentage', 'discount_percentage', 'internal_paas_pricing', 'created_at', 'updated_at', 'version'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_sub_departments',
      displayName: 'Sub Departments',
      frontendFields: ['id', 'name', 'description', 'department_id', 'is_active', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    },
    {
      tableName: 'master_team_units',
      displayName: 'Team Units',
      frontendFields: ['id', 'name', 'description', 'sub_department_id', 'is_active', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true
    }
  ];

  const loadTableData = async () => {
    setLoading(true);
    try {
      const tableData: TableData[] = [];

      for (const tableInfo of masterDataTables) {
        try {
          let sampleData: any[] = [];
          let count = 0;
          let structure: TableStructure[] = [];

          if (tableInfo.isSupabaseEnabled) {
            try {
              // First try to get sample data to see what fields actually exist
              const { data: tableData, error: tableError } = await supabase
                .from(tableInfo.tableName as any)
                .select('*')
                .limit(1);

              if (!tableError && tableData && tableData.length > 0) {
                // Extract actual table structure from sample data
                const sampleObj = tableData[0];
                structure = Object.keys(sampleObj).map(key => {
                  const value = sampleObj[key];
                  let dataType = 'text';
                  
                  // Improved type inference based on field name patterns and values
                  if (key === 'id' || key.endsWith('_id')) {
                    dataType = 'uuid';
                  } else if (key.includes('date') || key.includes('time') || key.includes('at')) {
                    dataType = 'timestamp with time zone';
                  } else if (key.includes('amount') || key.includes('percentage') || key.includes('fee')) {
                    dataType = 'numeric';
                  } else if (key === 'version') {
                    dataType = 'integer';
                  } else if (key.startsWith('is_') || key === 'active' || typeof value === 'boolean') {
                    dataType = 'boolean';
                  } else if (key === 'hierarchy' || (typeof value === 'object' && value !== null && !Array.isArray(value))) {
                    dataType = 'jsonb';
                  } else if (Array.isArray(value)) {
                    dataType = 'ARRAY';
                  } else if (typeof value === 'number') {
                    dataType = Number.isInteger(value) ? 'integer' : 'numeric';
                  } else if (typeof value === 'string') {
                    // Check if it looks like a timestamp
                    if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
                      dataType = 'timestamp with time zone';
                    } else {
                      dataType = 'text';
                    }
                  }
                  
                  return {
                    table_name: tableInfo.tableName,
                    column_name: key,
                    data_type: dataType,
                    is_nullable: value === null ? 'YES' : 'NO',
                    column_default: key === 'id' ? 'gen_random_uuid()' : null
                  };
                });
              } else {
                // If no data exists, create structure based on frontend field mapping
                structure = tableInfo.frontendFields.map(field => {
                  let dataType = 'text';
                  let defaultValue = null;
                  
                  if (field === 'id' || field.endsWith('_id')) {
                    dataType = 'uuid';
                    defaultValue = field === 'id' ? 'gen_random_uuid()' : null;
                  } else if (field.includes('date') || field.includes('time') || field.includes('at')) {
                    dataType = 'timestamp with time zone';
                    defaultValue = field.includes('created_at') || field.includes('updated_at') ? 'now()' : null;
                  } else if (field.includes('amount') || field.includes('percentage') || field.includes('fee')) {
                    dataType = 'numeric';
                  } else if (field === 'version') {
                    dataType = 'integer';
                    defaultValue = '1';
                  } else if (field.startsWith('is_') || field === 'active') {
                    dataType = 'boolean';
                    defaultValue = field === 'is_active' ? 'true' : 'false';
                  } else if (field === 'hierarchy') {
                    dataType = 'jsonb';
                  }
                  
                  return {
                    table_name: tableInfo.tableName,
                    column_name: field,
                    data_type: dataType,
                    is_nullable: field === 'id' || field === 'name' ? 'NO' : 'YES',
                    column_default: defaultValue
                  };
                });
              }

              // Get sample data
              const { data, error: dataError } = await supabase
                .from(tableInfo.tableName as any)
                .select('*')
                .limit(3);

              if (!dataError) {
                sampleData = data || [];
              }

              // Get record count
              const { count: recordCount, error: countError } = await supabase
                .from(tableInfo.tableName as any)
                .select('*', { count: 'exact', head: true });

              if (!countError) count = recordCount || 0;

              // If no structure from schema queries, fallback to sample data structure
              if (structure.length === 0 && sampleData.length > 0) {
                const sampleObj = sampleData[0];
                structure = Object.keys(sampleObj).map(key => {
                  const value = sampleObj[key];
                  let dataType: string = typeof value;
                  
                  // Better type inference
                  if (value === null) {
                    dataType = 'nullable';
                  } else if (typeof value === 'string') {
                    if (key.includes('date') || key.includes('time') || value.match(/^\d{4}-\d{2}-\d{2}/)) {
                      dataType = 'timestamp with time zone';
                    } else if (key === 'id' || key.endsWith('_id')) {
                      dataType = 'uuid';
                    } else {
                      dataType = 'text';
                    }
                  } else if (typeof value === 'number') {
                    dataType = Number.isInteger(value) ? 'integer' : 'numeric';
                  } else if (typeof value === 'boolean') {
                    dataType = 'boolean';
                  } else if (Array.isArray(value)) {
                    dataType = 'ARRAY';
                  } else if (typeof value === 'object') {
                    dataType = 'jsonb';
                  }
                  
                  return {
                    table_name: tableInfo.tableName,
                    column_name: key,
                    data_type: dataType,
                    is_nullable: value === null ? 'YES' : 'NO',
                    column_default: null
                  };
                });
              }
            } catch (error) {
              console.log(`Error accessing table ${tableInfo.tableName}:`, error);
            }
          }

          tableData.push({
            ...tableInfo,
            structure,
            sampleData,
            recordCount: count
          });
        } catch (error) {
          console.error(`Error processing ${tableInfo.tableName}:`, error);
          tableData.push({
            ...tableInfo,
            structure: [],
            sampleData: [],
            recordCount: 0
          });
        }
      }

      setTables(tableData);
      toast({
        title: "Table Analysis Complete",
        description: `Analyzed ${tableData.length} master data tables`,
      });
    } catch (error) {
      console.error('Error loading table data:', error);
      toast({
        title: "Error",
        description: "Failed to load table analysis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTableData();
  }, []);

  const checkFieldMapping = (table: TableData) => {
    const dbColumns = table.structure.map(s => s.column_name);
    const unmappedFrontendFields = table.frontendFields.filter(field => 
      !dbColumns.includes(field) && field !== 'id'
    );
    const unmappedDbColumns = dbColumns.filter(col => 
      !table.frontendFields.includes(col) && 
      !['created_at', 'updated_at', 'created_by', 'is_user_created', 'version'].includes(col)
    );
    
    return { unmappedFrontendFields, unmappedDbColumns };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Master Data Table Structure Tester</h2>
          <p className="text-lg text-muted-foreground">
            Analyze Supabase table structures and frontend field mappings
          </p>
        </div>
        <Button onClick={loadTableData} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Analysis
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-5 h-5" />
              Total Tables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tables.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Supabase Enabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tables.filter(t => t.isSupabaseEnabled).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle className="w-5 h-5 text-orange-600" />
              Local Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {tables.filter(t => !t.isSupabaseEnabled).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="structure">Table Structure</TabsTrigger>
          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4">
            {tables.map((table) => (
              <Card key={table.tableName}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      {table.displayName}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={table.isSupabaseEnabled ? "default" : "secondary"}>
                        {table.isSupabaseEnabled ? "Supabase" : "Local Storage"}
                      </Badge>
                      <Badge variant="outline">
                        {table.recordCount} records
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Table: {table.tableName} | Columns: {table.structure.length} | Frontend Fields: {table.frontendFields.length}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="structure">
          <div className="grid gap-6">
            {tables.map((table) => (
              <Card key={table.tableName}>
                <CardHeader>
                  <CardTitle>{table.displayName} Structure</CardTitle>
                  <CardDescription>Database table: {table.tableName}</CardDescription>
                </CardHeader>
                <CardContent>
                  {table.structure.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-muted">
                            <th className="border border-gray-300 px-4 py-2 text-left">Column</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Nullable</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Default</th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.structure.map((column, idx) => (
                            <tr key={idx}>
                              <td className="border border-gray-300 px-4 py-2 font-mono">{column.column_name}</td>
                              <td className="border border-gray-300 px-4 py-2">{column.data_type}</td>
                              <td className="border border-gray-300 px-4 py-2">{column.is_nullable}</td>
                              <td className="border border-gray-300 px-4 py-2 text-sm">{column.column_default || 'None'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No structure data available - table may not exist in Supabase</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mapping">
          <div className="grid gap-6">
            {tables.map((table) => {
              const { unmappedFrontendFields, unmappedDbColumns } = checkFieldMapping(table);
              const hasIssues = unmappedFrontendFields.length > 0 || unmappedDbColumns.length > 0;
              
              return (
                <Card key={table.tableName}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{table.displayName} Field Mapping</CardTitle>
                      <Badge variant={hasIssues ? "destructive" : "default"}>
                        {hasIssues ? "Issues Found" : "All Mapped"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Expected Frontend Fields:</h4>
                      <div className="flex flex-wrap gap-1">
                        {table.frontendFields.map(field => (
                          <Badge key={field} variant="outline">{field}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Database Columns:</h4>
                      <div className="flex flex-wrap gap-1">
                        {table.structure.map(col => (
                          <Badge key={col.column_name} variant="secondary">{col.column_name}</Badge>
                        ))}
                      </div>
                    </div>

                    {unmappedFrontendFields.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 text-red-600">Missing Database Columns:</h4>
                        <div className="flex flex-wrap gap-1">
                          {unmappedFrontendFields.map(field => (
                            <Badge key={field} variant="destructive">{field}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {unmappedDbColumns.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 text-orange-600">Unmapped Database Columns:</h4>
                        <div className="flex flex-wrap gap-1">
                          {unmappedDbColumns.map(col => (
                            <Badge key={col} variant="outline" className="border-orange-500">{col}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {table.sampleData.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Sample Data:</h4>
                        <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                          {JSON.stringify(table.sampleData[0], null, 2)}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterDataTableTester;