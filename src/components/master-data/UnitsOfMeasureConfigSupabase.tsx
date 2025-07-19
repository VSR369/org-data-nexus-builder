
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, Edit, Trash2, Save, X, RotateCcw, Search, 
  Ruler, Percent, AlertTriangle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UnitOfMeasure {
  id: string;
  name: string;
  description?: string;
  symbol?: string;
  is_percentage: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const defaultUnitsOfMeasure = [
  { name: 'Currency', description: 'Monetary units', symbol: '$', is_percentage: false, is_active: true },
  { name: 'Percentage', description: 'Percentage value', symbol: '%', is_percentage: true, is_active: true },
  { name: 'Fixed Amount', description: 'Fixed monetary amount', symbol: 'Fixed', is_percentage: false, is_active: true },
  { name: 'Per Unit', description: 'Per unit calculation', symbol: 'Unit', is_percentage: false, is_active: true },
  { name: 'Per Hour', description: 'Hourly rate', symbol: 'hr', is_percentage: false, is_active: true },
  { name: 'Per Day', description: 'Daily rate', symbol: 'day', is_percentage: false, is_active: true }
];

const UnitsOfMeasureConfigSupabase = () => {
  const { toast } = useToast();
  const [units, setUnits] = useState<UnitOfMeasure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [newUnit, setNewUnit] = useState({ 
    name: '', 
    description: '', 
    symbol: '',
    is_percentage: false,
    is_active: true 
  });
  const [editingItem, setEditingItem] = useState<UnitOfMeasure | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, item: UnitOfMeasure} | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

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
      console.log('✅ Units of Measure loaded:', data);
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
            symbol: newUnit.symbol.trim() || null,
            is_percentage: newUnit.is_percentage,
            is_active: newUnit.is_active
          }]);

        if (error) throw error;

        setNewUnit({ name: '', description: '', symbol: '', is_percentage: false, is_active: true });
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

  const handleResetToDefault = async () => {
    try {
      // Clear existing units
      await supabase.from('master_units_of_measure').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert default units
      const { error } = await supabase
        .from('master_units_of_measure')
        .insert(defaultUnitsOfMeasure);

      if (error) throw error;

      fetchUnits();
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

  const handleEdit = (item: UnitOfMeasure) => {
    setEditingItem({ ...item });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      const { error } = await supabase
        .from('master_units_of_measure')
        .update({
          name: editingItem.name.trim(),
          description: editingItem.description?.trim() || null,
          symbol: editingItem.symbol?.trim() || null,
          is_percentage: editingItem.is_percentage,
          is_active: editingItem.is_active
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      setEditingItem(null);
      setShowEditDialog(false);
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
  };

  const handleDelete = async (item: UnitOfMeasure) => {
    try {
      const { error } = await supabase
        .from('master_units_of_measure')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      setDeleteDialog(null);
      fetchUnits();
      toast({
        title: "Deleted",
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

  const handleToggleStatus = async (item: UnitOfMeasure) => {
    try {
      const { error } = await supabase
        .from('master_units_of_measure')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;

      fetchUnits();
      toast({
        title: "Status Updated",
        description: `Unit of measure ${!item.is_active ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  // Filter units based on search term
  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (unit.description && unit.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (unit.symbol && unit.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading units of measure...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="w-6 h-6" />
                Units of Measure Manager
              </CardTitle>
              <CardDescription>
                Manage units of measurement for various metrics and calculations
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
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
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search units of measure..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Units of Measure Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold">{units.length}</div>
              <div className="text-sm text-muted-foreground">Total Units</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {units.filter(u => u.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Active Units</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {units.filter(u => u.is_percentage).length}
              </div>
              <div className="text-sm text-muted-foreground">Percentage Units</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {units.filter(u => !u.is_percentage).length}
              </div>
              <div className="text-sm text-muted-foreground">Fixed Units</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Unit */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Units of Measure</CardTitle>
            <Button 
              onClick={() => setIsAdding(true)} 
              disabled={isAdding}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Unit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding && (
            <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                    <Label htmlFor="new-unit-symbol">Symbol</Label>
                    <Input
                      id="new-unit-symbol"
                      value={newUnit.symbol}
                      onChange={(e) => setNewUnit({...newUnit, symbol: e.target.value})}
                      placeholder="Enter symbol"
                      className="mt-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="new-unit-percentage"
                        checked={newUnit.is_percentage}
                        onCheckedChange={(checked) => setNewUnit({...newUnit, is_percentage: checked})}
                      />
                      <Label htmlFor="new-unit-percentage">Is Percentage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="new-unit-active"
                        checked={newUnit.is_active}
                        onCheckedChange={(checked) => setNewUnit({...newUnit, is_active: checked})}
                      />
                      <Label htmlFor="new-unit-active">Active</Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-unit-description">Description</Label>
                  <Textarea
                    id="new-unit-description"
                    value={newUnit.description}
                    onChange={(e) => setNewUnit({...newUnit, description: e.target.value})}
                    placeholder="Enter description"
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex gap-2 items-end">
                <Button onClick={handleAddUnit} size="sm" className="flex items-center gap-1">
                  <Save className="w-3 h-3" />
                  Save
                </Button>
                <Button onClick={() => setIsAdding(false)} variant="outline" size="sm" className="flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Units List */}
          <div className="space-y-4">
            {filteredUnits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Ruler className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No units of measure found. Add some units to get started.</p>
              </div>
            ) : (
              filteredUnits.map((unit) => (
                <div key={unit.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{unit.name}</span>
                        {unit.symbol && (
                          <Badge variant="outline">{unit.symbol}</Badge>
                        )}
                        <Badge variant={unit.is_active ? "default" : "secondary"}>
                          {unit.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {unit.is_percentage && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Percent className="w-3 h-3" />
                            Percentage
                          </Badge>
                        )}
                      </div>
                      {unit.description && (
                        <p className="text-sm text-muted-foreground mt-1">{unit.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleToggleStatus(unit)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Switch checked={unit.is_active} className="w-3 h-3" />
                      {unit.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      onClick={() => handleEdit(unit)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteDialog({ open: true, item: unit })}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog?.open} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the unit of measure "{deleteDialog?.item?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteDialog && handleDelete(deleteDialog.item)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UnitsOfMeasureConfigSupabase;
