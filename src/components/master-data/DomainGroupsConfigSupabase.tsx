
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit2, Check, X, RefreshCw, Plus, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DomainGroup {
  id?: string;
  name: string;
  description?: string;
  industry_segment_id?: string;
  created_at?: string;
  updated_at?: string;
  is_user_created?: boolean;
}

const DomainGroupsConfigSupabase: React.FC = () => {
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [newDomainGroup, setNewDomainGroup] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const loadDomainGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_domain_groups')
        .select('*')
        .order('name');
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Domain Groups loaded from Supabase:', data);
      setDomainGroups(data || []);
    } catch (error) {
      console.error('Error loading domain groups:', error);
      toast({
        title: "Error",
        description: "Failed to load domain groups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDomainGroups();
  }, []);

  const handleAddDomainGroup = async () => {
    if (!newDomainGroup.name.trim()) {
      toast({
        title: "Error",
        description: "Domain group name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_domain_groups')
        .insert([{ 
          name: newDomainGroup.name.trim(),
          description: newDomainGroup.description.trim() || undefined,
          is_user_created: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Domain Group created in Supabase:', data);
      setDomainGroups(prev => [...prev, data]);
      setNewDomainGroup({ name: '', description: '' });
      setIsAdding(false);
      toast({
        title: "Success",
        description: `${newDomainGroup.name} added successfully`,
      });
    } catch (error) {
      console.error('Error adding domain group:', error);
      toast({
        title: "Error",
        description: "Failed to add domain group",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditDomainGroup = (id: string, domainGroup: DomainGroup) => {
    setEditingId(id);
    setEditingValue({ 
      name: domainGroup.name,
      description: domainGroup.description || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingValue.name.trim()) {
      toast({
        title: "Error",
        description: "Domain group name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_domain_groups')
        .update({ 
          name: editingValue.name.trim(),
          description: editingValue.description.trim() || undefined
        })
        .eq('id', editingId)
        .select()
        .single();
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Domain Group updated in Supabase:', data);
      setDomainGroups(prev => prev.map(dg => dg.id === editingId ? data : dg));
      setEditingId(null);
      setEditingValue({ name: '', description: '' });
      toast({
        title: "Success",
        description: "Domain group updated successfully",
      });
    } catch (error) {
      console.error('Error updating domain group:', error);
      toast({
        title: "Error",
        description: "Failed to update domain group",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDomainGroup = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('master_domain_groups')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Domain Group deleted from Supabase');
      setDomainGroups(prev => prev.filter(dg => dg.id !== id));
      toast({
        title: "Success",
        description: "Domain group deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting domain group:', error);
      toast({
        title: "Error",
        description: "Failed to delete domain group",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue({ name: '', description: '' });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewDomainGroup({ name: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Domain Groups Configuration
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button onClick={loadDomainGroups} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setIsAdding(true)} disabled={isAdding || loading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Domain Group
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newDomainGroup.name}
                onChange={(e) => setNewDomainGroup(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter domain group name"
                autoFocus
              />
              <Textarea
                value={newDomainGroup.description}
                onChange={(e) => setNewDomainGroup(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddDomainGroup} size="sm" disabled={loading}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={handleCancelAdd} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : domainGroups.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No domain groups configured. Add some domain groups to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {domainGroups.map((domainGroup) => (
                <div key={domainGroup.id} className="p-3 border rounded-lg">
                  {editingId === domainGroup.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        autoFocus
                      />
                      <Textarea
                        value={editingValue.description}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter description (optional)"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} size="sm" variant="outline" disabled={loading}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{domainGroup.name}</h4>
                        {domainGroup.description && (
                          <p className="text-sm text-muted-foreground mt-1">{domainGroup.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEditDomainGroup(domainGroup.id!, domainGroup)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDeleteDomainGroup(domainGroup.id!)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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

export default DomainGroupsConfigSupabase;
