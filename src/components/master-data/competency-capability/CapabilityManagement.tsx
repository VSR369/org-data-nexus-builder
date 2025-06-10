
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { CompetencyCapability } from './types';

interface CapabilityManagementProps {
  capabilities: CompetencyCapability[];
  onCapabilitiesChange: (capabilities: CompetencyCapability[]) => void;
}

const CapabilityManagement: React.FC<CapabilityManagementProps> = ({
  capabilities,
  onCapabilitiesChange
}) => {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'technical' as 'technical' | 'business' | 'behavioral',
    ratingRange: '1-5'
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-green-100 text-green-800';
      case 'behavioral': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAdd = () => {
    if (formData.name.trim()) {
      const newCapability: CompetencyCapability = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        ratingRange: formData.ratingRange,
        isActive: true
      };
      onCapabilitiesChange([...capabilities, newCapability]);
      setFormData({ name: '', description: '', category: 'technical', ratingRange: '1-5' });
      setIsAdding(false);
      toast({
        title: "Success",
        description: "Capability added successfully",
      });
    }
  };

  const handleEdit = (capability: CompetencyCapability) => {
    setEditingId(capability.id);
    setFormData({
      name: capability.name,
      description: capability.description,
      category: capability.category,
      ratingRange: capability.ratingRange
    });
  };

  const handleSaveEdit = () => {
    if (formData.name.trim() && editingId) {
      onCapabilitiesChange(capabilities.map(cap => 
        cap.id === editingId 
          ? { ...cap, ...formData, name: formData.name.trim(), description: formData.description.trim() }
          : cap
      ));
      setEditingId(null);
      setFormData({ name: '', description: '', category: 'technical', ratingRange: '1-5' });
      toast({
        title: "Success",
        description: "Capability updated successfully",
      });
    }
  };

  const handleDelete = (id: string) => {
    onCapabilitiesChange(capabilities.filter(cap => cap.id !== id));
    toast({
      title: "Success",
      description: "Capability deleted successfully",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', category: 'technical', ratingRange: '1-5' });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setFormData({ name: '', description: '', category: 'technical', ratingRange: '1-5' });
  };

  const toggleActive = (id: string) => {
    onCapabilitiesChange(capabilities.map(cap => 
      cap.id === id ? { ...cap, isActive: !cap.isActive } : cap
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Competency & Capability Management</CardTitle>
        <CardDescription>
          Add, edit, and manage competencies and capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Capabilities</h3>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Capability
          </Button>
        </div>

        {isAdding && (
          <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-capability-name">Capability Name</Label>
                <Input
                  id="new-capability-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter capability name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-capability-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="new-capability-description">Description</Label>
              <Textarea
                id="new-capability-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-capability-rating">Rating Range</Label>
              <Select value={formData.ratingRange} onValueChange={(value) => setFormData(prev => ({ ...prev, ratingRange: value }))}>
                <SelectTrigger className="mt-1 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3">1-3</SelectItem>
                  <SelectItem value="1-5">1-5</SelectItem>
                  <SelectItem value="1-10">1-10</SelectItem>
                </SelectContent>
              </Select>
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
          </div>
        )}

        <div className="grid gap-2">
          {capabilities.map((capability) => (
            <div key={capability.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              {editingId === capability.id ? (
                <div className="flex gap-2 flex-1 space-y-2">
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Capability name"
                      />
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="behavioral">Behavioral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description"
                    />
                  </div>
                  <div className="flex gap-2 items-start">
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
                <>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{capability.name}</span>
                        <Badge className={getCategoryColor(capability.category)}>
                          {capability.category}
                        </Badge>
                        <Badge variant={capability.isActive ? "default" : "secondary"}>
                          {capability.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {capability.ratingRange}
                        </Badge>
                      </div>
                      {capability.description && (
                        <p className="text-sm text-muted-foreground mt-1">{capability.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => toggleActive(capability.id)}
                      variant="outline"
                      size="sm"
                    >
                      {capability.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      onClick={() => handleEdit(capability)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(capability.id)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
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
      </CardContent>
    </Card>
  );
};

export default CapabilityManagement;
