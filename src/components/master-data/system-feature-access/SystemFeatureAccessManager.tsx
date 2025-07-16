import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';

export const SystemFeatureAccessManager: React.FC = () => {
  const { items: systemFeatureAccess, loading } = useMasterDataCRUD('master_system_feature_access');

  const columns = [
    { accessorKey: 'feature_name', header: 'Feature Name' },
    { accessorKey: 'pricing_tier_id', header: 'Pricing Tier' },
    { accessorKey: 'access_level', header: 'Access Level' },
    { accessorKey: 'is_enabled', header: 'Enabled', cell: ({ row }: any) => <Badge variant={row.getValue('is_enabled') ? 'default' : 'secondary'}>{row.getValue('is_enabled') ? 'Yes' : 'No'}</Badge> },
    { accessorKey: 'is_active', header: 'Status', cell: ({ row }: any) => <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>{row.getValue('is_active') ? 'Active' : 'Inactive'}</Badge> }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            System Feature Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={systemFeatureAccess} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};