import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Plus, Edit, Trash2 } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { TierEngagementAccessDialog } from './TierEngagementAccessDialog';

export const TierEngagementAccessManager: React.FC = () => {
  const { items: tierEngagementAccess, loading, refreshItems } = useMasterDataCRUD('master_tier_engagement_model_access');
  const [editingItem, setEditingItem] = useState<any>(null);

  const columns = [
    { accessorKey: 'pricing_tier_name', header: 'Pricing Tier' },
    { accessorKey: 'engagement_model_name', header: 'Engagement Model' },
    { accessorKey: 'is_allowed', header: 'Allowed', cell: ({ row }: any) => <Badge variant={row.getValue('is_allowed') ? 'default' : 'secondary'}>{row.getValue('is_allowed') ? 'Yes' : 'No'}</Badge> },
    { accessorKey: 'is_default', header: 'Default', cell: ({ row }: any) => <Badge variant={row.getValue('is_default') ? 'default' : 'secondary'}>{row.getValue('is_default') ? 'Yes' : 'No'}</Badge> },
    { accessorKey: 'selection_type', header: 'Selection Type' },
    { accessorKey: 'is_active', header: 'Status', cell: ({ row }: any) => <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>{row.getValue('is_active') ? 'Active' : 'Inactive'}</Badge> },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <TierEngagementAccessDialog
            mode="edit"
            item={row.original}
            onSuccess={refreshItems}
          >
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </TierEngagementAccessDialog>
          <TierEngagementAccessDialog
            mode="delete"
            item={row.original}
            onSuccess={refreshItems}
          >
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </TierEngagementAccessDialog>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Tier Engagement Access
            </div>
            <TierEngagementAccessDialog
              mode="add"
              onSuccess={refreshItems}
            >
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Access Rule
              </Button>
            </TierEngagementAccessDialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Manage which engagement models are available to each pricing tier.
          </p>
          <div className="text-sm text-muted-foreground">
            Total access rules: {tierEngagementAccess.length}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent>
          <DataTable columns={columns} data={tierEngagementAccess} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};