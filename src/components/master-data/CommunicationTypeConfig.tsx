
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CommunicationType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

const CommunicationTypeConfig = () => {
  const { toast } = useToast();
  const [communicationTypes, setCommunicationTypes] = useState<CommunicationType[]>([
    { id: '1', name: 'Email', description: 'Standard email communication', isActive: true },
    { id: '2', name: 'SMS', description: 'Short message service', isActive: true },
    { id: '3', name: 'Push Notification', description: 'Mobile app push notifications', isActive: true },
    { id: '4', name: 'In-App Message', description: 'Messages within the application', isActive: true },
    { id: '5', name: 'Announcement', description: 'Public announcements and updates', isActive: true }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleAdd = () => {
    if (formData.name.trim()) {
      const newType: CommunicationType = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        isActive: true
      };
      setCommunicationTypes([...communicationTypes, newType]);
      setFormData({ name: '', description: '' });
      setIsAdding(false);
      toast({
        title: "Success",
        description: "Communication type added successfully",
      });
    }
  };

  const handleEdit = (type: CommunicationType) => {
    setEditingId(type.id);
    setFormData({ name: type.name, description: type.description });
  };

  const handleSaveEdit = () => {
    if (formData.name.trim() && editingId) {
      setCommunicationTypes(prev => prev.map(type => 
        type.id === editingId 
          ? { ...type, name: formData.name.trim(), description: formData.description.trim() }
          : type
      ));
      setEditingId(null);
      setFormData({ name: '', description: '' });
      toast({
        title: "Success",
        description: "Communication type updated successfully",
      });
    }
  };

  const handleDelete = (id: string) => {
    setCommunicationTypes(prev => prev.filter(type => type.id !== id));
    toast({
      title: "Success",
      description: "Communication type deleted successfully",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setFormData({ name: '', description: '' });
  };

  const toggleActive = (id: string) => {
    setCommunicationTypes(prev => prev.map(type => 
      type.id === id ? { ...type, isActive: !type.isActive } : type
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Communication Types
        </CardTitle>
        <CardDescription>
          Configure different types of communication channels available in the system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Communication Types</h3>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Type
          </Button>
        </div>

        {isAdding && (
          <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
            <div>
              <Label htmlFor="new-comm-type-name">Type Name</Label>
              <Input
                id="new-comm-type-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter communication type name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-comm-type-description">Description</Label>
              <Textarea
                id="new-comm-type-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
                className="mt-1"
              />
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
          {communicationTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              {editingId === type.id ? (
                <div className="flex gap-2 flex-1 space-y-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Type name"
                    />
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
                        <span className="font-medium">{type.name}</span>
                        <Badge variant={type.isActive ? "default" : "secondary"}>
                          {type.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {type.description && (
                        <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => toggleActive(type.id)}
                      variant="outline"
                      size="sm"
                    >
                      {type.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      onClick={() => handleEdit(type)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(type.id)}
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

export default CommunicationTypeConfig;
