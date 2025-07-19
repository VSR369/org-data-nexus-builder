import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Shield, Upload, Download } from 'lucide-react';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { TierEngagementRestrictionDialog } from './TierEngagementRestrictionDialog';

export const TierEngagementModelRestrictionsManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const {
    items: restrictions,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refreshItems
  } = useMasterDataCRUD('tier_engagement_model_restrictions');

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (restriction: any) => {
    setEditingItem(restriction);
    setIsDialogOpen(true);
  };

  const handleSave = async (restrictionData: any) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, restrictionData);
      } else {
        await addItem(restrictionData);
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save tier engagement restriction:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this restriction?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Failed to delete tier engagement restriction:', error);
      }
    }
  };

  const columns = [
    {
      accessorKey: 'pricing_tier_id',
      header: 'Pricing Tier',
      cell: ({ row }: any) => (
        <span className="text-muted-foreground">
          Tier ID: {row.getValue('pricing_tier_id')}
        </span>
      ),
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
      accessorKey: 'engagement_model_subtype_id',
      header: 'Subtype',
      cell: ({ row }: any) => {
        const subtypeId = row.getValue('engagement_model_subtype_id');
        return subtypeId ? (
          <span className="text-muted-foreground">
            Subtype ID: {subtypeId}
          </span>
        ) : (
          <span className="text-muted-foreground">All Subtypes</span>
        );
      },
    },
    {
      accessorKey: 'is_allowed',
      header: 'Access',
      cell: ({ row }: any) => (
        <Badge variant={row.getValue('is_allowed') ? 'default' : 'destructive'}>
          {row.getValue('is_allowed') ? 'Allowed' : 'Restricted'}
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

  const allowedCount = restrictions.filter((r: any) => r.is_allowed).length;
  const restrictedCount = restrictions.length - allowedCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Tier Engagement Model Restrictions
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Configure which engagement models are available for each pricing tier
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
                <Shield className="h-4 w-4 mr-2" />
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
                Add Restriction
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{restrictions.length}</div>
            <p className="text-xs text-muted-foreground">Total Rules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{allowedCount}</div>
            <p className="text-xs text-muted-foreground">Allowed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{restrictedCount}</div>
            <p className="text-xs text-muted-foreground">Restricted</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={restrictions}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <TierEngagementRestrictionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        restriction={editingItem}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};