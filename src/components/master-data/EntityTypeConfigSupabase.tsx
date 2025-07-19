import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EntityType {
  id?: string;
  name: string;
}

const defaultEntityTypes = ['Commercial', 'Non-Profit Organization', 'Society', 'Trust'];

const EntityTypeConfigSupabase = () => {
  const [entityTypes, setEntityTypes] = useState<EntityType[]>([]);
  const [newEntityType, setNewEntityType] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    fetchEntityTypes();
  }, []);

  const fetchEntityTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_entity_types')
        .select('*')
        .order('name');

      if (error) throw error;
      console.log('✅ CRUD TEST - Entity Types loaded from Supabase:', data);
      setEntityTypes(data || []);
      
      // If no data exists, insert default data
      if (!data || data.length === 0) {
        await insertDefaultData();
      }
    } catch (error) {
      console.error('Error fetching entity types:', error);
      toast({
        title: "Error",
        description: "Failed to load entity types.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const insertDefaultData = async () => {
    try {
      const { error } = await supabase
        .from('master_entity_types')
        .insert(defaultEntityTypes.map(name => ({ name })));

      if (error) throw error;
      
      fetchEntityTypes();
    } catch (error) {
      console.error('Error inserting default entity types:', error);
    }
  };

  const saveEntityType = async (newEntityType: string) => {
    try {
      // Check for duplicates
      const duplicate = entityTypes.find(et => 
        et.name.toLowerCase() === newEntityType.trim().toLowerCase()
      );
      
      if (duplicate) {
        toast({
          title: "Duplicate Entry",
          description: "This entity type already exists.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('master_entity_types')
        .insert([{ name: newEntityType.trim() }]);

      if (error) throw error;

      fetchEntityTypes();
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
  };

  const deleteEntityType = async (entityType: EntityType) => {
    try {
      const { error } = await supabase
        .from('master_entity_types')
        .delete()
        .eq('id', entityType.id);

      if (error) throw error;

      fetchEntityTypes();
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
  };
  
  const addEntityType = async () => {
    if (newEntityType.trim() !== '') {
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

  const removeEntityType = async (entityType: EntityType) => {
    console.log("Removing entity type:", entityType.name);
    await deleteEntityType(entityType);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEntityType();
  };

  if (loading) {
    return <div>Loading entity types...</div>;
  }

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
            {entityTypes.map((entityType, index) => (
              <li key={entityType.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                <span>{entityType.name}</span>
                <Button variant="destructive" size="icon" onClick={() => removeEntityType(entityType)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
          
          {entityTypes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No entity types configured.</p>
              <p className="text-sm">Add entity types using the form above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EntityTypeConfigSupabase;