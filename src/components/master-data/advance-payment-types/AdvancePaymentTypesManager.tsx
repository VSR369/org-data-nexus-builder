import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, CreditCard, Upload, Download } from 'lucide-react';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { AdvancePaymentTypeDialog } from './AdvancePaymentTypeDialog';

export const AdvancePaymentTypesManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const {
    items: paymentTypes,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refreshItems
  } = useMasterDataCRUD('master_advance_payment_types');

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (paymentType: any) => {
    setEditingItem(paymentType);
    setIsDialogOpen(true);
  };

  const handleSave = async (paymentTypeData: any) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, paymentTypeData);
      } else {
        await addItem(paymentTypeData);
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save advance payment type:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this advance payment type?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Failed to delete advance payment type:', error);
      }
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'percentage_of_platform_fee',
      header: 'Percentage of Platform Fee',
      cell: ({ row }: any) => (
        <Badge variant="outline">
          {row.getValue('percentage_of_platform_fee')}%
        </Badge>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }: any) => (
        <span className="text-muted-foreground max-w-xs truncate">
          {row.getValue('description') || 'No description'}
        </span>
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
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }: any) => (
        <span className="text-muted-foreground">
          {new Date(row.getValue('created_at')).toLocaleDateString()}
        </span>
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
            onClick={() => handleEdit(row.original)}
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

  const averagePercentage = paymentTypes.length > 0 
    ? paymentTypes.reduce((sum: number, pt: any) => sum + (pt.percentage_of_platform_fee || 0), 0) / paymentTypes.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Advance Payment Types
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Configure advance payment requirements as percentage of platform fees
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
                <CreditCard className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleAddNew} disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Type
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{paymentTypes.length}</div>
            <p className="text-xs text-muted-foreground">Total Payment Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {paymentTypes.filter((pt: any) => pt.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">Active Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{averagePercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average Percentage</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={paymentTypes}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <AdvancePaymentTypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        paymentType={editingItem}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};