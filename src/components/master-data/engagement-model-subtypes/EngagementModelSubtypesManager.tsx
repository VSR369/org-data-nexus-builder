import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Upload, Download } from 'lucide-react';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { EngagementModelSubtypeDialog } from './EngagementModelSubtypeDialog';

export const EngagementModelSubtypesManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const {
    items: subtypes,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refreshItems
  } = useMasterDataCRUD('master_engagement_model_subtypes');

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (subtype: any) => {
    setEditingItem(subtype);
    setIsDialogOpen(true);
  };

  const handleSave = async (subtypeData: any) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, subtypeData);
      } else {
        await addItem(subtypeData);
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save engagement model subtype:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this engagement model subtype?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Failed to delete engagement model subtype:', error);
      }
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'engagement_model_id',
      header: 'Engagement Model',
      cell: ({ row }: any) => {
        // This would be populated by joining with engagement models
        return <span className="text-muted-foreground">Model ID: {row.getValue('engagement_model_id')}</span>;
      },
    },
    {
      accessorKey: 'required_fields',
      header: 'Required Fields',
      cell: ({ row }: any) => {
        const fields = row.getValue('required_fields') as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {fields?.map((field: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {field}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'optional_fields',
      header: 'Optional Fields',
      cell: ({ row }: any) => {
        const fields = row.getValue('optional_fields') as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {fields?.map((field: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {field}
              </Badge>
            ))}
          </div>
        );
      },
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
                <Settings className="w-5 h-5" />
                Engagement Model Subtypes
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Configure subtypes for engagement models with specific field requirements
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
                <Settings className="h-4 w-4 mr-2" />
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
                Add Subtype
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={subtypes}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <EngagementModelSubtypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        subtype={editingItem}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};