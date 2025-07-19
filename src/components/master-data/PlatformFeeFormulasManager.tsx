
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calculator, Database, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { useToast } from '@/hooks/use-toast';

const PlatformFeeFormulasManager: React.FC = () => {
  const { toast } = useToast();
  const { 
    items: feeFormulas, 
    loading, 
    deleteItem, 
    refreshItems 
  } = useMasterDataCRUD('master_platform_fee_formulas');

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast({ 
        title: "Success", 
        description: "Platform fee formula deleted successfully" 
      });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: "Failed to delete platform fee formula", 
        variant: "destructive" 
      });
    }
  };

  const formatPercentage = (value: number | null) => {
    return value ? `${value}%` : '0%';
  };

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return 'N/A';
    return `${currency || 'USD'} ${amount.toLocaleString()}`;
  };

  const columns = [
    {
      accessorKey: 'formula_name',
      header: 'Formula Name',
      cell: ({ row }: any) => (
        <div className="font-medium">
          {row.getValue('formula_name')}
        </div>
      ),
    },
    {
      accessorKey: 'engagement_model_name',
      header: 'Engagement Model',
      cell: ({ row }: any) => (
        <Badge variant="outline">
          {row.getValue('engagement_model_name') || 'N/A'}
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
      accessorKey: 'base_consulting_fee',
      header: 'Base Consulting Fee',
      cell: ({ row }: any) => formatCurrency(
        row.getValue('base_consulting_fee'), 
        row.getValue('currency_code')
      ),
    },
    {
      accessorKey: 'base_management_fee',
      header: 'Base Management Fee',
      cell: ({ row }: any) => formatCurrency(
        row.getValue('base_management_fee'), 
        row.getValue('currency_code')
      ),
    },
    {
      accessorKey: 'platform_usage_fee_percentage',
      header: 'Platform Fee %',
      cell: ({ row }: any) => formatPercentage(row.getValue('platform_usage_fee_percentage')),
    },
    {
      accessorKey: 'advance_payment_percentage',
      header: 'Advance %',
      cell: ({ row }: any) => formatPercentage(row.getValue('advance_payment_percentage')),
    },
    {
      accessorKey: 'membership_discount_percentage',
      header: 'Member Discount %',
      cell: ({ row }: any) => formatPercentage(row.getValue('membership_discount_percentage')),
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
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
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
            <Calculator className="w-8 h-8 text-primary" />
            Platform Fee Formulas
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage platform fee calculation formulas and pricing parameters for different engagement models
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
            <Database className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Formula
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {feeFormulas.filter((formula: any) => formula.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">Active Formulas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {new Set(feeFormulas.map((formula: any) => formula.engagement_model_name)).size}
            </div>
            <p className="text-xs text-muted-foreground">Engagement Models</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {new Set(feeFormulas.map((formula: any) => formula.country_name)).size}
            </div>
            <p className="text-xs text-muted-foreground">Countries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {feeFormulas.filter((formula: any) => formula.membership_discount_percentage > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">With Discounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Formula Expression Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Formula Expression Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feeFormulas.slice(0, 4).map((formula: any) => (
              <div key={formula.id} className="p-4 border rounded-lg">
                <h4 className="font-semibold text-sm mb-2">{formula.formula_name}</h4>
                <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                  {formula.formula_expression || 'No expression defined'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          {feeFormulas.length === 0 && !loading ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Platform Fee Formulas Found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first platform fee formula to start calculating pricing for engagement models.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First Formula
              </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={feeFormulas}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformFeeFormulasManager;
