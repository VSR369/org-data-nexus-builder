
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';
import { DataTable } from '@/components/ui/data-table';
import { useToast } from '@/hooks/use-toast';

interface StandardDataManagerProps {
  tableName: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  additionalColumns?: any[];
}

export const StandardDataManager: React.FC<StandardDataManagerProps> = ({
  tableName,
  title,
  description,
  icon: Icon,
  additionalColumns = []
}) => {
  const { items, loading, addItem, updateItem, deleteItem, refreshItems } = useMasterDataCRUD(tableName as any);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredItems = items.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const success = await deleteItem(id);
      if (success) {
        toast({
          title: "Success",
          description: "Item deleted successfully",
        });
      }
    }
  };

  const baseColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }: any) => (
        <div className="text-muted-foreground max-w-xs truncate">
          {row.getValue('description') || 'No description'}
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }: any) => {
        const isActive = row.getValue('is_active');
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }: any) => (
        <div className="text-muted-foreground">
          {new Date(row.getValue('created_at')).toLocaleDateString()}
        </div>
      ),
    },
    ...additionalColumns,
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
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
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
                <Icon className="w-5 h-5" />
                {title}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
                Refresh
              </Button>
              <Button onClick={handleAdd} disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {items.filter((item: any) => item.is_active !== false).length}
            </div>
            <p className="text-xs text-muted-foreground">Active Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredItems.length}</div>
            <p className="text-xs text-muted-foreground">Filtered Results</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={baseColumns}
            data={filteredItems}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
};
