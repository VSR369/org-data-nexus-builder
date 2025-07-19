import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database as DatabaseIcon, Plus, Grid, Table, Edit, Trash2 } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { TierConfigurationDialog } from './TierConfigurationDialog';
import { TierConfigurationCard } from './TierConfigurationCard';

export const TierConfigurationsManager: React.FC = () => {
  const { items: tierConfigurations, loading, refreshItems } = useMasterDataCRUD('master_tier_configurations');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

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
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <DatabaseIcon className="w-5 h-5" />
              Tier Configurations
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="h-8 px-2"
                  aria-label="Card view"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 px-2"
                  aria-label="Table view"
                >
                  <Table className="w-4 h-4" />
                </Button>
              </div>
              <TierConfigurationDialog
                mode="add"
                onSuccess={refreshItems}
              >
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Configuration</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </TierConfigurationDialog>
            </div>
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

      {/* Content */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-80 animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : tierConfigurations.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No tier configurations found</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            tierConfigurations.map((item) => (
              <TierConfigurationCard
                key={item.id}
                item={item}
                onRefresh={refreshItems}
              />
            ))
          )}
        </div>
      ) : (
        <Card>
          <CardContent>
            <DataTable columns={columns} data={tierConfigurations} loading={loading} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};