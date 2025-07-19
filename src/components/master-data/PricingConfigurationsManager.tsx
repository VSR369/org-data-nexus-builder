
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const PricingConfigurationsManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: pricingConfigs = [], isLoading } = useQuery({
    queryKey: ['pricing-configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_configurations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const filteredConfigs = pricingConfigs.filter(config => 
    config.config_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.base_value?.toString().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      accessorKey: 'config_name',
      header: 'Configuration Name',
      cell: ({ row }: any) => (
        <div className="font-medium">
          {row.getValue('config_name')}
        </div>
      ),
    },
    {
      accessorKey: 'base_value',
      header: 'Base Value',
      cell: ({ row }: any) => (
        <div className="font-mono text-sm">
          {row.getValue('base_value')}
        </div>
      ),
    },
    {
      accessorKey: 'calculated_value',
      header: 'Calculated Value',
      cell: ({ row }: any) => (
        <div className="font-mono text-sm">
          {row.getValue('calculated_value')}
        </div>
      ),
    },
    {
      accessorKey: 'membership_discount_percentage',
      header: 'Discount %',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('membership_discount_percentage')}%
        </div>
      ),
    },
    {
      accessorKey: 'billing_frequency',
      header: 'Billing Frequency',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('billing_frequency') || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('is_active') ? 'Active' : 'Inactive'}
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }: any) => (
        <div className="text-muted-foreground text-sm">
          {new Date(row.getValue('created_at')).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing Configurations Manager
          </CardTitle>
          <p className="text-muted-foreground">
            Manage pricing configurations and calculation parameters
          </p>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search configurations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{pricingConfigs.length}</div>
            <p className="text-xs text-muted-foreground">Total Configurations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {pricingConfigs.filter(config => config.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">Active Configurations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredConfigs.length}</div>
            <p className="text-xs text-muted-foreground">Filtered Results</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={filteredConfigs}
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingConfigurationsManager;
