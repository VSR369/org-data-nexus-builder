import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Workflow, Upload, Download } from 'lucide-react';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { WorkflowTemplateDialog } from './WorkflowTemplateDialog';
import { useToast } from '@/hooks/use-toast';

export const WorkflowTemplatesManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const { toast } = useToast();
  
  const {
    items: workflowTemplates,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refreshItems
  } = useMasterDataCRUD('master_workflow_templates');

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (template: any) => {
    setEditingItem(template);
    setIsDialogOpen(true);
  };

  const handleSave = async (templateData: any) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, templateData);
        toast({
          title: "Success",
          description: "Workflow template updated successfully",
        });
      } else {
        await addItem(templateData);
        toast({
          title: "Success",
          description: "Workflow template created successfully",
        });
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save workflow template",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast({
        title: "Success",
        description: "Workflow template deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete workflow template",
        variant: "destructive",
      });
    }
  };

  const getTemplateTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'challenge':
        return 'bg-blue-100 text-blue-800';
      case 'solution':
        return 'bg-green-100 text-green-800';
      case 'engagement':
        return 'bg-purple-100 text-purple-800';
      case 'onboarding':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomizationLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
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
      accessorKey: 'template_type',
      header: 'Type',
      cell: ({ row }: any) => (
        <Badge className={getTemplateTypeColor(row.getValue('template_type'))}>
          {row.getValue('template_type')}
        </Badge>
      ),
    },
    {
      accessorKey: 'customization_level',
      header: 'Customization',
      cell: ({ row }: any) => (
        <Badge className={getCustomizationLevelColor(row.getValue('customization_level'))}>
          {row.getValue('customization_level')}
        </Badge>
      ),
    },
    {
      accessorKey: 'template_count',
      header: 'Count',
      cell: ({ row }: any) => (
        <span className="text-muted-foreground">
          {row.getValue('template_count') || 1}
        </span>
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
                <Workflow className="w-5 h-5" />
                Workflow Templates
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Manage workflow templates and customization levels
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
                <Workflow className="h-4 w-4 mr-2" />
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
                Add Template
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{workflowTemplates.length}</div>
            <p className="text-xs text-muted-foreground">Total Templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {workflowTemplates.filter((w: any) => w.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">Active Templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {workflowTemplates.filter((w: any) => w.customization_level === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">High Customization</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {workflowTemplates.reduce((sum: number, w: any) => sum + (w.template_count || 1), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total Count</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={workflowTemplates}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <WorkflowTemplateDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        template={editingItem}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};