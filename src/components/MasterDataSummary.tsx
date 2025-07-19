import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TableCount {
  table_name: string;
  count: number;
  display_name: string;
  category: string;
}

const tableMapping = [
  { table: 'master_countries', display: 'Countries', category: 'Foundation' },
  { table: 'master_currencies', display: 'Currencies', category: 'Foundation' },
  { table: 'master_entity_types', display: 'Entity Types', category: 'Foundation' },
  { table: 'master_departments', display: 'Departments', category: 'Foundation' },
  { table: 'master_organization_types', display: 'Organization Types', category: 'Organization' },
  { table: 'master_organization_categories', display: 'Organization Categories', category: 'Organization' },
  { table: 'master_industry_segments', display: 'Industry Segments', category: 'Organization' },
  { table: 'master_domain_groups', display: 'Domain Groups', category: 'Organization' },
  { table: 'master_challenge_complexity', display: 'Challenge Complexity', category: 'Challenge' },
  { table: 'master_reward_types', display: 'Reward Types', category: 'Challenge' },
  { table: 'master_communication_types', display: 'Communication Types', category: 'Challenge' },
  { table: 'master_engagement_models', display: 'Engagement Models', category: 'System' },
  { table: 'master_billing_frequencies', display: 'Billing Frequencies', category: 'System' },
  { table: 'master_membership_statuses', display: 'Membership Statuses', category: 'System' },
  { table: 'master_pricing_tiers', display: 'Pricing Tiers', category: 'Pricing' },
  { table: 'master_fee_components', display: 'Fee Components', category: 'Pricing' },
  { table: 'master_platform_fee_formulas', display: 'Fee Formulas', category: 'Pricing' },
];

export const MasterDataSummary: React.FC = () => {
  const [tableCounts, setTableCounts] = useState<TableCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchTableCounts = async () => {
    setLoading(true);
    try {
      const counts: TableCount[] = [];
      let total = 0;

      for (const { table, display, category } of tableMapping) {
        try {
          const { count, error } = await supabase
            .from(table as any)
            .select('*', { count: 'exact', head: true });

          if (error) {
            console.warn(`Failed to get count for ${table}:`, error);
            counts.push({ 
              table_name: table, 
              count: 0, 
              display_name: display, 
              category 
            });
          } else {
            const recordCount = count || 0;
            counts.push({ 
              table_name: table, 
              count: recordCount, 
              display_name: display, 
              category 
            });
            total += recordCount;
          }
        } catch (err) {
          console.warn(`Error fetching count for ${table}:`, err);
          counts.push({ 
            table_name: table, 
            count: 0, 
            display_name: display, 
            category 
          });
        }
      }

      setTableCounts(counts);
      setTotalRecords(total);
    } catch (error) {
      console.error('Error fetching table counts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableCounts();
  }, []);

  const groupedCounts = tableCounts.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, TableCount[]>);

  const getCategoryTotal = (category: string) => {
    return groupedCounts[category]?.reduce((sum, item) => sum + item.count, 0) || 0;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Master Data Summary
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTableCounts}
              disabled={loading}
              className="h-8"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
            <span className="font-semibold">Total Records</span>
            <Badge variant="default" className="text-lg px-3 py-1">
              {totalRecords.toLocaleString()}
            </Badge>
          </div>

          {Object.entries(groupedCounts).map(([category, tables]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                <Badge variant="secondary" className="text-xs">
                  {getCategoryTotal(category)}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {tables.map((table) => (
                  <div
                    key={table.table_name}
                    className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{table.display_name}</span>
                    <Badge 
                      variant={table.count > 0 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {table.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};