
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, Edit, Trash2, Save, X, RotateCcw, Search, 
  Settings, Target, AlertTriangle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EngagementModel {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  is_user_created?: boolean;
  created_by?: string;
  version?: number;
  created_at?: string;
  updated_at?: string;
  subtypes?: EngagementModelSubtype[];
  fee_mappings?: FeeMapping[];
}

interface EngagementModelSubtype {
  id: string;
  name: string;
  description?: string;
  engagement_model_id: string;
  required_fields?: any;
  optional_fields?: any;
  is_active: boolean;
  is_user_created?: boolean;
  created_by?: string;
  version?: number;
  created_at?: string;
  updated_at?: string;
}

interface FeeMapping {
  id: string;
  fee_component_id: string;
  calculation_order: number;
  is_required: boolean;
  fee_component?: {
    name: string;
    component_type: string;
  };
}

const EngagementModelsConfigSupabase = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<EngagementModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [newModel, setNewModel] = useState({ 
    name: '', 
    description: '', 
    is_active: true 
  });
  const [editingItem, setEditingItem] = useState<EngagementModel | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, item: EngagementModel} | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      
      // Fetch engagement models with related data
      const { data: modelsData, error: modelsError } = await supabase
        .from('master_engagement_models')
        .select(`
          *,
          subtypes:master_engagement_model_subtypes(*),
          fee_mappings:engagement_model_fee_mapping(
            *,
            fee_component:master_fee_components(name, component_type)
          )
        `)
        .order('name');

      if (modelsError) throw modelsError;

      setModels(modelsData || []);
      console.log('✅ Engagement Models loaded:', modelsData);
    } catch (error) {
      console.error('Error fetching engagement models:', error);
      toast({
        title: "Error",
        description: "Failed to load engagement models.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddModel = async () => {
    if (newModel.name.trim()) {
      try {
        const duplicate = models.find(m => 
          m.name.toLowerCase() === newModel.name.trim().toLowerCase()
        );
        
        if (duplicate) {
          toast({
            title: "Duplicate Entry",
            description: "An engagement model with this name already exists.",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('master_engagement_models')
          .insert([{
            name: newModel.name.trim(),
            description: newModel.description.trim() || null,
            is_active: newModel.is_active
          }]);

        if (error) throw error;

        setNewModel({ name: '', description: '', is_active: true });
        setIsAdding(false);
        fetchModels();
        toast({
          title: "Success",
          description: "Engagement model added successfully",
        });
      } catch (error) {
        console.error('Error adding engagement model:', error);
        toast({
          title: "Error",
          description: "Failed to add engagement model.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (item: EngagementModel) => {
    setEditingItem({ ...item });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      const { error } = await supabase
        .from('master_engagement_models')
        .update({
          name: editingItem.name.trim(),
          description: editingItem.description?.trim() || null,
          is_active: editingItem.is_active
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      setEditingItem(null);
      setShowEditDialog(false);
      fetchModels();
      toast({
        title: "Success",
        description: "Engagement model updated successfully",
      });
    } catch (error) {
      console.error('Error updating engagement model:', error);
      toast({
        title: "Error",
        description: "Failed to update engagement model.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (item: EngagementModel) => {
    try {
      const { error } = await supabase
        .from('master_engagement_models')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      setDeleteDialog(null);
      fetchModels();
      toast({
        title: "Deleted",
        description: "Engagement model deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting engagement model:', error);
      toast({
        title: "Error",
        description: "Failed to delete engagement model.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (item: EngagementModel) => {
    try {
      const { error } = await supabase
        .from('master_engagement_models')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;

      fetchModels();
      toast({
        title: "Status Updated",
        description: `Engagement model ${!item.is_active ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  // Filter models based on search term
  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (model.description && model.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading engagement models...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Engagement Models Manager
              </CardTitle>
              <CardDescription>
                Manage engagement models for solution delivery frameworks
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={fetchModels}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search engagement models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Engagement Models Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold">{models.length}</div>
              <div className="text-sm text-muted-foreground">Total Models</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {models.filter(m => m.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Active Models</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {models.filter(m => !m.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Inactive Models</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Model */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Engagement Models</CardTitle>
            <Button 
              onClick={() => setIsAdding(true)} 
              disabled={isAdding}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Model
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding && (
            <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="new-model-name">Model Name</Label>
                    <Input
                      id="new-model-name"
                      value={newModel.name}
                      onChange={(e) => setNewModel({...newModel, name: e.target.value})}
                      placeholder="Enter model name"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Switch
                      id="new-model-active"
                      checked={newModel.is_active}
                      onCheckedChange={(checked) => setNewModel({...newModel, is_active: checked})}
                    />
                    <Label htmlFor="new-model-active">Active</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-model-description">Description</Label>
                  <Textarea
                    id="new-model-description"
                    value={newModel.description}
                    onChange={(e) => setNewModel({...newModel, description: e.target.value})}
                    placeholder="Enter description"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-2 items-end">
                <Button onClick={handleAddModel} size="sm" className="flex items-center gap-1">
                  <Save className="w-3 h-3" />
                  Save
                </Button>
                <Button onClick={() => setIsAdding(false)} variant="outline" size="sm" className="flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Models List */}
          <div className="space-y-4">
            {filteredModels.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No engagement models found. Add some models to get started.</p>
              </div>
            ) : (
              filteredModels.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{model.name}</span>
                        <Badge variant={model.is_active ? "default" : "secondary"}>
                          {model.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {model.description && (
                        <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {model.subtypes && (
                          <span>{model.subtypes.length} subtype{model.subtypes.length !== 1 ? 's' : ''}</span>
                        )}
                        {model.fee_mappings && (
                          <span>{model.fee_mappings.length} fee mapping{model.fee_mappings.length !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleToggleStatus(model)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Switch checked={model.is_active} className="w-3 h-3" />
                      {model.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      onClick={() => handleEdit(model)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteDialog({ open: true, item: model })}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog?.open} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the engagement model "{deleteDialog?.item?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteDialog && handleDelete(deleteDialog.item)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EngagementModelsConfigSupabase;
