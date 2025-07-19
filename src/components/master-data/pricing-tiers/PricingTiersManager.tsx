import React, { useState } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Import simplified data table component
import { usePricingTiers } from '@/hooks/useMasterDataCRUD';
import { PricingTierDialog } from './PricingTierDialog';

export const PricingTiersManager: React.FC = () => {
  const { items: tiers, loading, addItem, updateItem, deleteItem, refreshItems } = usePricingTiers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTiers = tiers.filter(tier =>
    tier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tier.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingTier(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (tier: any) => {
    setEditingTier(tier);
    setIsDialogOpen(true);
  };

  const handleSave = async (tierData: any) => {
    const success = editingTier
      ? await updateItem(editingTier.id, tierData)
      : await addItem(tierData);
    
    if (success) {
      setIsDialogOpen(false);
      setEditingTier(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Tier Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'level_order',
      header: 'Level Order',
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }: any) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.original.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.original.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
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
          <CardTitle className="flex items-center justify-between">
            Pricing Tiers Management
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={refreshItems}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Tier
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tiers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {columns.map((column, index) => (
                    <th key={index} className="p-3 text-left">{column.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="p-3 text-center">Loading...</td>
                  </tr>
                ) : filteredTiers.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="p-3 text-center">No data found</td>
                  </tr>
                ) : (
                  filteredTiers.map((tier) => (
                    <tr key={tier.id} className="border-b">
                      <td className="p-3">{tier.name}</td>
                      <td className="p-3">{tier.description}</td>
                      <td className="p-3">{tier.level_order}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tier.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tier.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(tier)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(tier.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <PricingTierDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        tier={editingTier}
        onSave={handleSave}
      />
    </div>
  );
};