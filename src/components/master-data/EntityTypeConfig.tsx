
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DataManager, GlobalCacheManager } from '@/utils/dataManager';

const defaultEntityTypes = [
  'Commercial',
  'Non-Profit Organization',
  'Society/ Trust'
];

const dataManager = new DataManager<string[]>({
  key: 'master_data_entity_types_config',
  defaultData: defaultEntityTypes,
  version: 1
});

GlobalCacheManager.registerKey('master_data_entity_types_config');

const EntityTypeConfig = () => {
  const { toast } = useToast();
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [newEntityType, setNewEntityType] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadedTypes = dataManager.loadData();
    console.log('🔍 EntityTypeConfig - Loaded data:', loadedTypes);
    setEntityTypes(loadedTypes);
  }, []);

  const handleAddEntityType = () => {
    if (newEntityType.trim()) {
      const updatedEntityTypes = [...entityTypes, newEntityType.trim()];
      console.log('➕ EntityTypeConfig - Adding new type:', newEntityType.trim());
      console.log('📝 EntityTypeConfig - Updated array:', updatedEntityTypes);
      
      // Save data immediately
      dataManager.saveData(updatedEntityTypes);
      
      // Update state
      setEntityTypes(updatedEntityTypes);
      setNewEntityType('');
      setIsAdding(false);
      
      toast({
        title: "Success",
        description: "Entity type added successfully",
      });
      
      console.log('✅ EntityTypeConfig - Entity type added and saved');
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
      
      console.log('✏️ EntityTypeConfig - Editing type at index:', editingIndex);
      console.log('📝 EntityTypeConfig - Updated array:', updatedEntityTypes);
      
      // Save data immediately
      dataManager.saveData(updatedEntityTypes);
      
      // Update state
      setEntityTypes(updatedEntityTypes);
      setEditingIndex(null);
      setEditingValue('');
      
      toast({
        title: "Success",
        description: "Entity type updated successfully",
      });
      
      console.log('✅ EntityTypeConfig - Entity type edited and saved');
    }
  };

  const handleDeleteEntityType = (index: number) => {
    const updatedEntityTypes = entityTypes.filter((_, i) => i !== index);
    
    console.log('🗑️ EntityTypeConfig - Deleting type at index:', index);
    console.log('📝 EntityTypeConfig - Updated array:', updatedEntityTypes);
    
    // Save data immediately
    dataManager.saveData(updatedEntityTypes);
    
    // Update state
    setEntityTypes(updatedEntityTypes);
    
    toast({
      title: "Success",
      description: "Entity type deleted successfully",
    });
    
    console.log('✅ EntityTypeConfig - Entity type deleted and saved');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewEntityType('');
  };

  const handleResetToDefault = () => {
    const defaultData = dataManager.resetToDefault();
    console.log('🔄 EntityTypeConfig - Reset to default:', defaultData);
    
    setEntityTypes(defaultData);
    setEditingIndex(null);
    setEditingValue('');
    setIsAdding(false);
    setNewEntityType('');
    
    toast({
      title: "Success",
      description: "Entity types reset to default values",
    });
    
    console.log('✅ EntityTypeConfig - Reset completed');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Organization Entity Types (Master Data)</CardTitle>
            <CardDescription>
              Configure organization entity types for classification (independent of membership system)
            </CardDescription>
          </div>
          <Button
            onClick={handleResetToDefault}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Entity Types ({entityTypes.length})</h3>
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
