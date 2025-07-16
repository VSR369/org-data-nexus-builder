import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, DollarSign, Upload, Download } from 'lucide-react';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { FeeComponentDialog } from './FeeComponentDialog';

export const FeeComponentsManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const {
    items: feeComponents,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refreshItems
  } = useMasterDataCRUD('master_fee_components');

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (component: any) => {
    setEditingItem(component);
    setIsDialogOpen(true);
  };

  const handleSave = async (componentData: any) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, componentData);
      } else {
        await addItem(componentData);
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save fee component:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this fee component?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Failed to delete fee component:', error);
      }
    }
  };

  const getComponentTypeColor = (type: string) => {
    switch (type) {
      case 'management_fee':
        return 'bg-blue-100 text-blue-800';
      case 'consulting_fee':
        return 'bg-green-100 text-green-800';
      case 'platform_fee':
        return 'bg-purple-100 text-purple-800';
      case 'advance_payment':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'component_type',
      header: 'Component Type',
      cell: ({ row }: any) => (
        <Badge className={getComponentTypeColor(row.getValue('component_type'))}>
          {row.getValue('component_type').replace('_', ' ').toUpperCase()}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Fee Components
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Manage different types of fee components for pricing calculations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
                <DollarSign className="h-4 w-4 mr-2" />
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
                Add Component
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {feeComponents.filter((c: any) => c.component_type === 'management_fee').length}
            </div>
            <p className="text-xs text-muted-foreground">Management Fees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {feeComponents.filter((c: any) => c.component_type === 'consulting_fee').length}
            </div>
            <p className="text-xs text-muted-foreground">Consulting Fees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {feeComponents.filter((c: any) => c.component_type === 'platform_fee').length}
            </div>
            <p className="text-xs text-muted-foreground">Platform Fees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {feeComponents.filter((c: any) => c.component_type === 'advance_payment').length}
            </div>
            <p className="text-xs text-muted-foreground">Advance Payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={feeComponents}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <FeeComponentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        component={editingItem}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};