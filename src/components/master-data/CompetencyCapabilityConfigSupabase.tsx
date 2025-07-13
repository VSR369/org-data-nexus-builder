import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Save, X, Award, Brain } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CompetencyCapability {
  id?: string;
  name: string;
  description?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

const CATEGORY_OPTIONS = [
  'Technical',
  'Management', 
  'Soft Skills',
  'Leadership',
  'Business',
  'Communication',
  'Analytical',
  'Creative',
  'Other'
];

const CompetencyCapabilityConfigSupabase = () => {
  const { toast } = useToast();
  const [capabilities, setCapabilities] = useState<CompetencyCapability[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingCategory, setEditingCategory] = useState('');
  const [newCapability, setNewCapability] = useState({ name: '', description: '', category: '' });
  const [loading, setLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadCapabilities();
  }, []);

  const loadCapabilities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('master_competency_capabilities')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      console.log('✅ CRUD TEST - Competency Capabilities loaded from Supabase:', data);
      setCapabilities(data || []);
    } catch (error) {
      console.error('Error loading competency capabilities:', error);
      toast({
        title: "Error",
        description: "Failed to load competency capabilities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCapability = async () => {
    if (newCapability.name) {
      try {
        const { error } = await supabase
          .from('master_competency_capabilities')
          .insert({
            name: newCapability.name,
            description: newCapability.description || undefined,
            category: newCapability.category || undefined
          });

        if (error) throw error;
        console.log('✅ CRUD TEST - Competency Capability created:', newCapability);
        
        setNewCapability({ name: '', description: '', category: '' });
        loadCapabilities();
        toast({
          title: "Success",
          description: "Competency capability added successfully",
        });
      } catch (error) {
        console.error('Error adding competency capability:', error);
        toast({
          title: "Error",
          description: "Failed to add competency capability",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill in the name field",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (capability: CompetencyCapability) => {
    setEditingId(capability.id!);
    setEditingName(capability.name);
    setEditingDescription(capability.description || '');
    setEditingCategory(capability.category || '');
  };

  const handleSaveEdit = async () => {
    if (editingId && editingName) {
      try {
        const { error } = await supabase
          .from('master_competency_capabilities')
          .update({ 
            name: editingName,
            description: editingDescription || undefined,
            category: editingCategory || undefined
          })
          .eq('id', editingId);

        if (error) throw error;
        console.log('✅ CRUD TEST - Competency Capability updated:', { id: editingId, name: editingName });
        
        setEditingId(null);
        setEditingName('');
        setEditingDescription('');
        setEditingCategory('');
        loadCapabilities();
        toast({
          title: "Success",
          description: "Competency capability updated successfully",
        });
      } catch (error) {
        console.error('Error updating competency capability:', error);
        toast({
          title: "Error",
          description: "Failed to update competency capability",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingDescription('');
    setEditingCategory('');
  };

  const deleteCapability = async (id: string) => {
    try {
      const { error } = await supabase
        .from('master_competency_capabilities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      console.log('✅ CRUD TEST - Competency Capability deleted:', id);
      
      loadCapabilities();
      toast({
        title: "Success",
        description: "Competency capability deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting competency capability:', error);
      toast({
        title: "Error",
        description: "Failed to delete competency capability",
        variant: "destructive",
      });
    }
  };

  // Group capabilities by category
  const groupedCapabilities = capabilities.reduce((acc, capability) => {
    const category = capability.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(capability);
    return acc;
  }, {} as Record<string, CompetencyCapability[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Add Competency Capability
          </CardTitle>
          <CardDescription>
            Create a new competency capability for skill assessment and evaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="capability-name">Capability Name</Label>
              <Input
                id="capability-name"
                value={newCapability.name}
                onChange={(e) => setNewCapability(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Technical Skills, Project Management, Communication"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capability-description">Description (Optional)</Label>
              <Input
                id="capability-description"
                value={newCapability.description}
                onChange={(e) => setNewCapability(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter the description for this capability"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capability-category">Category (Optional)</Label>
              <Select value={newCapability.category} onValueChange={(value) => setNewCapability(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addCapability} className="w-fit" disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              Add Competency Capability
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Competency Capabilities</CardTitle>
          <CardDescription>
            Manage existing competency capabilities grouped by category
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : capabilities.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No competency capabilities configured yet.</p>
              <p className="text-sm">Add your first capability above to get started.</p>
            </div>
          ) : (
            Object.entries(groupedCapabilities).map(([category, categoryCapabilities]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Award className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <span className="text-sm text-muted-foreground">({categoryCapabilities.length})</span>
                </div>
                <div className="grid gap-3">
                  {categoryCapabilities.map((capability) => (
                    <div key={capability.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      {editingId === capability.id ? (
                        <div className="flex gap-2 flex-1 items-center">
                          <div className="flex-1 space-y-2">
                            <div>
                              <Label htmlFor={`name-${capability.id}`} className="text-sm font-medium">
                                Capability Name
                              </Label>
                              <Input
                                id={`name-${capability.id}`}
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                placeholder="Enter capability name"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`desc-${capability.id}`} className="text-sm font-medium">
                                Description
                              </Label>
                              <Input
                                id={`desc-${capability.id}`}
                                value={editingDescription}
                                onChange={(e) => setEditingDescription(e.target.value)}
                                placeholder="Enter description (optional)"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`cat-${capability.id}`} className="text-sm font-medium">
                                Category
                              </Label>
                              <Select value={editingCategory} onValueChange={setEditingCategory}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {CATEGORY_OPTIONS.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                      {cat}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} size="sm" className="flex items-center gap-1" disabled={loading}>
                              <Save className="w-3 h-3" />
                              Save
                            </Button>
                            <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex items-center gap-1">
                              <X className="w-3 h-3" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{capability.name}</span>
                              </div>
                              {capability.description && (
                                <p className="text-sm text-muted-foreground mt-1">{capability.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEdit(capability)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              disabled={loading}
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => deleteCapability(capability.id!)}
                              variant="destructive"
                              size="sm"
                              className="flex items-center gap-1"
                              disabled={loading}
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetencyCapabilityConfigSupabase;