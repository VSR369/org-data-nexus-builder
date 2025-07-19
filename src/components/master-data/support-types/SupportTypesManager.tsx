import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Headphones, Upload, Download } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { SupportTypeDialog } from './SupportTypeDialog';
import { SupportTypesTest } from './SupportTypesTest';
import { useToast } from '@/hooks/use-toast';

export const SupportTypesManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const { toast } = useToast();
  
  const {
    items: supportTypes,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refreshItems
  } = useMasterDataCRUD('master_support_types');

  console.log('SupportTypesManager - supportTypes:', supportTypes);
  console.log('SupportTypesManager - loading:', loading);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (supportType: any) => {
    setEditingItem(supportType);
    setIsDialogOpen(true);
  };

  const handleSave = async (supportTypeData: any) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, supportTypeData);
        toast({
          title: "Success",
          description: "Support type updated successfully",
        });
      } else {
        await addItem(supportTypeData);
        toast({
          title: "Success",
          description: "Support type created successfully",
        });
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save support type",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast({
        title: "Success",
        description: "Support type deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete support type",
        variant: "destructive",
      });
    }
  };

  const getServiceLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'basic':
        return 'bg-green-100 text-green-800';
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
      accessorKey: 'service_level',
      header: 'Service Level',
      cell: ({ row }: any) => (
        <Badge className={getServiceLevelColor(row.getValue('service_level'))}>
          {row.getValue('service_level')}
        </Badge>
      ),
    },
    {
      accessorKey: 'availability',
      header: 'Availability',
      cell: ({ row }: any) => (
        <span className="text-muted-foreground">
          {row.getValue('availability') || 'Not specified'}
        </span>
      ),
    },
    {
      accessorKey: 'response_time',
      header: 'Response Time',
      cell: ({ row }: any) => (
        <span className="text-muted-foreground">
          {row.getValue('response_time') || 'Not specified'}
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
      <SupportTypesTest />
      
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                Support Types
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Configure customer support service levels and response times
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
                <Headphones className="h-4 w-4 mr-2" />
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
                Add Support Type
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{supportTypes.length}</div>
            <p className="text-xs text-muted-foreground">Total Support Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {supportTypes.filter((s: any) => s.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">Active Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {supportTypes.filter((s: any) => s.service_level === 'premium').length}
            </div>
            <p className="text-xs text-muted-foreground">Premium Level</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {supportTypes.filter((s: any) => s.service_level === 'standard').length}
            </div>
            <p className="text-xs text-muted-foreground">Standard Level</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 text-sm text-muted-foreground">
            Loading: {loading ? 'Yes' : 'No'} | Data count: {supportTypes.length}
          </div>
          <DataTable
            columns={columns}
            data={supportTypes}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <SupportTypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        supportType={editingItem}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};