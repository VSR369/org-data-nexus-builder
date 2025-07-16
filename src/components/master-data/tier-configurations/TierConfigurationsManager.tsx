import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database as DatabaseIcon } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';

export const TierConfigurationsManager: React.FC = () => {
  const { items: tierConfigurations, loading } = useMasterDataCRUD('master_tier_configurations');

  const columns = [
    { accessorKey: 'pricing_tier_id', header: 'Pricing Tier' },
    { accessorKey: 'country_id', header: 'Country' },
    { accessorKey: 'monthly_challenge_limit', header: 'Monthly Limit' },
    { accessorKey: 'solutions_per_challenge', header: 'Solutions/Challenge' },
    { accessorKey: 'fixed_charge_per_challenge', header: 'Fixed Charge' },
    { accessorKey: 'allows_overage', header: 'Allows Overage', cell: ({ row }: any) => <Badge variant={row.getValue('allows_overage') ? 'default' : 'secondary'}>{row.getValue('allows_overage') ? 'Yes' : 'No'}</Badge> },
    { accessorKey: 'is_active', header: 'Status', cell: ({ row }: any) => <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>{row.getValue('is_active') ? 'Active' : 'Inactive'}</Badge> }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DatabaseIcon className="w-5 h-5" />
            Tier Configurations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={tierConfigurations} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};