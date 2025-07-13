import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CommunicationType {
  id?: string;
  name: string;
}

const defaultTypes = [
  'Email',
  'Phone Call',
  'Video Conference',
  'In-Person Meeting',
  'Text Message',
  'Instant Message',
  'Document Sharing',
  'Project Update',
  'System Notification'
];

const CommunicationTypeConfigSupabase = () => {
  const { toast } = useToast();
  const [communicationTypes, setCommunicationTypes] = useState<CommunicationType[]>([]);
  const [newType, setNewType] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    fetchCommunicationTypes();
  }, []);

  const fetchCommunicationTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_communication_types')
        .select('*')
        .order('name');

      if (error) throw error;

      setCommunicationTypes(data || []);
      
      // If no data exists, insert default data
      if (!data || data.length === 0) {
        await insertDefaultData();
      }
    } catch (error) {
      console.error('Error fetching communication types:', error);
      toast({
        title: "Error",
        description: "Failed to load communication types.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const insertDefaultData = async () => {
    try {
      const { error } = await supabase
        .from('master_communication_types')
        .insert(defaultTypes.map(name => ({ name })));

      if (error) throw error;
      
      fetchCommunicationTypes();
    } catch (error) {
      console.error('Error inserting default communication types:', error);
    }
  };

  const handleAddType = async () => {
    if (newType.trim()) {
      try {
        // Check for duplicates
        const duplicate = communicationTypes.find(t => 
          t.name.toLowerCase() === newType.trim().toLowerCase()
        );
        
        if (duplicate) {
          toast({
            title: "Duplicate Entry",
            description: "A communication type with this name already exists.",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('master_communication_types')
          .insert([{ name: newType.trim() }]);

        if (error) throw error;

        setNewType('');
        setIsAdding(false);
        fetchCommunicationTypes();
        toast({
          title: "Success",
          description: "Communication type added successfully",
        });
      } catch (error) {
        console.error('Error adding communication type:', error);
        toast({
          title: "Error",
          description: "Failed to add communication type.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditType = (index: number) => {
    setEditingIndex(index);
    setEditingValue(communicationTypes[index].name);
  };

  const handleSaveEdit = async () => {
    if (editingValue.trim() && editingIndex !== null) {
      try {
        const typeToUpdate = communicationTypes[editingIndex];
        
        const { error } = await supabase
          .from('master_communication_types')
          .update({ name: editingValue.trim() })
          .eq('id', typeToUpdate.id);

        if (error) throw error;

        setEditingIndex(null);
        setEditingValue('');
        fetchCommunicationTypes();
        toast({
          title: "Success",
          description: "Communication type updated successfully",
        });
      } catch (error) {
        console.error('Error updating communication type:', error);
        toast({
          title: "Error",
          description: "Failed to update communication type.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteType = async (index: number) => {
    try {
      const typeToDelete = communicationTypes[index];
      
      const { error } = await supabase
        .from('master_communication_types')
        .delete()
        .eq('id', typeToDelete.id);

      if (error) throw error;

      fetchCommunicationTypes();
      toast({
        title: "Success",
        description: "Communication type deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting communication type:', error);
      toast({
        title: "Error",
        description: "Failed to delete communication type.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewType('');
  };

  const handleResetToDefault = async () => {
    try {
      // Clear existing data
      await supabase.from('master_communication_types').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert default data
      const { error } = await supabase
        .from('master_communication_types')
        .insert(defaultTypes.map(name => ({ name })));

      if (error) throw error;

      fetchCommunicationTypes();
      setEditingIndex(null);
      setEditingValue('');
      setIsAdding(false);
      setNewType('');
      toast({
        title: "Success",
        description: "Communication types reset to default values",
      });
    } catch (error) {
      console.error('Error resetting communication types:', error);
      toast({
        title: "Error",
        description: "Failed to reset communication types.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading communication types...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Communication Types</CardTitle>
            <CardDescription>
              Configure communication types for tracking interactions and correspondence
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchCommunicationTypes}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Refresh
            </Button>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Communication Types ({communicationTypes.length})</h3>
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
          <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
            <div className="flex-1">
              <Label htmlFor="new-communication-type">New Communication Type</Label>
              <Input
                id="new-communication-type"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="Enter communication type name"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 items-end">
              <Button onClick={handleAddType} size="sm" className="flex items-center gap-1">
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
          {communicationTypes.map((type, index) => (
            <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
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
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditType(index)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteType(index)}
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

export default CommunicationTypeConfigSupabase;