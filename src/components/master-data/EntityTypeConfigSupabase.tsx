
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EntityType {
  id: string;
  name: string;
}

const EntityTypeConfigSupabase: React.FC = () => {
  const [entityTypes, setEntityTypes] = useState<EntityType[]>([]);
  const [loading, setLoading] = useState(false);
  const [newEntityType, setNewEntityType] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const fetchEntityTypes = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching entity types from Supabase...');
      
      const { data, error } = await supabase
        .from('master_entity_types')
        .select('*')
        .order('name');

      if (error) {
        console.error('❌ Error fetching entity types:', error);
        throw error;
      }

      console.log('✅ CRUD TEST - Entity Types loaded from Supabase:', data);
      setEntityTypes(data || []);

      // If no data exists, insert some default data
      if (!data || data.length === 0) {
        console.log('No entity types found, attempting to insert default data...');
        await insertDefaultData();
      }
    } catch (error) {
      console.error('Error loading entity types:', error);
      toast({
        title: "Error",
        description: "Failed to load entity types",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const insertDefaultData = async () => {
    try {
      const defaultEntityTypes = [
        { name: 'Corporation' },
        { name: 'LLC' },
        { name: 'Partnership' },
        { name: 'Sole Proprietorship' },
        { name: 'Non-Profit' }
      ];
      
      const { data, error } = await supabase
        .from('master_entity_types')
        .insert(defaultEntityTypes)
        .select();
        
      if (error) {
        console.error('Error inserting default entity types:', error);
        throw error;
      }
      
      console.log('✅ Default entity types inserted successfully');
      setEntityTypes(data || []);
    } catch (error) {
      console.error('Error inserting default data:', error);
    }
  };

  useEffect(() => {
    fetchEntityTypes();
  }, []);

  const handleAddEntityType = async () => {
    if (!newEntityType.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_entity_types')
        .insert([{ name: newEntityType.trim() }])
        .select()
        .single();

      if (error) throw error;

      setEntityTypes(prev => [...prev, data]);
      setNewEntityType('');
      setIsAdding(false);
      
      toast({
        title: "Success",
        description: `${newEntityType} added successfully`,
      });
    } catch (error) {
      console.error('Error adding entity type:', error);
      toast({
        title: "Error",
        description: "Failed to add entity type",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditEntityType = (id: string, name: string) => {
    setEditingId(id);
    setEditingValue(name);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingValue.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_entity_types')
        .update({ name: editingValue.trim() })
        .eq('id', editingId)
        .select()
        .single();

      if (error) throw error;

      setEntityTypes(prev => prev.map(entityType => 
        entityType.id === editingId ? data : entityType
      ));
      setEditingId(null);
      setEditingValue('');
      
      toast({
        title: "Success",
        description: "Entity type updated successfully",
      });
    } catch (error) {
      console.error('Error updating entity type:', error);
      toast({
        title: "Error",
        description: "Failed to update entity type",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntityType = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entity type?')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('master_entity_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntityTypes(prev => prev.filter(entityType => entityType.id !== id));
      
      toast({
        title: "Success",
        description: "Entity type deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting entity type:', error);
      toast({
        title: "Error",
        description: "Failed to delete entity type",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewEntityType('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Entity Types Configuration (Supabase)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={fetchEntityTypes} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || loading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entity Type
            </Button>
          </div>

          {isAdding && (
            <div className="flex items-center gap-2 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newEntityType}
                onChange={(e) => setNewEntityType(e.target.value)}
                placeholder="Enter entity type name"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddEntityType();
                  } else if (e.key === 'Escape') {
                    handleCancelAdd();
                  }
                }}
                autoFocus
              />
              <Button onClick={handleAddEntityType} size="sm" disabled={loading}>
                <Check className="h-4 w-4" />
              </Button>
              <Button onClick={handleCancelAdd} size="sm" variant="outline">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : entityTypes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No entity types configured. Add some entity types to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {entityTypes.map((entityType) => (
                <div key={entityType.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingId === entityType.id ? (
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
                      <span className="font-medium">{entityType.name}</span>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEditEntityType(entityType.id, entityType.name)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDeleteEntityType(entityType.id)} 
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

export default EntityTypeConfigSupabase;
