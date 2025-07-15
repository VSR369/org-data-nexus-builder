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

interface UnitOfMeasure {
  id?: string;
  name: string;
  description?: string;
  is_active: boolean;
  is_percentage: boolean;
  symbol?: string;
}

const defaultUnitsOfMeasure = [
  { name: 'US Dollar', description: 'US Dollar currency', is_active: true, is_percentage: false, symbol: '$' },
  { name: 'Euro', description: 'Euro currency', is_active: true, is_percentage: false, symbol: '€' },
  { name: 'Percentage', description: 'Percentage value', is_active: true, is_percentage: true, symbol: '%' },
  { name: 'Units', description: 'Generic units', is_active: true, is_percentage: false, symbol: 'units' },
  { name: 'Hours', description: 'Time in hours', is_active: true, is_percentage: false, symbol: 'hrs' }
];

const UnitsOfMeasureConfig = () => {
  const { toast } = useToast();
  const [units, setUnits] = useState<UnitOfMeasure[]>([]);
  const [newUnit, setNewUnit] = useState({ name: '', description: '', is_active: true, is_percentage: false, symbol: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '', is_active: true, is_percentage: false, symbol: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_units_of_measure')
        .select('*')
        .order('name');

      if (error) throw error;

      setUnits(data || []);
    } catch (error) {
      console.error('Error fetching units of measure:', error);
      toast({
        title: "Error",
        description: "Failed to load units of measure.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUnit = async () => {
    if (newUnit.name.trim()) {
      try {
        const duplicate = units.find(u => 
          u.name.toLowerCase() === newUnit.name.trim().toLowerCase()
        );
        
        if (duplicate) {
          toast({
            title: "Duplicate Entry",
            description: "A unit of measure with this name already exists.",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('master_units_of_measure')
          .insert([{
            name: newUnit.name.trim(),
            description: newUnit.description.trim() || null,
            is_active: newUnit.is_active,
            is_percentage: newUnit.is_percentage,
            symbol: newUnit.symbol.trim() || null
          }]);

        if (error) throw error;

        setNewUnit({ name: '', description: '', is_active: true, is_percentage: false, symbol: '' });
        setIsAdding(false);
        fetchUnits();
        toast({
          title: "Success",
          description: "Unit of measure added successfully",
        });
      } catch (error) {
        console.error('Error adding unit of measure:', error);
        toast({
          title: "Error",
          description: "Failed to add unit of measure.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditUnit = (index: number) => {
    setEditingIndex(index);
    setEditingValue({
      name: units[index].name,
      description: units[index].description || '',
      is_active: units[index].is_active,
      is_percentage: units[index].is_percentage,
      symbol: units[index].symbol || ''
    });
  };

  const handleSaveEdit = async () => {
    if (editingValue.name.trim() && editingIndex !== null) {
      try {
        const unitToUpdate = units[editingIndex];
        
        const { error } = await supabase
          .from('master_units_of_measure')
          .update({
            name: editingValue.name.trim(),
            description: editingValue.description.trim() || null,
            is_active: editingValue.is_active,
            is_percentage: editingValue.is_percentage,
            symbol: editingValue.symbol.trim() || null
          })
          .eq('id', unitToUpdate.id);

        if (error) throw error;

        setEditingIndex(null);
        setEditingValue({ name: '', description: '', is_active: true, is_percentage: false, symbol: '' });
        fetchUnits();
        toast({
          title: "Success",
          description: "Unit of measure updated successfully",
        });
      } catch (error) {
        console.error('Error updating unit of measure:', error);
        toast({
          title: "Error",
          description: "Failed to update unit of measure.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteUnit = async (index: number) => {
    try {
      const unitToDelete = units[index];
      
      const { error } = await supabase
        .from('master_units_of_measure')
        .delete()
        .eq('id', unitToDelete.id);

      if (error) throw error;

      fetchUnits();
      toast({
        title: "Success",
        description: "Unit of measure deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting unit of measure:', error);
      toast({
        title: "Error",
        description: "Failed to delete unit of measure.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue({ name: '', description: '', is_active: true, is_percentage: false, symbol: '' });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewUnit({ name: '', description: '', is_active: true, is_percentage: false, symbol: '' });
  };

  const handleResetToDefault = async () => {
    try {
      await supabase.from('master_units_of_measure').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      const { error } = await supabase
        .from('master_units_of_measure')
        .insert(defaultUnitsOfMeasure);

      if (error) throw error;

      fetchUnits();
      setEditingIndex(null);
      setEditingValue({ name: '', description: '', is_active: true, is_percentage: false, symbol: '' });
      setIsAdding(false);
      setNewUnit({ name: '', description: '', is_active: true, is_percentage: false, symbol: '' });
      toast({
        title: "Success",
        description: "Units of measure reset to default values",
      });
    } catch (error) {
      console.error('Error resetting units of measure:', error);
      toast({
        title: "Error",
        description: "Failed to reset units of measure.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading units of measure...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Units of Measure</CardTitle>
            <CardDescription>
              Configure measurement units for pricing and calculations
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchUnits}
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
          <h3 className="text-lg font-medium">Current Units ({units.length})</h3>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Unit
          </Button>
        </div>

        {isAdding && (
          <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
            <div className="flex-1 space-y-2">
              <div>
                <Label htmlFor="new-unit-name">Unit Name</Label>
                <Input
                  id="new-unit-name"
                  value={newUnit.name}
                  onChange={(e) => setNewUnit({...newUnit, name: e.target.value})}
                  placeholder="Enter unit name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-unit-description">Description</Label>
                <Input
                  id="new-unit-description"
                  value={newUnit.description}
                  onChange={(e) => setNewUnit({...newUnit, description: e.target.value})}
                  placeholder="Enter description"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="new-unit-symbol">Symbol</Label>
                  <Input
                    id="new-unit-symbol"
                    value={newUnit.symbol}
                    onChange={(e) => setNewUnit({...newUnit, symbol: e.target.value})}
                    placeholder="$, %, etc."
                    className="mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new-unit-active"
                      checked={newUnit.is_active}
                      onCheckedChange={(checked) => setNewUnit({...newUnit, is_active: checked as boolean})}
                    />
                    <Label htmlFor="new-unit-active">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new-unit-percentage"
                      checked={newUnit.is_percentage}
                      onCheckedChange={(checked) => setNewUnit({...newUnit, is_percentage: checked as boolean})}
                    />
                    <Label htmlFor="new-unit-percentage">Percentage</Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-end">
              <Button onClick={handleAddUnit} size="sm" className="flex items-center gap-1">
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
          {units.map((unit, index) => (
            <div key={unit.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              {editingIndex === index ? (
                <div className="flex gap-2 flex-1">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editingValue.name}
                      onChange={(e) => setEditingValue({...editingValue, name: e.target.value})}
                      placeholder="Unit name"
                    />
                    <Input
                      value={editingValue.description}
                      onChange={(e) => setEditingValue({...editingValue, description: e.target.value})}
                      placeholder="Description"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={editingValue.symbol}
                        onChange={(e) => setEditingValue({...editingValue, symbol: e.target.value})}
                        placeholder="Symbol"
                      />
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={editingValue.is_active}
                            onCheckedChange={(checked) => setEditingValue({...editingValue, is_active: checked as boolean})}
                          />
                          <Label>Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={editingValue.is_percentage}
                            onCheckedChange={(checked) => setEditingValue({...editingValue, is_percentage: checked as boolean})}
                          />
                          <Label>Percentage</Label>
                        </div>
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
                      <span className="font-medium">{unit.name}</span>
                      {unit.description && <p className="text-sm text-muted-foreground">{unit.description}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        {unit.symbol && <span className="text-sm text-muted-foreground">{unit.symbol}</span>}
                        <Badge variant={unit.is_active ? "default" : "secondary"}>
                          {unit.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {unit.is_percentage && <Badge variant="outline">Percentage</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditUnit(index)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteUnit(index)}
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

export default UnitsOfMeasureConfig;