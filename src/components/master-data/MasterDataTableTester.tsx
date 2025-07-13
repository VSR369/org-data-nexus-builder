import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { RefreshCw, Database, Eye, CheckCircle, XCircle, ArrowRight, Users, Settings, Workflow, Search, FileText, BarChart3, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TableStructure {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  ordinal_position: number;
}

interface TableData {
  tableName: string;
  displayName: string;
  structure: TableStructure[];
  sampleData: any[];
  recordCount: number;
  frontendFields: string[];
  isSupabaseEnabled: boolean;
  parentTable?: string;
  childTables?: string[];
  relationshipType?: 'master' | 'hierarchy' | 'configuration' | 'operational';
}

const MasterDataTableTester = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableDataMap, setTableDataMap] = useState<Record<string, any[]>>({});
  const [loadingTables, setLoadingTables] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const masterDataTables = [
    // Master Reference Tables
    {
      tableName: 'master_countries',
      displayName: 'Countries',
      frontendFields: ['id', 'name', 'code', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'master' as const,
      childTables: ['master_currencies']
    },
    {
      tableName: 'master_currencies', 
      displayName: 'Currencies',
      frontendFields: ['id', 'name', 'code', 'symbol', 'country', 'country_code', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'master' as const,
      parentTable: 'master_countries'
    },
    {
      tableName: 'master_organization_types',
      displayName: 'Organization Types', 
      frontendFields: ['id', 'name', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'master' as const
    },
    {
      tableName: 'master_entity_types',
      displayName: 'Entity Types',
      frontendFields: ['id', 'name', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'master' as const
    },
    {
      tableName: 'master_industry_segments',
      displayName: 'Industry Segments',
      frontendFields: ['id', 'name', 'description', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'master' as const,
      childTables: ['master_domain_groups']
    },
    // Department Hierarchy (Parent → Child → Grandchild)
    {
      tableName: 'master_departments',
      displayName: 'Departments (Level 1)',
      frontendFields: ['id', 'name', 'description', 'organization_id', 'organization_name', 'is_active', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'hierarchy' as const,
      childTables: ['master_sub_departments']
    },
    {
      tableName: 'master_challenge_statuses',
      displayName: 'Challenge Statuses',
      frontendFields: ['id', 'name', 'description', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'master' as const
    },
    {
      tableName: 'master_solution_statuses',
      displayName: 'Solution Statuses',
      frontendFields: ['id', 'name', 'description', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'master' as const
    },
    {
      tableName: 'master_communication_types',
      displayName: 'Communication Types',
      frontendFields: ['id', 'name', 'description', 'link', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'master' as const
    },
    {
      tableName: 'master_reward_types',
      displayName: 'Reward Types',
      frontendFields: ['id', 'name', 'description', 'type', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'master' as const
    },
    {
      tableName: 'master_engagement_models',
      displayName: 'Engagement Models',
      frontendFields: ['id', 'name', 'description', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'master' as const
    },
    {
      tableName: 'master_competency_capabilities',
      displayName: 'Competency Capabilities',
      frontendFields: ['id', 'name', 'description', 'category', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'master' as const
    },
    {
      tableName: 'master_domain_groups',
      displayName: 'Domain Groups',
      frontendFields: ['id', 'name', 'description', 'industry_segment_id', 'is_active', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'hierarchy' as const,
      parentTable: 'master_industry_segments',
      childTables: ['master_categories']
    },
    {
      tableName: 'master_categories',
      displayName: 'Categories',
      frontendFields: ['id', 'name', 'description', 'domain_group_id', 'is_active', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'hierarchy' as const,
      parentTable: 'master_domain_groups',
      childTables: ['master_sub_categories']
    },
    {
      tableName: 'master_sub_categories',
      displayName: 'Sub Categories',
      frontendFields: ['id', 'name', 'description', 'category_id', 'is_active', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'hierarchy' as const,
      parentTable: 'master_categories'
    },
    {
      tableName: 'master_seeker_membership_fees',
      displayName: 'Seeker Membership Fees',
      frontendFields: ['id', 'country', 'organization_type', 'entity_type', 'quarterly_amount', 'half_yearly_amount', 'annual_amount', 'monthly_amount', 'quarterly_currency', 'half_yearly_currency', 'annual_currency', 'monthly_currency', 'description', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'configuration' as const
    },
    {
      tableName: 'pricing_configs',
      displayName: 'Pricing Configurations',
      frontendFields: ['id', 'country', 'organization_type', 'entity_type', 'engagement_model', 'membership_status', 'config_id', 'currency', 'annual_fee', 'half_yearly_fee', 'quarterly_fee', 'platform_fee_percentage', 'discount_percentage', 'internal_paas_pricing', 'created_at', 'updated_at', 'version'],
      isSupabaseEnabled: true,
      relationshipType: 'configuration' as const
    },
    {
      tableName: 'master_sub_departments',
      displayName: 'Sub Departments (Level 2)',
      frontendFields: ['id', 'name', 'description', 'department_id', 'is_active', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'hierarchy' as const,
      parentTable: 'master_departments',
      childTables: ['master_team_units']
    },
    {
      tableName: 'master_team_units',
      displayName: 'Team Units (Level 3)',
      frontendFields: ['id', 'name', 'description', 'sub_department_id', 'is_active', 'created_at', 'updated_at', 'created_by', 'version', 'is_user_created'],
      isSupabaseEnabled: true,
      relationshipType: 'hierarchy' as const,
      parentTable: 'master_sub_departments'
    },
    // Missing Tables - Now Added
    {
      tableName: 'engagement_activations',
      displayName: 'Engagement Activations',
      frontendFields: ['id', 'user_id', 'organization_type', 'country', 'engagement_model', 'membership_status', 'selected_frequency', 'payment_amount', 'currency', 'activation_status', 'created_at', 'updated_at'],
      isSupabaseEnabled: true,
      relationshipType: 'operational' as const
    },
    {
      tableName: 'profiles',
      displayName: 'User Profiles',
      frontendFields: ['id', 'custom_user_id', 'contact_person_name', 'organization_name', 'organization_type', 'entity_type', 'country', 'industry_segment', 'phone_number', 'website', 'address', 'created_at', 'updated_at'],
      isSupabaseEnabled: true,
      relationshipType: 'operational' as const
    }
  ];

  // Function to get actual table schema from PostgreSQL information_schema
  const getTableSchema = async (tableName: string): Promise<TableStructure[]> => {
    try {
      const { data, error } = await supabase.rpc('get_table_schema', { 
        table_name: tableName 
      });

      if (error) {
        console.error(`Error fetching schema for ${tableName}:`, error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error(`Error getting schema for ${tableName}:`, error);
      return [];
    }
  };

  // Function to load table data using actual database schema
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
              // Get actual table structure from PostgreSQL information_schema
              structure = await getTableSchema(tableInfo.tableName);

              // Get sample data for preview (separate from structure)
              const { data, error: dataError } = await supabase
                .from(tableInfo.tableName as any)
                .select('*')
                .limit(3);

              if (!dataError) {
                sampleData = data || [];
              } else {
                console.log(`Error fetching sample data for ${tableInfo.tableName}:`, dataError);
              }

              // Get record count
              const { count: recordCount, error: countError } = await supabase
                .from(tableInfo.tableName as any)
                .select('*', { count: 'exact', head: true });

              if (!countError) {
                count = recordCount || 0;
              } else {
                console.log(`Error getting count for ${tableInfo.tableName}:`, countError);
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
        description: `Analyzed ${tableData.length} master data tables using actual database schema`,
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

  // Function to load full table data for individual table view
  const loadFullTableData = async (tableName: string) => {
    if (loadingTables.has(tableName)) {
      console.log(`⏳ Table ${tableName} is already loading, skipping...`);
      return;
    }
    
    console.log(`🔄 Starting to load data for table: ${tableName}`);
    setLoadingTables(prev => new Set([...prev, tableName]));
    
    try {
      console.log(`📡 Making Supabase query for table: ${tableName}`);
      const { data, error, count } = await supabase
        .from(tableName as any)
        .select('*', { count: 'exact' })
        .limit(100);

      if (error) {
        console.error(`❌ Error loading data for ${tableName}:`, error);
        toast({
          title: "Error",
          description: `Failed to load data for ${tableName}: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log(`✅ Successfully loaded ${data?.length || 0} records for ${tableName}`);
      console.log(`📊 Sample data for ${tableName}:`, data?.slice(0, 2));
      
      // Store data for this specific table with verification
      setTableDataMap(prev => {
        const newMap = {
          ...prev,
          [tableName]: data || []
        };
        console.log(`💾 Storing data for ${tableName}, total tables in map:`, Object.keys(newMap));
        return newMap;
      });
      
      toast({
        title: "Data Loaded Successfully",
        description: `Loaded ${data?.length || 0} records for ${tableName}`,
      });
    } catch (error) {
      console.error(`💥 Exception loading data for ${tableName}:`, error);
      toast({
        title: "Error",
        description: `Failed to load table data for ${tableName}`,
        variant: "destructive",
      });
    } finally {
      setLoadingTables(prev => {
        const newSet = new Set(prev);
        newSet.delete(tableName);
        console.log(`✅ Removed ${tableName} from loading set`);
        return newSet;
      });
    }
  };

  // Function to clear all loaded table data
  const clearAllTableData = () => {
    console.log('🧹 Clearing all table data');
    setTableDataMap({});
    toast({
      title: "Data Cleared",
      description: "All table data has been cleared",
    });
  };

  // Filter tables based on search term
  const filteredTables = tables.filter(table => 
    table.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.tableName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Data analysis functions
  const getDataAnalysis = () => {
    const emptyTables = tables.filter(t => t.recordCount === 0);
    const minimalTables = tables.filter(t => t.recordCount > 0 && t.recordCount < 5);
    const populatedTables = tables.filter(t => t.recordCount >= 5);
    
    return {
      empty: emptyTables,
      minimal: minimalTables,
      populated: populatedTables,
      totalRecords: tables.reduce((sum, t) => sum + t.recordCount, 0)
    };
  };

  const analysis = getDataAnalysis();

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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data-analysis">Data Analysis</TabsTrigger>
          <TabsTrigger value="table-data">Table Data</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4">
            {['master', 'hierarchy', 'configuration', 'operational'].map((type) => {
              const filteredTables = tables.filter(t => t.relationshipType === type);
              if (filteredTables.length === 0) return null;
              
              const getTypeIcon = (type: string) => {
                switch(type) {
                  case 'master': return <Database className="w-5 h-5" />;
                  case 'hierarchy': return <Workflow className="w-5 h-5" />;
                  case 'configuration': return <Settings className="w-5 h-5" />;
                  case 'operational': return <Users className="w-5 h-5" />;
                  default: return <Database className="w-5 h-5" />;
                }
              };
              
              return (
                <Card key={type}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      {getTypeIcon(type)}
                      {type} Tables ({filteredTables.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {filteredTables.map((table) => (
                        <div key={table.tableName} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Database className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{table.displayName}</div>
                              <div className="text-sm text-muted-foreground">{table.tableName}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{table.recordCount} records</Badge>
                            <Badge variant="secondary">{table.structure.length} columns</Badge>
                            {table.parentTable && <Badge variant="outline">Child of {table.parentTable}</Badge>}
                            {table.childTables && table.childTables.length > 0 && 
                              <Badge variant="outline">Parent to {table.childTables.length} tables</Badge>
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="data-analysis">
          <div className="space-y-6">
            {/* Data Completeness Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    Empty Tables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{analysis.empty.length}</div>
                  <p className="text-sm text-muted-foreground">No data stored</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    Minimal Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">{analysis.minimal.length}</div>
                  <p className="text-sm text-muted-foreground">&lt; 5 records</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Well Populated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{analysis.populated.length}</div>
                  <p className="text-sm text-muted-foreground">≥ 5 records</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Total Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analysis.totalRecords}</div>
                  <p className="text-sm text-muted-foreground">Across all tables</p>
                </CardContent>
              </Card>
            </div>

            {/* Empty Tables Detail */}
            {analysis.empty.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    Empty Tables ({analysis.empty.length})
                  </CardTitle>
                  <CardDescription>
                    These tables have no data and may need to be populated with master data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {analysis.empty.map((table) => (
                      <div key={table.tableName} className="flex items-center justify-between p-3 border rounded-lg border-red-200 bg-red-50">
                        <div className="flex items-center gap-3">
                          <Database className="w-4 h-4 text-red-600" />
                          <div>
                            <div className="font-medium text-red-800">{table.displayName}</div>
                            <div className="text-sm text-red-600">{table.tableName}</div>
                          </div>
                        </div>
                        <Badge variant="destructive">0 records</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Minimal Data Tables */}
            {analysis.minimal.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600">
                    <AlertCircle className="w-5 h-5" />
                    Tables with Minimal Data ({analysis.minimal.length})
                  </CardTitle>
                  <CardDescription>
                    These tables have some data but may need more records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {analysis.minimal.map((table) => (
                      <div key={table.tableName} className="flex items-center justify-between p-3 border rounded-lg border-yellow-200 bg-yellow-50">
                        <div className="flex items-center gap-3">
                          <Database className="w-4 h-4 text-yellow-600" />
                          <div>
                            <div className="font-medium text-yellow-800">{table.displayName}</div>
                            <div className="text-sm text-yellow-600">{table.tableName}</div>
                          </div>
                        </div>
                        <Badge variant="secondary">{table.recordCount} records</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="table-data">
          <div className="space-y-6">
            {/* Search and Control Panel */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={clearAllTableData}
                variant="outline"
                disabled={Object.keys(tableDataMap).length === 0}
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Clear All Data
              </Button>
            </div>

            {/* Data Overview */}
            {Object.keys(tableDataMap).length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      {Object.keys(tableDataMap).length} tables loaded
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {Object.values(tableDataMap).reduce((sum, data) => sum + data.length, 0)} total records
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Table Data Viewer */}
            <div className="grid gap-4">
              {filteredTables.map((table) => (
                <Card key={table.tableName}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="w-5 h-5" />
                          {table.displayName}
                          {tableDataMap[table.tableName] && (
                            <Badge variant="outline" className="ml-2">
                              {tableDataMap[table.tableName].length} loaded
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {table.tableName} • {table.recordCount} records • {table.structure.length} columns
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => loadFullTableData(table.tableName)}
                        disabled={loadingTables.has(table.tableName) || table.recordCount === 0}
                        variant="outline"
                        size="sm"
                      >
                        {loadingTables.has(table.tableName) ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                        {tableDataMap[table.tableName] ? 'Refresh Data' : 'View Data'}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {tableDataMap[table.tableName] && tableDataMap[table.tableName].length > 0 && (
                    <CardContent>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto max-h-96">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {Object.keys(tableDataMap[table.tableName][0] || {}).slice(0, 6).map((column) => (
                                  <TableHead key={column} className="font-medium">
                                    {column}
                                  </TableHead>
                                ))}
                                {Object.keys(tableDataMap[table.tableName][0] || {}).length > 6 && (
                                  <TableHead>...</TableHead>
                                )}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {tableDataMap[table.tableName].slice(0, 10).map((row, index) => (
                                <TableRow key={index}>
                                  {Object.values(row).slice(0, 6).map((value: any, cellIndex) => (
                                    <TableCell key={cellIndex} className="max-w-32 truncate">
                                      {value === null ? (
                                        <span className="text-muted-foreground italic">null</span>
                                      ) : typeof value === 'object' ? (
                                        <span className="text-muted-foreground">JSON</span>
                                      ) : typeof value === 'boolean' ? (
                                        <Badge variant={value ? "default" : "secondary"}>
                                          {String(value)}
                                        </Badge>
                                      ) : (
                                        String(value)
                                      )}
                                    </TableCell>
                                  ))}
                                  {Object.keys(row).length > 6 && (
                                    <TableCell className="text-muted-foreground">...</TableCell>
                                  )}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        {tableDataMap[table.tableName].length > 10 && (
                          <div className="p-3 bg-muted text-center text-sm text-muted-foreground">
                            Showing first 10 of {tableDataMap[table.tableName].length} records
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                  
                  {tableDataMap[table.tableName] && tableDataMap[table.tableName].length === 0 && (
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No data found in this table</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="relationships">
          <div className="space-y-6">
            {/* Department Hierarchy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="w-5 h-5" />
                  Department Hierarchy (3-Level Structure)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="font-semibold">Departments</div>
                    <div className="text-sm text-muted-foreground">Level 1</div>
                    <Badge variant="outline">{tables.find(t => t.tableName === 'master_departments')?.recordCount || 0} records</Badge>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                  <div className="text-center">
                    <div className="font-semibold">Sub Departments</div>
                    <div className="text-sm text-muted-foreground">Level 2</div>
                    <Badge variant="outline">{tables.find(t => t.tableName === 'master_sub_departments')?.recordCount || 0} records</Badge>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                  <div className="text-center">
                    <div className="font-semibold">Team Units</div>
                    <div className="text-sm text-muted-foreground">Level 3</div>
                    <Badge variant="outline">{tables.find(t => t.tableName === 'master_team_units')?.recordCount || 0} records</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Industry Hierarchy - Now with 4 levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="w-5 h-5" />
                  Industry Hierarchy (4-Level Structure)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="font-semibold">Industry Segments</div>
                    <div className="text-sm text-muted-foreground">Level 1</div>
                    <Badge variant="outline">{tables.find(t => t.tableName === 'master_industry_segments')?.recordCount || 0} records</Badge>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                  <div className="text-center">
                    <div className="font-semibold">Domain Groups</div>
                    <div className="text-sm text-muted-foreground">Level 2</div>
                    <Badge variant="outline">{tables.find(t => t.tableName === 'master_domain_groups')?.recordCount || 0} records</Badge>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                  <div className="text-center">
                    <div className="font-semibold">Categories</div>
                    <div className="text-sm text-muted-foreground">Level 3</div>
                    <Badge variant="outline">{tables.find(t => t.tableName === 'master_categories')?.recordCount || 0} records</Badge>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                  <div className="text-center">
                    <div className="font-semibold">Sub Categories</div>
                    <div className="text-sm text-muted-foreground">Level 4</div>
                    <Badge variant="outline">{tables.find(t => t.tableName === 'master_sub_categories')?.recordCount || 0} records</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Country-Currency Relationship */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Reference Data Relationships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="font-semibold">Countries</div>
                    <div className="text-sm text-muted-foreground">Master Reference</div>
                    <Badge variant="outline">{tables.find(t => t.tableName === 'master_countries')?.recordCount || 0} records</Badge>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                  <div className="text-center">
                    <div className="font-semibold">Currencies</div>
                    <div className="text-sm text-muted-foreground">References Countries</div>
                    <Badge variant="outline">{tables.find(t => t.tableName === 'master_currencies')?.recordCount || 0} records</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Relationships Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Table Relationships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tables.filter(t => t.parentTable || (t.childTables && t.childTables.length > 0)).map((table) => (
                    <div key={table.tableName} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{table.tableName}</Badge>
                      {table.parentTable && (
                        <>
                          <span className="text-muted-foreground">child of</span>
                          <Badge variant="secondary">{table.parentTable}</Badge>
                        </>
                      )}
                      {table.childTables && table.childTables.length > 0 && (
                        <>
                          <span className="text-muted-foreground">parent to</span>
                          {table.childTables.map(child => (
                            <Badge key={child} variant="secondary">{child}</Badge>
                          ))}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                             <th className="border border-gray-300 px-4 py-2 text-left">Relationship</th>
                           </tr>
                         </thead>
                         <tbody>
                           {table.structure.map((column, idx) => {
                             const isForeignKey = column.column_name.endsWith('_id') && column.column_name !== 'id';
                             const isParentRef = table.parentTable && column.column_name.includes(table.parentTable.replace('master_', '').slice(0, -1));
                             
                             return (
                               <tr key={idx} className={isForeignKey ? 'bg-blue-50' : ''}>
                                 <td className="border border-gray-300 px-4 py-2 font-mono">
                                   {column.column_name}
                                   {isForeignKey && <Badge variant="outline" className="ml-2 text-xs">FK</Badge>}
                                 </td>
                                 <td className="border border-gray-300 px-4 py-2">{column.data_type}</td>
                                 <td className="border border-gray-300 px-4 py-2">{column.is_nullable}</td>
                                 <td className="border border-gray-300 px-4 py-2 text-sm">{column.column_default || 'None'}</td>
                                 <td className="border border-gray-300 px-4 py-2 text-sm">
                                   {isForeignKey ? (
                                     <Badge variant="secondary">Foreign Key</Badge>
                                   ) : isParentRef ? (
                                     <Badge variant="outline">References Parent</Badge>
                                   ) : (
                                     'Regular Field'
                                   )}
                                 </td>
                               </tr>
                             );
                           })}
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