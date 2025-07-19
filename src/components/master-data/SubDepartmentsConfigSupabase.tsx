
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

const SubDepartmentsConfigSupabase: React.FC = () => {
  const [newSubDept, setNewSubDept] = useState({ name: '', description: '', department_id: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '', department_id: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subDepartments = [], isLoading, refetch } = useQuery({
    queryKey: ['sub-departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_sub_departments')
        .select(`
          *,
          department:master_departments(name)
        `)
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments-for-subdepts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_departments')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (subDept: { name: string; description: string; department_id: string }) => {
      const { data, error } = await supabase
        .from('master_sub_departments')
        .insert([{ 
          name: subDept.name.trim(), 
          description: subDept.description.trim() || null,
          department_id: subDept.department_id
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-departments'] });
      setNewSubDept({ name: '', description: '', department_id: '' });
      setIsAdding(false);
      toast({ title: "Success", description: "Sub-department added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to add sub-department", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, subDept }: { id: string; subDept: { name: string; description: string; department_id: string } }) => {
      const { data, error } = await supabase
        .from('master_sub_departments')
        .update({ 
          name: subDept.name.trim(), 
          description: subDept.description.trim() || null,
          department_id: subDept.department_id
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-departments'] });
      setEditingId(null);
      setEditingValue({ name: '', description: '', department_id: '' });
      toast({ title: "Success", description: "Sub-department updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to update sub-department", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_sub_departments')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-departments'] });
      toast({ title: "Success", description: "Sub-department deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to delete sub-department", variant: "destructive" });
    }
  });

  const handleAdd = () => {
    if (newSubDept.name.trim() && newSubDept.department_id) {
      addMutation.mutate(newSubDept);
    }
  };

  const handleEdit = (id: string, name: string, description: string, department_id: string) => {
    setEditingId(id);
    setEditingValue({ name, description: description || '', department_id });
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.name.trim() && editingValue.department_id) {
      updateMutation.mutate({ id: editingId, subDept: editingValue });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sub-department?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sub-Departments Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sub-Department
            </Button>
          </div>

          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newSubDept.name}
                onChange={(e) => setNewSubDept(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter sub-department name"
                autoFocus
              />
              <Select value={newSubDept.department_id} onValueChange={(value) => setNewSubDept(prev => ({ ...prev, department_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department *" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={newSubDept.description}
                onChange={(e) => setNewSubDept(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAdd} size="sm" disabled={addMutation.isPending || !newSubDept.department_id}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={() => { setIsAdding(false); setNewSubDept({ name: '', description: '', department_id: '' }); }} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : subDepartments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No sub-departments configured. Add some sub-departments to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {subDepartments.map((subDept) => (
                <div key={subDept.id} className="p-4 border rounded-lg">
                  {editingId === subDept.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Sub-department name"
                        autoFocus
                      />
                      <Select value={editingValue.department_id} onValueChange={(value) => setEditingValue(prev => ({ ...prev, department_id: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department *" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
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
                        <Button onClick={handleSaveEdit} size="sm" disabled={updateMutation.isPending || !editingValue.department_id}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => { setEditingId(null); setEditingValue({ name: '', description: '', department_id: '' }); }} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{subDept.name}</h4>
                        {subDept.department?.name && (
                          <p className="text-sm text-blue-600 mt-1">Department: {subDept.department.name}</p>
                        )}
                        {subDept.description && (
                          <p className="text-sm text-muted-foreground mt-1">{subDept.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEdit(subDept.id, subDept.name, subDept.description || '', subDept.department_id)} 
                          size="sm" 
                          variant="outline"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(subDept.id)} 
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

export default SubDepartmentsConfigSupabase;
