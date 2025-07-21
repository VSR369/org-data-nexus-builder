import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Role {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async (roleId?: string) => {
    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    try {
      if (roleId) {
        // Update existing role
        const { error } = await supabase
          .from('roles')
          .update({
            name: formData.name,
            description: formData.description || null
          })
          .eq('id', roleId);

        if (error) throw error;
        toast.success('Role updated successfully');
      } else {
        // Create new role
        const { error } = await supabase
          .from('roles')
          .insert({
            name: formData.name,
            description: formData.description || null
          });

        if (error) throw error;
        toast.success('Role created successfully');
      }

      await fetchRoles();
      setEditingRole(null);
      setShowAddForm(false);
      setFormData({ name: '', description: '' });
    } catch (error: any) {
      console.error('Error saving role:', error);
      if (error.code === '23505') {
        toast.error('Role name already exists');
      } else {
        toast.error('Failed to save role');
      }
    }
  };

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (!confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;
      
      toast.success('Role deleted successfully');
      await fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role');
    }
  };

  const handleEditRole = (role: Role) => {
    setFormData({
      name: role.name,
      description: role.description || ''
    });
    setEditingRole(role.id);
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    setShowAddForm(false);
    setFormData({ name: '', description: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Role Types</h2>
          <p className="text-muted-foreground">Manage platform role types and their descriptions</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm || editingRole !== null}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Role Type
        </Button>
      </div>

      {/* Add New Role Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Role Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Role Type Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter role type name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter role type description"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleSaveRole()}>
                <Save className="mr-2 h-4 w-4" />
                Save Role Type
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Roles List */}
      <div className="space-y-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardContent className="pt-6">
              {editingRole === role.id ? (
                /* Edit Form */
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Role Type Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter role type name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter role type description"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveRole(role.id)}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                /* Display Mode */
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{role.name}</h3>
                      <Badge variant={role.is_active ? "default" : "secondary"}>
                        {role.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {role.description && (
                      <p className="text-muted-foreground">{role.description}</p>
                    )}
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Created: {new Date(role.created_at).toLocaleDateString()}</span>
                      <span>Updated: {new Date(role.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditRole(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteRole(role.id, role.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {roles.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No role types found. Click "Add New Role Type" to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}