import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LegacyDataManager } from '@/utils/core/DataManager';

const entityTypesDataManager = new LegacyDataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: [
    'Commercial',
    'Non-Profit Organization',
    'Society',
    'Trust'
  ],
  version: 1
});

const EntityTypeConfig = () => {
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [newEntityType, setNewEntityType] = useState('');
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    const loadedEntityTypes = entityTypesDataManager.loadData();
    setEntityTypes(loadedEntityTypes);
  }, []);

  // Save data whenever entityTypes change
  useEffect(() => {
    if (entityTypes.length > 0) {
      entityTypesDataManager.saveData(entityTypes);
    }
  }, [entityTypes]);

  const addEntityType = () => {
    if (newEntityType.trim() !== '') {
      if (entityTypes.includes(newEntityType.trim())) {
        toast({
          title: "Duplicate Entry",
          description: "This entity type already exists.",
          variant: "destructive",
        });
        return;
      }
      setEntityTypes([...entityTypes, newEntityType.trim()]);
      setNewEntityType('');
      toast({
        title: "Entity Type Added",
        description: `${newEntityType.trim()} has been added to the list.`,
      });
    } else {
      toast({
        title: "Input Required",
        description: "Please enter an entity type.",
        variant: "destructive",
      });
    }
  };

  const removeEntityType = (index: number) => {
    const entityTypeToRemove = entityTypes[index];
    const updatedEntityTypes = [...entityTypes];
    updatedEntityTypes.splice(index, 1);
    setEntityTypes(updatedEntityTypes);
    toast({
      title: "Entity Type Removed",
      description: `${entityTypeToRemove} has been removed from the list.`,
    });
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
          <CardTitle>Current Entity Types</CardTitle>
          <CardDescription>Manage existing entity types.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-none space-y-2">
            {entityTypes.map((entityType, index) => (
              <li key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
                <span>{entityType}</span>
                <Button variant="destructive" size="icon" onClick={() => removeEntityType(index)}>
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
