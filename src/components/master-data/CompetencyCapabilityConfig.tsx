
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Brain } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CompetencyCapability {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
  isActive: boolean;
}

const CompetencyCapabilityConfig = () => {
  const { toast } = useToast();
  
  // Pre-defined competency capabilities with proper order and colors
  const [capabilities, setCapabilities] = useState<CompetencyCapability[]>([
    {
      id: '1',
      name: 'Guru',
      description: 'Expert level with deep knowledge and ability to guide others',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      order: 1,
      isActive: true,
    },
    {
      id: '2',
      name: 'Advanced',
      description: 'High proficiency with comprehensive understanding',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      order: 2,
      isActive: true,
    },
    {
      id: '3',
      name: 'Basic',
      description: 'Fundamental knowledge and basic competency',
      color: 'bg-green-100 text-green-800 border-green-300',
      order: 3,
      isActive: true,
    },
    {
      id: '4',
      name: 'Not Applicable',
      description: 'This competency area is not relevant or applicable',
      color: 'bg-gray-100 text-gray-800 border-gray-300',
      order: 4,
      isActive: true,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCapability, setEditingCapability] = useState<CompetencyCapability | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
  });

  const colorOptions = [
    { value: 'bg-purple-100 text-purple-800 border-purple-300', label: 'Purple' },
    { value: 'bg-blue-100 text-blue-800 border-blue-300', label: 'Blue' },
    { value: 'bg-green-100 text-green-800 border-green-300', label: 'Green' },
    { value: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Yellow' },
    { value: 'bg-red-100 text-red-800 border-red-300', label: 'Red' },
    { value: 'bg-gray-100 text-gray-800 border-gray-300', label: 'Gray' },
  ];

  const handleAdd = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Capability name is required",
        variant: "destructive",
      });
      return;
    }

    const newCapability: CompetencyCapability = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      color: formData.color,
      order: capabilities.length + 1,
      isActive: true,
    };

    setCapabilities(prev => [...prev, newCapability]);
    setFormData({ name: '', description: '', color: 'bg-blue-100 text-blue-800 border-blue-300' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Competency capability added successfully",
    });
  };

  const handleEdit = (capability: CompetencyCapability) => {
    setEditingCapability(capability);
    setFormData({
      name: capability.name,
      description: capability.description,
      color: capability.color,
    });
  };

  const handleUpdate = () => {
    if (!formData.name.trim() || !editingCapability) return;

    setCapabilities(prev => prev.map(cap => 
      cap.id === editingCapability.id 
        ? { ...cap, ...formData }
        : cap
    ));

    setEditingCapability(null);
    setFormData({ name: '', description: '', color: 'bg-blue-100 text-blue-800 border-blue-300' });
    
    toast({
      title: "Success",
      description: "Competency capability updated successfully",
    });
  };

  const handleDelete = (id: string) => {
    setCapabilities(prev => prev.filter(cap => cap.id !== id));
    toast({
      title: "Success",
      description: "Competency capability deleted successfully",
    });
  };

  const toggleStatus = (id: string) => {
    setCapabilities(prev => prev.map(cap => 
      cap.id === id ? { ...cap, isActive: !cap.isActive } : cap
    ));
  };

  const sortedCapabilities = [...capabilities].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Competency Capability Levels
          </CardTitle>
          <CardDescription>
            Manage competency capability levels used for solution provider assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              {capabilities.filter(c => c.isActive).length} active capability levels
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Capability Level
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Competency Capability</DialogTitle>
                  <DialogDescription>
                    Create a new competency capability level for assessments
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Capability Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter capability name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter capability description"
                    />
                  </div>
                  <div>
                    <Label>Color Theme</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                          className={`p-2 rounded border-2 ${
                            formData.color === color.value ? 'ring-2 ring-primary' : ''
                          }`}
                        >
                          <Badge className={color.value}>{color.label}</Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAdd}>Add Capability</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {sortedCapabilities.map((capability) => (
              <div
                key={capability.id}
                className={`border rounded-lg p-4 ${
                  capability.isActive ? 'bg-card' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge className={capability.color}>
                      {capability.name}
                    </Badge>
                    <div>
                      <div className="font-medium">{capability.name}</div>
                      {capability.description && (
                        <div className="text-sm text-muted-foreground">
                          {capability.description}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={capability.isActive ? "default" : "secondary"}>
                      {capability.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(capability)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(capability.id)}
                    >
                      {capability.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(capability.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingCapability} onOpenChange={() => setEditingCapability(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Competency Capability</DialogTitle>
            <DialogDescription>
              Update the competency capability details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Capability Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter capability name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter capability description"
              />
            </div>
            <div>
              <Label>Color Theme</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`p-2 rounded border-2 ${
                      formData.color === color.value ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Badge className={color.value}>{color.label}</Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCapability(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Capability</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompetencyCapabilityConfig;
