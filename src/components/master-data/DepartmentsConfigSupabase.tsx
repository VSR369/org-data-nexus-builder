import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Department {
  id?: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

const DepartmentsConfigSupabase: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('master_departments')
        .select('*')
        .order('name');
      
      if (error) throw error;
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

  const handleAddDepartment = async () => {
    if (newDepartment.trim()) {
      try {
        const { error } = await supabase
          .from('master_departments')
          .insert({ name: newDepartment.trim() });

        if (error) throw error;
        
        setNewDepartment('');
        setIsAdding(false);
        loadDepartments();
        toast({
          title: "Success",
          description: "Department added successfully",
        });
      } catch (error) {
        console.error('Error adding department:', error);
        toast({
          title: "Error",
          description: "Failed to add department",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditDepartment = (id: string, name: string) => {
    setEditingId(id);
    setEditingValue(name);
  };

  const handleSaveEdit = async () => {
    if (editingId && editingValue.trim()) {
      try {
        const { error } = await supabase
          .from('master_departments')
          .update({ name: editingValue.trim() })
          .eq('id', editingId);

        if (error) throw error;
        
        setEditingId(null);
        setEditingValue('');
        loadDepartments();
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
      }
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('master_departments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      loadDepartments();
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
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewDepartment('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Departments Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={loadDepartments} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || loading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>

          {isAdding && (
            <div className="flex items-center gap-2 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="Enter department name"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddDepartment();
                  } else if (e.key === 'Escape') {
                    handleCancelAdd();
                  }
                }}
                autoFocus
              />
              <Button onClick={handleAddDepartment} size="sm" disabled={loading}>
                <Check className="h-4 w-4" />
              </Button>
              <Button onClick={handleCancelAdd} size="sm" variant="outline">
                <X className="h-4 w-4" />
              </Button>
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
                <div key={department.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingId === department.id ? (
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
                      <span className="font-medium">{department.name}</span>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEditDepartment(department.id!, department.name)} 
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

export default DepartmentsConfigSupabase;