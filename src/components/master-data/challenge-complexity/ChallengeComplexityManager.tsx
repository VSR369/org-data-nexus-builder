import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Upload, Download } from 'lucide-react';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { ChallengeComplexityDialog } from './ChallengeComplexityDialog';

export const ChallengeComplexityManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const {
    items: complexityLevels,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refreshItems
  } = useMasterDataCRUD('master_challenge_complexity');

  const handleAdd = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, data);
      } else {
        await addItem(data);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving challenge complexity:', error);
    }
  };

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.original.name}</span>
          {!row.original.is_active && (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Level Order',
      accessorKey: 'level_order',
      cell: ({ row }: { row: any }) => (
        <Badge variant="outline">{row.original.level_order}</Badge>
      ),
    },
    {
      header: 'Management Fee Multiplier',
      accessorKey: 'management_fee_multiplier',
      cell: ({ row }: { row: any }) => (
        <span className="font-mono">{row.original.management_fee_multiplier}x</span>
      ),
    },
    {
      header: 'Consulting Fee Multiplier',
      accessorKey: 'consulting_fee_multiplier',
      cell: ({ row }: { row: any }) => (
        <span className="font-mono">{row.original.consulting_fee_multiplier}x</span>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ row }: { row: any }) => (
        <span className="text-sm text-muted-foreground max-w-xs truncate block">
          {row.original.description}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Challenge Complexity Levels
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage complexity levels and their fee multipliers for dynamic pricing calculations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshItems}
                className="flex items-center gap-2"
                disabled={loading}
              >
                <Settings className="h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleAdd} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Complexity Level
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={complexityLevels}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <ChallengeComplexityDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        complexity={editingItem}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};