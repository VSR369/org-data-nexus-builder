import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LegacyDataManager } from '@/utils/core/DataManager';

interface EntityType {
  _id: string;
  name: string;
}

const entityTypesDataManager = new LegacyDataManager<EntityType[]>({
  key: 'master_data_entity_types',
  defaultData: [],
  version: 1
});

const EntityTypeConfig = () => {
  const [entityTypes, setEntityTypes] = useState<EntityType[]>([]);
  const [newEntityType, setNewEntityType] = useState('');
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    fetchEntityTypes();
  }, []);

  // Save data whenever entityTypes change
  useEffect(() => {
    if (entityTypes.length > 0) {
      entityTypesDataManager.saveData(entityTypes);
    }
  }, [entityTypes]);

  const fetchEntityTypes = async () => {
    const loadedEntityTypes = entityTypesDataManager.loadData();
    console.log("Entity types from local storage:", loadedEntityTypes);
    setEntityTypes(loadedEntityTypes || []);
  }

  const saveEntityType = async (newEntityType: string) => {
    try {
      const currentEntityTypes = entityTypesDataManager.loadData() || [];
      const newEntity: EntityType = { _id: Date.now().toString(), name: newEntityType };
      currentEntityTypes.push(newEntity);
      entityTypesDataManager.saveData(currentEntityTypes);
      setEntityTypes(currentEntityTypes);
      toast({
        title: "Success",
        description: "Entity type saved successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving entity type:', error);
      toast({
        title: "Error",
        description: "Failed to save entity type.",
        variant: "destructive",
      });
    }
  }

  const updateEntityType = async (newEntityType: string, id: string) => {
    try {
      const currentEntityTypes = entityTypesDataManager.loadData() || [];
      const updatedEntityTypes = currentEntityTypes.map(et => 
        et._id === id ? { ...et, name: newEntityType } : et
      );
      entityTypesDataManager.saveData(updatedEntityTypes);
      setEntityTypes(updatedEntityTypes);
      toast({
        title: "Success",
        description: "Entity type updated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating entity type:', error);
      toast({
        title: "Error",
        description: "Failed to update entity type.",
        variant: "destructive",
      });
    }
  }

  const deleteEntityType = async (entityID: string) => {
    try {
      const currentEntityTypes = entityTypesDataManager.loadData() || [];
      const updatedEntityTypes = currentEntityTypes.filter(et => et._id !== entityID);
      entityTypesDataManager.saveData(updatedEntityTypes);
      setEntityTypes(updatedEntityTypes);
      toast({
        title: "Success",
        description: "Entity type deleted successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting entity type:', error);
      toast({
        title: "Error",
        description: "Failed to delete entity type.",
        variant: "destructive",
      });
    }
  }
  
  const addEntityType = async () => {
    if (newEntityType.trim() !== '') {
      if (entityTypes.some(et => et.name === newEntityType.trim())) {
        toast({
          title: "Duplicate Entry",
          description: "This entity type already exists.",
          variant: "destructive",
        });
        return;
      }
      await saveEntityType(newEntityType.trim());
      setNewEntityType('');
    } else {
      toast({
        title: "Input Required",
        description: "Please enter an entity type.",
        variant: "destructive",
      });
    }
  };

  const removeEntityType = async (id: string) => {
    console.log("Removing entity type with id:", id);
    await deleteEntityType(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEntityType();
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-foreground mb-2">Entity Types Configuration</h2>
        <p className="text-lg text-muted-foreground">
          Manage entity types for organizations and legal entities
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Entity Type</CardTitle>
          <CardDescription>Add a new entity type to the list.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Enter entity type"
              value={newEntityType}
              onChange={(e) => setNewEntityType(e.target.value)}
            />
            <Button type="submit" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Entity Types ({entityTypes.length})</CardTitle>
          <CardDescription>Manage existing entity types.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-none space-y-2">
            {entityTypes.map((entityType) => (
              <li key={entityType._id} className="flex items-center justify-between py-2 border-b border-gray-200">
                <span>{entityType.name}</span>
                <Button variant="destructive" size="icon" onClick={() => removeEntityType(entityType._id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntityTypeConfig;