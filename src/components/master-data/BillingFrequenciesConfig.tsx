import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BillingFrequency {
  id?: string;
  name: string;
  description?: string;
  is_active: boolean;
  months?: number;
}

const defaultBillingFrequencies = [
  { name: 'Monthly', description: 'Monthly billing cycle', is_active: true, months: 1 },
  { name: 'Quarterly', description: 'Quarterly billing cycle', is_active: true, months: 3 },
  { name: 'Semi-Annual', description: 'Semi-annual billing cycle', is_active: true, months: 6 },
  { name: 'Annual', description: 'Annual billing cycle', is_active: true, months: 12 }
];

const BillingFrequenciesConfig = () => {
  const { toast } = useToast();
  const [frequencies, setFrequencies] = useState<BillingFrequency[]>([]);
  const [newFrequency, setNewFrequency] = useState({ name: '', description: '', is_active: true, months: 1 });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '', is_active: true, months: 1 });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFrequencies();
  }, []);

  const fetchFrequencies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_billing_frequencies')
        .select('*')
        .order('months');

      if (error) throw error;

      setFrequencies(data || []);
    } catch (error) {
      console.error('Error fetching billing frequencies:', error);
      toast({
        title: "Error",
        description: "Failed to load billing frequencies.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFrequency = async () => {
    if (newFrequency.name.trim()) {
      try {
        const duplicate = frequencies.find(f => 
          f.name.toLowerCase() === newFrequency.name.trim().toLowerCase()
        );
        
        if (duplicate) {
          toast({
            title: "Duplicate Entry",
            description: "A billing frequency with this name already exists.",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('master_billing_frequencies')
          .insert([{
            name: newFrequency.name.trim(),
            description: newFrequency.description.trim() || null,
            is_active: newFrequency.is_active,
            months: newFrequency.months || null
          }]);

        if (error) throw error;

        setNewFrequency({ name: '', description: '', is_active: true, months: 1 });
        setIsAdding(false);
        fetchFrequencies();
        toast({
          title: "Success",
          description: "Billing frequency added successfully",
        });
      } catch (error) {
        console.error('Error adding billing frequency:', error);
        toast({
          title: "Error",
          description: "Failed to add billing frequency.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditFrequency = (index: number) => {
    setEditingIndex(index);
    setEditingValue({
      name: frequencies[index].name,
      description: frequencies[index].description || '',
      is_active: frequencies[index].is_active,
      months: frequencies[index].months || 1
    });
  };

  const handleSaveEdit = async () => {
    if (editingValue.name.trim() && editingIndex !== null) {
      try {
        const frequencyToUpdate = frequencies[editingIndex];
        
        const { error } = await supabase
          .from('master_billing_frequencies')
          .update({
            name: editingValue.name.trim(),
            description: editingValue.description.trim() || null,
            is_active: editingValue.is_active,
            months: editingValue.months || null
          })
          .eq('id', frequencyToUpdate.id);

        if (error) throw error;

        setEditingIndex(null);
        setEditingValue({ name: '', description: '', is_active: true, months: 1 });
        fetchFrequencies();
        toast({
          title: "Success",
          description: "Billing frequency updated successfully",
        });
      } catch (error) {
        console.error('Error updating billing frequency:', error);
        toast({
          title: "Error",
          description: "Failed to update billing frequency.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteFrequency = async (index: number) => {
    try {
      const frequencyToDelete = frequencies[index];
      
      const { error } = await supabase
        .from('master_billing_frequencies')
        .delete()
        .eq('id', frequencyToDelete.id);

      if (error) throw error;

      fetchFrequencies();
      toast({
        title: "Success",
        description: "Billing frequency deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting billing frequency:', error);
      toast({
        title: "Error",
        description: "Failed to delete billing frequency.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue({ name: '', description: '', is_active: true, months: 1 });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewFrequency({ name: '', description: '', is_active: true, months: 1 });
  };

  const handleResetToDefault = async () => {
    try {
      await supabase.from('master_billing_frequencies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      const { error } = await supabase
        .from('master_billing_frequencies')
        .insert(defaultBillingFrequencies);

      if (error) throw error;

      fetchFrequencies();
      setEditingIndex(null);
      setEditingValue({ name: '', description: '', is_active: true, months: 1 });
      setIsAdding(false);
      setNewFrequency({ name: '', description: '', is_active: true, months: 1 });
      toast({
        title: "Success",
        description: "Billing frequencies reset to default values",
      });
    } catch (error) {
      console.error('Error resetting billing frequencies:', error);
      toast({
        title: "Error",
        description: "Failed to reset billing frequencies.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading billing frequencies...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Billing Frequencies</CardTitle>
            <CardDescription>
              Configure billing cycles for subscription and payment processing
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchFrequencies}
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
          <h3 className="text-lg font-medium">Current Frequencies ({frequencies.length})</h3>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Frequency
          </Button>
        </div>

        {isAdding && (
          <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
            <div className="flex-1 space-y-2">
              <div>
                <Label htmlFor="new-frequency-name">Frequency Name</Label>
                <Input
                  id="new-frequency-name"
                  value={newFrequency.name}
                  onChange={(e) => setNewFrequency({...newFrequency, name: e.target.value})}
                  placeholder="Enter frequency name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-frequency-description">Description</Label>
                <Input
                  id="new-frequency-description"
                  value={newFrequency.description}
                  onChange={(e) => setNewFrequency({...newFrequency, description: e.target.value})}
                  placeholder="Enter description"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="new-frequency-months">Months</Label>
                  <Input
                    id="new-frequency-months"
                    type="number"
                    value={newFrequency.months}
                    onChange={(e) => setNewFrequency({...newFrequency, months: parseInt(e.target.value) || 1})}
                    placeholder="1"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox
                    id="new-frequency-active"
                    checked={newFrequency.is_active}
                    onCheckedChange={(checked) => setNewFrequency({...newFrequency, is_active: checked as boolean})}
                  />
                  <Label htmlFor="new-frequency-active">Active</Label>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-end">
              <Button onClick={handleAddFrequency} size="sm" className="flex items-center gap-1">
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
          {frequencies.map((frequency, index) => (
            <div key={frequency.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              {editingIndex === index ? (
                <div className="flex gap-2 flex-1">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editingValue.name}
                      onChange={(e) => setEditingValue({...editingValue, name: e.target.value})}
                      placeholder="Frequency name"
                    />
                    <Input
                      value={editingValue.description}
                      onChange={(e) => setEditingValue({...editingValue, description: e.target.value})}
                      placeholder="Description"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        value={editingValue.months}
                        onChange={(e) => setEditingValue({...editingValue, months: parseInt(e.target.value) || 1})}
                        placeholder="Months"
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={editingValue.is_active}
                          onCheckedChange={(checked) => setEditingValue({...editingValue, is_active: checked as boolean})}
                        />
                        <Label>Active</Label>
                      </div>
                    </div>
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
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <div>
                      <span className="font-medium">{frequency.name}</span>
                      {frequency.description && <p className="text-sm text-muted-foreground">{frequency.description}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        {frequency.months && <span className="text-sm text-muted-foreground">{frequency.months} months</span>}
                        <Badge variant={frequency.is_active ? "default" : "secondary"}>
                          {frequency.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditFrequency(index)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteFrequency(index)}
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

export default BillingFrequenciesConfig;