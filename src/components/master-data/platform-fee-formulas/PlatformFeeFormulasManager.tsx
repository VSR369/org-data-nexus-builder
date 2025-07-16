import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calculator, Upload, Download } from 'lucide-react';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { PlatformFeeFormulaDialog } from './PlatformFeeFormulaDialog';

export const PlatformFeeFormulasManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const {
    items: formulas,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refreshItems
  } = useMasterDataCRUD('master_platform_fee_formulas');

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (formula: any) => {
    setEditingItem(formula);
    setIsDialogOpen(true);
  };

  const handleSave = async (formulaData: any) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, formulaData);
      } else {
        await addItem(formulaData);
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save platform fee formula:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this platform fee formula?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Failed to delete platform fee formula:', error);
      }
    }
  };

  const columns = [
    {
      accessorKey: 'formula_name',
      header: 'Formula Name',
    },
    {
      accessorKey: 'engagement_model_id',
      header: 'Engagement Model',
      cell: ({ row }: any) => (
        <span className="text-muted-foreground">
          Model ID: {row.getValue('engagement_model_id')}
        </span>
      ),
    },
    {
      accessorKey: 'formula_expression',
      header: 'Formula Expression',
      cell: ({ row }: any) => (
        <code className="bg-muted px-2 py-1 rounded text-sm">
          {row.getValue('formula_expression')}
        </code>
      ),
    },
    {
      accessorKey: 'variables',
      header: 'Variables',
      cell: ({ row }: any) => {
        const variables = row.getValue('variables') as Record<string, any>;
        return (
          <div className="flex flex-wrap gap-1">
            {Object.keys(variables || {}).map((key) => (
              <Badge key={key} variant="outline" className="text-xs">
                {key}
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
                <Calculator className="w-5 h-5" />
                Platform Fee Formulas
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Configure dynamic formulas for calculating platform fees based on variables
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
                <Calculator className="h-4 w-4 mr-2" />
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
                Add Formula
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
            data={formulas}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <PlatformFeeFormulaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formula={editingItem}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};