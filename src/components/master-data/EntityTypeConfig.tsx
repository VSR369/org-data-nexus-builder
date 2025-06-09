
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const EntityTypeConfig = () => {
  const { toast } = useToast();
  const [entityTypes, setEntityTypes] = useState([
    'Commercial',
    'Non-Profit Organization',
    'Society/ Trust'
  ]);
  
  const [newEntityType, setNewEntityType] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddEntityType = () => {
    if (newEntityType.trim()) {
      setEntityTypes([...entityTypes, newEntityType.trim()]);
      setNewEntityType('');
      setIsAdding(false);
      toast({
        title: "Success",
        description: "Entity type added successfully",
      });
    }
  };

  const handleEditEntityType = (index: number) => {
    setEditingIndex(index);
    setEditingValue(entityTypes[index]);
  };

  const handleSaveEdit = () => {
    if (editingValue.trim() && editingIndex !== null) {
      const updatedEntityTypes = [...entityTypes];
      updatedEntityTypes[editingIndex] = editingValue.trim();
      setEntityTypes(updatedEntityTypes);
      setEditingIndex(null);
      setEditingValue('');
      toast({
        title: "Success",
        description: "Entity type updated successfully",
      });
    }
  };

  const handleDeleteEntityType = (index: number) => {
    const updatedEntityTypes = entityTypes.filter((_, i) => i !== index);
    setEntityTypes(updatedEntityTypes);
    toast({
      title: "Success",
      description: "Entity type deleted successfully",
    });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewEntityType('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Entity Types</CardTitle>
        <CardDescription>
          Configure organization entity types for legal classification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Entity Types</h3>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Entity Type
          </Button>
        </div>

        {isAdding && (
          <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
            <div className="flex-1">
              <Label htmlFor="new-entity-type">New Entity Type</Label>
              <Input
                id="new-entity-type"
                value={newEntityType}
                onChange={(e) => setNewEntityType(e.target.value)}
                placeholder="Enter entity type name"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 items-end">
              <Button onClick={handleAddEntityType} size="sm" className="flex items-center gap-1">
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
          {entityTypes.map((entityType, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              {editingIndex === index ? (
                <div className="flex gap-2 flex-1">
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveEdit} size="sm" className="flex items-center gap-1">
                    <Save className="w-3 h-3" />
                    Save
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex items-center gap-1">
                    <X className="w-3 h-3" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <span className="font-medium">{entityType}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditEntityType(index)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteEntityType(index)}
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

export default EntityTypeConfig;
