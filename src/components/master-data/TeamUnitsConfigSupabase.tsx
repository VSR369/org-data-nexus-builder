
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const TeamUnitsConfigSupabase: React.FC = () => {
  const [newUnit, setNewUnit] = useState({ name: '', description: '', sub_department_id: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '', sub_department_id: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teamUnits = [], isLoading, refetch } = useQuery({
    queryKey: ['team-units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_team_units')
        .select(`
          *,
          sub_department:master_sub_departments(name)
        `)
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: subDepartments = [] } = useQuery({
    queryKey: ['sub-departments-for-units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_sub_departments')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (unit: { name: string; description: string; sub_department_id: string }) => {
      const { data, error } = await supabase
        .from('master_team_units')
        .insert([{ 
          name: unit.name.trim(), 
          description: unit.description.trim() || null,
          sub_department_id: unit.sub_department_id
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-units'] });
      setNewUnit({ name: '', description: '', sub_department_id: '' });
      setIsAdding(false);
      toast({ title: "Success", description: "Team unit added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add team unit", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, unit }: { id: string; unit: { name: string; description: string; sub_department_id: string } }) => {
      const { data, error } = await supabase
        .from('master_team_units')
        .update({ 
          name: unit.name.trim(), 
          description: unit.description.trim() || null,
          sub_department_id: unit.sub_department_id
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-units'] });
      setEditingId(null);
      setEditingValue({ name: '', description: '', sub_department_id: '' });
      toast({ title: "Success", description: "Team unit updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update team unit", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_team_units')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-units'] });
      toast({ title: "Success", description: "Team unit deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete team unit", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newUnit.name.trim() && newUnit.sub_department_id) {
      addMutation.mutate(newUnit);
    }
  };

  const handleEdit = (id: string, name: string, description: string, sub_department_id: string) => {
    setEditingId(id);
    setEditingValue({ name, description: description || '', sub_department_id });
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.name.trim() && editingValue.sub_department_id) {
      updateMutation.mutate({ id: editingId, unit: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this team unit?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Units Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Unit
            </Button>
          </div>

          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newUnit.name}
                onChange={(e) => setNewUnit(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter team unit name"
                autoFocus
              />
              <Select value={newUnit.sub_department_id} onValueChange={(value) => setNewUnit(prev => ({ ...prev, sub_department_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-department *" />
                </SelectTrigger>
                <SelectContent>
                  {subDepartments.map((subDept) => (
                    <SelectItem key={subDept.id} value={subDept.id}>{subDept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={newUnit.description}
                onChange={(e) => setNewUnit(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending || !newUnit.sub_department_id}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={() => { setIsAdding(false); setNewUnit({ name: '', description: '', sub_department_id: '' }); }} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : teamUnits.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No team units configured. Add some team units to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {teamUnits.map((unit) => (
                <div key={unit.id} className="p-4 border rounded-lg">
                  {editingId === unit.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Team unit name"
                        autoFocus
                      />
                      <Select value={editingValue.sub_department_id} onValueChange={(value) => setEditingValue(prev => ({ ...prev, sub_department_id: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub-department *" />
                        </SelectTrigger>
                        <SelectContent>
                          {subDepartments.map((subDept) => (
                            <SelectItem key={subDept.id} value={subDept.id}>{subDept.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        value={editingValue.description}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description (optional)"
                        rows={2}
                      />
                      <div className="flex items-center gap-2">
                        <Button onClick={handleSaveEdit} size="sm" disabled={updateMutation.isPending || !editingValue.sub_department_id}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => { setEditingId(null); setEditingValue({ name: '', description: '', sub_department_id: '' }); }} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{unit.name}</h4>
                        {unit.sub_department?.name && (
                          <p className="text-sm text-blue-600 mt-1">Sub-Department: {unit.sub_department.name}</p>
                        )}
                        {unit.description && (
                          <p className="text-sm text-muted-foreground mt-1">{unit.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEdit(unit.id, unit.name, unit.description || '', unit.sub_department_id)} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(unit.id)} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
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

export default TeamUnitsConfigSupabase;
