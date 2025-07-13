import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CapabilityLevel {
  id: string;
  name: string;
  min_score: number;
  max_score: number;
  color: string;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface FormData {
  name: string;
  min_score: number;
  max_score: number;
  color: string;
}

const COLOR_OPTIONS = [
  { value: "#ef4444", label: "Red" },
  { value: "#f97316", label: "Orange" },
  { value: "#eab308", label: "Yellow" },
  { value: "#22c55e", label: "Green" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#a855f7", label: "Purple" },
  { value: "#ec4899", label: "Pink" },
  { value: "#6b7280", label: "Gray" },
];

const CapabilityLevelsConfig = () => {
  const [levels, setLevels] = useState<CapabilityLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    min_score: 0,
    max_score: 0,
    color: COLOR_OPTIONS[0].value,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCapabilityLevels();
  }, []);

  const loadCapabilityLevels = async () => {
    try {
      const { data, error } = await supabase
        .from('master_capability_levels')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setLevels(data || []);
    } catch (error) {
      console.error('Error loading capability levels:', error);
      toast({
        title: "Error",
        description: "Failed to load capability levels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateRange = (minScore: number, maxScore: number, excludeId?: string): boolean => {
    if (minScore >= maxScore) {
      toast({
        title: "Invalid Range",
        description: "Minimum score must be less than maximum score",
        variant: "destructive",
      });
      return false;
    }

    // Check for overlaps with existing levels
    const overlap = levels.some(level => {
      if (excludeId && level.id === excludeId) return false;
      
      return (minScore >= level.min_score && minScore <= level.max_score) ||
             (maxScore >= level.min_score && maxScore <= level.max_score) ||
             (minScore <= level.min_score && maxScore >= level.max_score);
    });

    if (overlap) {
      toast({
        title: "Range Overlap",
        description: "Score range overlaps with existing level",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Level name is required",
        variant: "destructive",
      });
      return;
    }

    if (!validateRange(formData.min_score, formData.max_score)) return;

    try {
      const maxOrder = Math.max(...levels.map(l => l.order_index), 0);
      
      const { error } = await supabase
        .from('master_capability_levels')
        .insert({
          name: formData.name.trim(),
          min_score: formData.min_score,
          max_score: formData.max_score,
          color: formData.color,
          order_index: maxOrder + 1,
          is_active: true,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Capability level added successfully",
      });

      setFormData({
        name: "",
        min_score: 0,
        max_score: 0,
        color: COLOR_OPTIONS[0].value,
      });
      setIsAdding(false);
      loadCapabilityLevels();
    } catch (error) {
      console.error('Error adding capability level:', error);
      toast({
        title: "Error",
        description: "Failed to add capability level",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (level: CapabilityLevel) => {
    setEditingId(level.id);
    setFormData({
      name: level.name,
      min_score: level.min_score,
      max_score: level.max_score,
      color: level.color,
    });
  };

  const handleSaveEdit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Level name is required",
        variant: "destructive",
      });
      return;
    }

    if (!validateRange(formData.min_score, formData.max_score, editingId)) return;

    try {
      const { error } = await supabase
        .from('master_capability_levels')
        .update({
          name: formData.name.trim(),
          min_score: formData.min_score,
          max_score: formData.max_score,
          color: formData.color,
        })
        .eq('id', editingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Capability level updated successfully",
      });

      setEditingId(null);
      setFormData({
        name: "",
        min_score: 0,
        max_score: 0,
        color: COLOR_OPTIONS[0].value,
      });
      loadCapabilityLevels();
    } catch (error) {
      console.error('Error updating capability level:', error);
      toast({
        title: "Error",
        description: "Failed to update capability level",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this capability level?")) return;

    try {
      const { error } = await supabase
        .from('master_capability_levels')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Capability level deleted successfully",
      });

      loadCapabilityLevels();
    } catch (error) {
      console.error('Error deleting capability level:', error);
      toast({
        title: "Error",
        description: "Failed to delete capability level",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('master_capability_levels')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Capability level ${!currentStatus ? 'activated' : 'deactivated'}`,
      });

      loadCapabilityLevels();
    } catch (error) {
      console.error('Error toggling capability level status:', error);
      toast({
        title: "Error",
        description: "Failed to update capability level status",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      name: "",
      min_score: 0,
      max_score: 0,
      color: COLOR_OPTIONS[0].value,
    });
  };

  if (loading) {
    return <div>Loading capability levels...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Capability Levels Management</CardTitle>
          <CardDescription>
            Configure capability level ranges and scoring system. Each level represents a proficiency range from 0-10.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Level Section */}
          {!isAdding && !editingId && (
            <Button onClick={() => setIsAdding(true)} className="mb-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Level
            </Button>
          )}

          {/* Form for Adding/Editing */}
          {(isAdding || editingId) && (
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="name">Level Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Beginner, Advanced"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minScore">Min Score</Label>
                    <Input
                      id="minScore"
                      type="number"
                      min="0"
                      max="10"
                      value={formData.min_score}
                      onChange={(e) => setFormData({ ...formData, min_score: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxScore">Max Score</Label>
                    <Input
                      id="maxScore"
                      type="number"
                      min="0"
                      max="10"
                      value={formData.max_score}
                      onChange={(e) => setFormData({ ...formData, max_score: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COLOR_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: option.value }}
                              />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={editingId ? handleSaveEdit : handleAdd}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Update' : 'Save'}
                  </Button>
                  <Button variant="outline" onClick={cancelEdit}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing Levels List */}
          <div className="space-y-3">
            {levels.map((level) => (
              <div key={level.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge style={{ backgroundColor: level.color, color: 'white' }}>
                    {level.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Score Range: {level.min_score} - {level.max_score}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={level.is_active}
                    onCheckedChange={() => toggleActive(level.id, level.is_active)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(level)}
                    disabled={editingId === level.id}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(level.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {levels.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No capability levels configured. Click "Add Level" to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CapabilityLevelsConfig;
