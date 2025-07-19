
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Database, AlertCircle } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { useToast } from '@/hooks/use-toast';

const TierConfigurationsManager: React.FC = () => {
  const { toast } = useToast();
  const { 
    items: tierConfigurations, 
    loading, 
    deleteItem, 
    refreshItems 
  } = useMasterDataCRUD('master_tier_configurations');

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast({ 
        title: "Success", 
        description: "Tier configuration deleted successfully" 
      });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: "Failed to delete tier configuration", 
        variant: "destructive" 
      });
    }
  };

  const columns = [
    {
      accessorKey: 'pricing_tier_name',
      header: 'Pricing Tier',
      cell: ({ row }: any) => (
        <Badge variant="outline">
          {row.getValue('pricing_tier_name') || 'N/A'}
        </Badge>
      ),
    },
    {
      accessorKey: 'country_name',
      header: 'Country',
    },
    {
      accessorKey: 'currency_code',
      header: 'Currency',
      cell: ({ row }: any) => (
        <Badge variant="secondary">
          {row.getValue('currency_code') || 'N/A'}
        </Badge>
      ),
    },
    {
      accessorKey: 'monthly_challenge_limit',
      header: 'Monthly Limit',
      cell: ({ row }: any) => {
        const limit = row.getValue('monthly_challenge_limit');
        return limit ? `${limit} challenges` : 'Unlimited';
      },
    },
    {
      accessorKey: 'solutions_per_challenge',
      header: 'Solutions/Challenge',
    },
    {
      accessorKey: 'fixed_charge_per_challenge',
      header: 'Fixed Charge',
      cell: ({ row }: any) => {
        const charge = row.getValue('fixed_charge_per_challenge');
        const currency = row.getValue('currency_code');
        return charge > 0 ? `${currency} ${charge}` : 'Free';
      },
    },
    {
      accessorKey: 'allows_overage',
      header: 'Overage',
      cell: ({ row }: any) => (
        <Badge variant={row.getValue('allows_overage') ? 'default' : 'secondary'}>
          {row.getValue('allows_overage') ? 'Allowed' : 'Not Allowed'}
        </Badge>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>
          {row.getValue('is_active') ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            className="text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Tier Configurations
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure pricing tier settings, limits, and access controls for different service levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
            <Database className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Configuration
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {tierConfigurations.filter((config: any) => config.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">Active Configurations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {tierConfigurations.filter((config: any) => config.allows_overage).length}
            </div>
            <p className="text-xs text-muted-foreground">Allow Overage</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {tierConfigurations.filter((config: any) => config.monthly_challenge_limit).length}
            </div>
            <p className="text-xs text-muted-foreground">With Limits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {new Set(tierConfigurations.map((config: any) => config.country_name)).size}
            </div>
            <p className="text-xs text-muted-foreground">Countries</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          {tierConfigurations.length === 0 && !loading ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Tier Configurations Found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first tier configuration to get started with pricing management.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First Configuration
              </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={tierConfigurations}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TierConfigurationsManager;
