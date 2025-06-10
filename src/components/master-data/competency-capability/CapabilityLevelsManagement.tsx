
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { CapabilityLevel, CapabilityLevelFormData, ColorOption } from './types';

interface CapabilityLevelsManagementProps {
  capabilityLevels: CapabilityLevel[];
  onCapabilityLevelsChange: (levels: CapabilityLevel[]) => void;
  colorOptions: ColorOption[];
}

const CapabilityLevelsManagement: React.FC<CapabilityLevelsManagementProps> = ({
  capabilityLevels,
  onCapabilityLevelsChange,
  colorOptions
}) => {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CapabilityLevelFormData>({
    label: '',
    minScore: 0,
    maxScore: 0,
    color: colorOptions[0].value
  });

  const validateRange = (minScore: number, maxScore: number, excludeId?: string): boolean => {
    if (minScore >= maxScore) {
      toast({
        title: "Error",
        description: "Minimum score must be less than maximum score",
        variant: "destructive"
      });
      return false;
    }

    // Check for overlaps with other ranges
    const hasOverlap = capabilityLevels.some(level => {
      if (excludeId && level.id === excludeId) return false;
      
      return (minScore >= level.minScore && minScore <= level.maxScore) ||
             (maxScore >= level.minScore && maxScore <= level.maxScore) ||
             (minScore <= level.minScore && maxScore >= level.maxScore);
    });

    if (hasOverlap) {
      toast({
        title: "Error",
        description: "Score range overlaps with existing level",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleAdd = () => {
    if (!formData.label.trim()) {
      toast({
        title: "Error",
        description: "Please enter a label",
        variant: "destructive"
      });
      return;
    }

    if (!validateRange(formData.minScore, formData.maxScore)) {
      return;
    }

    const newLevel: CapabilityLevel = {
      id: Date.now().toString(),
      label: formData.label.trim(),
      minScore: formData.minScore,
      maxScore: formData.maxScore,
      color: formData.color,
      order: capabilityLevels.length + 1,
      isActive: true
    };

    onCapabilityLevelsChange([...capabilityLevels, newLevel]);
    setFormData({ label: '', minScore: 0, maxScore: 0, color: colorOptions[0].value });
    setIsAdding(false);
    toast({
      title: "Success",
      description: "Capability level added successfully"
    });
  };

  const handleEdit = (level: CapabilityLevel) => {
    setEditingId(level.id);
    setFormData({
      label: level.label,
      minScore: level.minScore,
      maxScore: level.maxScore,
      color: level.color
    });
  };

  const handleSaveEdit = () => {
    if (!formData.label.trim() || !editingId) {
      toast({
        title: "Error",
        description: "Please enter a label",
        variant: "destructive"
      });
      return;
    }

    if (!validateRange(formData.minScore, formData.maxScore, editingId)) {
      return;
    }

    onCapabilityLevelsChange(capabilityLevels.map(level =>
      level.id === editingId
        ? { ...level, ...formData, label: formData.label.trim() }
        : level
    ));
    setEditingId(null);
    setFormData({ label: '', minScore: 0, maxScore: 0, color: colorOptions[0].value });
    toast({
      title: "Success",
      description: "Capability level updated successfully"
    });
  };

  const handleDelete = (id: string) => {
    onCapabilityLevelsChange(capabilityLevels.filter(level => level.id !== id));
    toast({
      title: "Success",
      description: "Capability level deleted successfully"
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ label: '', minScore: 0, maxScore: 0, color: colorOptions[0].value });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setFormData({ label: '', minScore: 0, maxScore: 0, color: colorOptions[0].value });
  };

  const toggleActive = (id: string) => {
    onCapabilityLevelsChange(capabilityLevels.map(level =>
      level.id === id ? { ...level, isActive: !level.isActive } : level
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Capability Level Ranges (0-10 Scale)</CardTitle>
        <CardDescription>
          Configure competency level labels and score ranges
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Capability Levels</h3>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Level
          </Button>
        </div>

        {isAdding && (
          <Card className="bg-muted/30">
            <CardContent className="p-4 space-y-4">
              <h4 className="font-medium">Add New Capability Level</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-level-label">Level Label</Label>
                  <Input
                    id="new-level-label"
                    value={formData.label}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="e.g., Basic, Advanced"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-level-color">Color</Label>
                  <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${option.value}`}></div>
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-level-min">Minimum Score</Label>
                  <Input
                    id="new-level-min"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.minScore}
                    onChange={(e) => setFormData(prev => ({ ...prev, minScore: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-level-max">Maximum Score</Label>
                  <Input
                    id="new-level-max"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.maxScore}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxScore: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd} size="sm" className="flex items-center gap-1">
                  <Save className="w-3 h-3" />
                  Save
                </Button>
                <Button onClick={handleCancelAdd} variant="outline" size="sm" className="flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {capabilityLevels
            .sort((a, b) => a.order - b.order)
            .map((level) => (
            <Card key={level.id} className="hover:bg-muted/20 transition-colors">
              <CardContent className="p-4">
                {editingId === level.id ? (
                  <div className="space-y-4">
                    <h4 className="font-medium">Edit Capability Level</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Level Label</Label>
                        <Input
                          value={formData.label}
                          onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                          placeholder="Level label"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {colorOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded ${option.value}`}></div>
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Minimum Score</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={formData.minScore}
                          onChange={(e) => setFormData(prev => ({ ...prev, minScore: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Maximum Score</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={formData.maxScore}
                          onChange={(e) => setFormData(prev => ({ ...prev, maxScore: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEdit} size="sm" className="flex items-center gap-1">
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={level.color}>
                        {level.label}
                      </Badge>
                      <span className="text-sm text-muted-foreground font-mono">
                        {level.minScore} – {level.maxScore}
                      </span>
                      <Badge variant={level.isActive ? "default" : "secondary"}>
                        {level.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleActive(level.id)}
                        variant="outline"
                        size="sm"
                      >
                        {level.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        onClick={() => handleEdit(level)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(level.id)}
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CapabilityLevelsManagement;
