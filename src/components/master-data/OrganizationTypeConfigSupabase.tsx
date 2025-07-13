import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { useOrganizationTypes } from '@/hooks/useMasterDataCRUD';

const OrganizationTypeConfigSupabase: React.FC = () => {
  const { items: orgTypes, loading, addItem, updateItem, deleteItem, refreshItems } = useOrganizationTypes();
  const [newOrgType, setNewOrgType] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddOrgType = async () => {
    if (newOrgType.trim()) {
      const success = await addItem({ name: newOrgType.trim() });
      if (success) {
        setNewOrgType('');
        setIsAdding(false);
      }
    }
  };

  const handleEditOrgType = (id: string, name: string) => {
    setEditingId(id);
    setEditingValue(name);
  };

  const handleSaveEdit = async () => {
    if (editingId && editingValue.trim()) {
      const success = await updateItem(editingId, { name: editingValue.trim() });
      if (success) {
        setEditingId(null);
        setEditingValue('');
      }
    }
  };

  const handleDeleteOrgType = async (id: string) => {
    await deleteItem(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewOrgType('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Types Configuration (Supabase)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || loading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Organization Type
            </Button>
          </div>

          {isAdding && (
            <div className="flex items-center gap-2 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newOrgType}
                onChange={(e) => setNewOrgType(e.target.value)}
                placeholder="Enter organization type name"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddOrgType();
                  } else if (e.key === 'Escape') {
                    handleCancelAdd();
                  }
                }}
                autoFocus
              />
              <Button onClick={handleAddOrgType} size="sm" disabled={loading}>
                <Check className="h-4 w-4" />
              </Button>
              <Button onClick={handleCancelAdd} size="sm" variant="outline">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : orgTypes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No organization types configured. Add some organization types to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {orgTypes.map((orgType) => (
                <div key={orgType.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingId === orgType.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit();
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                        autoFocus
                      />
                      <Button onClick={handleSaveEdit} size="sm" variant="outline" disabled={loading}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button onClick={handleCancelEdit} size="sm" variant="outline">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{orgType.name}</span>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEditOrgType(orgType.id!, orgType.name)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDeleteOrgType(orgType.id!)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationTypeConfigSupabase;