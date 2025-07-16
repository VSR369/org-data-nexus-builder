import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database as DatabaseIcon, Plus, Edit, Trash2 } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { TierConfigurationDialog } from './TierConfigurationDialog';

export const TierConfigurationsManager: React.FC = () => {
  const { items: tierConfigurations, loading, refreshItems } = useMasterDataCRUD('master_tier_configurations');
  const [editingItem, setEditingItem] = useState<any>(null);

  const columns = [
    { accessorKey: 'pricing_tier_name', header: 'Pricing Tier' },
    { accessorKey: 'country_name', header: 'Country' },
    { accessorKey: 'monthly_challenge_limit', header: 'Monthly Limit' },
    { accessorKey: 'solutions_per_challenge', header: 'Solutions/Challenge' },
    { 
      accessorKey: 'fixed_charge_per_challenge', 
      header: 'Fixed Charge',
      cell: ({ row }: any) => {
        const amount = row.getValue('fixed_charge_per_challenge');
        const currency = row.original.currency_symbol || '$';
        return `${currency}${amount}`;
      }
    },
    { accessorKey: 'allows_overage', header: 'Allows Overage', cell: ({ row }: any) => <Badge variant={row.getValue('allows_overage') ? 'default' : 'secondary'}>{row.getValue('allows_overage') ? 'Yes' : 'No'}</Badge> },
    { accessorKey: 'is_active', header: 'Status', cell: ({ row }: any) => <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>{row.getValue('is_active') ? 'Active' : 'Inactive'}</Badge> },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <TierConfigurationDialog
            mode="edit"
            item={row.original}
            onSuccess={refreshItems}
          >
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </TierConfigurationDialog>
          <TierConfigurationDialog
            mode="delete"
            item={row.original}
            onSuccess={refreshItems}
          >
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </TierConfigurationDialog>
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
              <DatabaseIcon className="w-5 h-5" />
              Tier Configurations
            </div>
            <TierConfigurationDialog
              mode="add"
              onSuccess={refreshItems}
            >
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Configuration
              </Button>
            </TierConfigurationDialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Manage pricing tier configurations including challenge limits, charges, and feature access.
          </p>
          <div className="text-sm text-muted-foreground">
            Total configurations: {tierConfigurations.length}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent>
          <DataTable columns={columns} data={tierConfigurations} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};