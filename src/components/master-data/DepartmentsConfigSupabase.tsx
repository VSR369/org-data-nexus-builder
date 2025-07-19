
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit2, Check, X, RefreshCw, Plus, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Department {
  id?: string;
  name: string;
  description?: string;
  organization_id?: string;
  organization_name?: string;
  created_at?: string;
  updated_at?: string;
  is_user_created?: boolean;
}

const DepartmentsConfigSupabase: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '', organization_name: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '', organization_name: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_departments')
        .select('*')
        .order('name');
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Departments loaded from Supabase:', data);
      setDepartments(data || []);
    } catch (error) {
      console.error('Error loading departments:', error);
      toast({
        title: "Error",
        description: "Failed to load departments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleAddDepartment = async () => {
    if (!newDepartment.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_departments')
        .insert([{ 
          name: newDepartment.name.trim(),
          description: newDepartment.description.trim() || undefined,
          organization_name: newDepartment.organization_name.trim() || undefined,
          is_user_created: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Department created in Supabase:', data);
      setDepartments(prev => [...prev, data]);
      setNewDepartment({ name: '', description: '', organization_name: '' });
      setIsAdding(false);
      toast({
        title: "Success",
        description: `${newDepartment.name} added successfully`,
      });
    } catch (error) {
      console.error('Error adding department:', error);
      toast({
        title: "Error",
        description: "Failed to add department",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditDepartment = (id: string, department: Department) => {
    setEditingId(id);
    setEditingValue({ 
      name: department.name,
      description: department.description || '',
      organization_name: department.organization_name || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingValue.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_departments')
        .update({ 
          name: editingValue.name.trim(),
          description: editingValue.description.trim() || undefined,
          organization_name: editingValue.organization_name.trim() || undefined
        })
        .eq('id', editingId)
        .select()
        .single();
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Department updated in Supabase:', data);
      setDepartments(prev => prev.map(dept => dept.id === editingId ? data : dept));
      setEditingId(null);
      setEditingValue({ name: '', description: '', organization_name: '' });
      toast({
        title: "Success",
        description: "Department updated successfully",
      });
    } catch (error) {
      console.error('Error updating department:', error);
      toast({
        title: "Error",
        description: "Failed to update department",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('master_departments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Department deleted from Supabase');
      setDepartments(prev => prev.filter(dept => dept.id !== id));
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue({ name: '', description: '', organization_name: '' });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewDepartment({ name: '', description: '', organization_name: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Departments Configuration
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button onClick={loadDepartments} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setIsAdding(true)} disabled={isAdding || loading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newDepartment.name}
                onChange={(e) => setNewDepartment(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter department name"
                autoFocus
              />
              <Input
                value={newDepartment.organization_name}
                onChange={(e) => setNewDepartment(prev => ({ ...prev, organization_name: e.target.value }))}
                placeholder="Enter organization name (optional)"
              />
              <Textarea
                value={newDepartment.description}
                onChange={(e) => setNewDepartment(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddDepartment} size="sm" disabled={loading}>
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
          ) : departments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No departments configured. Add some departments to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {departments.map((department) => (
                <div key={department.id} className="p-3 border rounded-lg">
                  {editingId === department.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        autoFocus
                      />
                      <Input
                        value={editingValue.organization_name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, organization_name: e.target.value }))}
                        placeholder="Organization name (optional)"
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
                        <h4 className="font-medium">{department.name}</h4>
                        {department.organization_name && (
                          <p className="text-sm text-blue-600 mt-1">Organization: {department.organization_name}</p>
                        )}
                        {department.description && (
                          <p className="text-sm text-muted-foreground mt-1">{department.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEditDepartment(department.id!, department)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDeleteDepartment(department.id!)} 
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

export default DepartmentsConfigSupabase;
