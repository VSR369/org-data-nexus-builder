import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, DollarSign, Upload, Download } from 'lucide-react';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { FeeComponentDialog } from './FeeComponentDialog';
import { DependencyCheckDialog } from './DependencyCheckDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const FeeComponentsManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDependencyDialogOpen, setIsDependencyDialogOpen] = useState(false);
  const [dependencyCheckData, setDependencyCheckData] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const { toast } = useToast();
  
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
        toast({
          title: "Success",
          description: "Fee component updated successfully",
        });
      } else {
        await addItem(componentData);
        toast({
          title: "Success",
          description: "Fee component created successfully",
        });
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      console.error('Failed to save fee component:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save fee component",
        variant: "destructive",
      });
    }
  };

  const checkDependencies = async (component: any) => {
    try {
      const { data, error } = await supabase
        .rpc('check_fee_component_dependencies', { component_id: component.id });
      
      if (error) throw error;
      
      setDependencyCheckData({
        component,
        dependencies: data
      });
      setIsDependencyDialogOpen(true);
    } catch (error: any) {
      console.error('Failed to check dependencies:', error);
      toast({
        title: "Error",
        description: "Failed to check component dependencies",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const component = feeComponents.find((c: any) => c.id === id);
    if (!component) return;
    
    await checkDependencies(component);
  };

  const handleConfirmDelete = async (componentId: string, cascadeDelete: boolean = false) => {
    setDeleteLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('safe_delete_fee_component', { 
          component_id: componentId,
          cascade_delete: cascadeDelete 
        });
      
      if (error) throw error;
      
      const result = data as { success: boolean; error?: string; message?: string };
      
      if (result.success) {
        await refreshItems();
        toast({
          title: "Success",
          description: "Fee component deleted successfully",
        });
        setIsDependencyDialogOpen(false);
        setDependencyCheckData(null);
      } else {
        throw new Error(result.error || 'Failed to delete fee component');
      }
    } catch (error: any) {
      console.error('Failed to delete fee component:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete fee component",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
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
      <div className="grid grid-cols-3 gap-4">
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
              {feeComponents.filter((c: any) => c.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">Active Components</p>
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
      
      {/* Dependency Check Dialog */}
      <DependencyCheckDialog
        open={isDependencyDialogOpen}
        onOpenChange={setIsDependencyDialogOpen}
        component={dependencyCheckData?.component}
        dependencies={dependencyCheckData?.dependencies}
        onConfirmDelete={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
};