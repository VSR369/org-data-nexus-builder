import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, BarChart3, Upload, Download } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { AnalyticsAccessTypeDialog } from './AnalyticsAccessTypeDialog';
import { useToast } from '@/hooks/use-toast';

export const AnalyticsAccessTypesManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const { toast } = useToast();
  
  const {
    items: analyticsAccessTypes,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refreshItems
  } = useMasterDataCRUD('master_analytics_access_types');

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (accessType: any) => {
    setEditingItem(accessType);
    setIsDialogOpen(true);
  };

  const handleSave = async (accessTypeData: any) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, accessTypeData);
        toast({
          title: "Success",
          description: "Analytics access type updated successfully",
        });
      } else {
        await addItem(accessTypeData);
        toast({
          title: "Success",
          description: "Analytics access type created successfully",
        });
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save analytics access type",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast({
        title: "Success",
        description: "Analytics access type deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete analytics access type",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'dashboard_access',
      header: 'Dashboard Access',
      cell: ({ row }: any) => (
        <Badge variant={row.getValue('dashboard_access') ? 'default' : 'secondary'}>
          {row.getValue('dashboard_access') ? 'Enabled' : 'Disabled'}
        </Badge>
      ),
    },
    {
      accessorKey: 'features_included',
      header: 'Features',
      cell: ({ row }: any) => {
        const features = row.getValue('features_included') || [];
        return (
          <div className="flex flex-wrap gap-1">
            {features.length > 0 ? features.slice(0, 3).map((feature: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            )) : <span className="text-muted-foreground">None</span>}
            {features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{features.length - 3} more
              </Badge>
            )}
          </div>
        );
      },
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
                <BarChart3 className="w-5 h-5" />
                Analytics Access Types
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Define analytics dashboard access levels and features
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
                <BarChart3 className="h-4 w-4 mr-2" />
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
                Add Access Type
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{analyticsAccessTypes.length}</div>
            <p className="text-xs text-muted-foreground">Total Access Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {analyticsAccessTypes.filter((a: any) => a.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">Active Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {analyticsAccessTypes.filter((a: any) => a.dashboard_access).length}
            </div>
            <p className="text-xs text-muted-foreground">Dashboard Access</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {analyticsAccessTypes.reduce((sum: number, a: any) => sum + (a.features_included?.length || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total Features</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={analyticsAccessTypes}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <AnalyticsAccessTypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        accessType={editingItem}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};