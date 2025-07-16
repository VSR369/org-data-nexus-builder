import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';

export const TierEngagementAccessManager: React.FC = () => {
  const { items: tierEngagementAccess, loading } = useMasterDataCRUD('master_tier_engagement_model_access');

  const columns = [
    { accessorKey: 'pricing_tier_id', header: 'Pricing Tier' },
    { accessorKey: 'engagement_model_id', header: 'Engagement Model' },
    { accessorKey: 'is_allowed', header: 'Allowed', cell: ({ row }: any) => <Badge variant={row.getValue('is_allowed') ? 'default' : 'secondary'}>{row.getValue('is_allowed') ? 'Yes' : 'No'}</Badge> },
    { accessorKey: 'is_default', header: 'Default', cell: ({ row }: any) => <Badge variant={row.getValue('is_default') ? 'default' : 'secondary'}>{row.getValue('is_default') ? 'Yes' : 'No'}</Badge> },
    { accessorKey: 'selection_type', header: 'Selection Type' },
    { accessorKey: 'is_active', header: 'Status', cell: ({ row }: any) => <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>{row.getValue('is_active') ? 'Active' : 'Inactive'}</Badge> }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Tier Engagement Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={tierEngagementAccess} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};