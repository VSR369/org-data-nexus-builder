
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, Edit, Trash2, Save, X, RotateCcw, Search, 
  Calendar, AlertTriangle
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

interface BillingFrequency {
  id: string;
  name: string;
  description?: string;
  months?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const defaultBillingFrequencies = [
  { name: 'Monthly', description: 'Monthly billing cycle', months: 1, is_active: true },
  { name: 'Quarterly', description: 'Quarterly billing cycle', months: 3, is_active: true },
  { name: 'Semi-Annual', description: 'Semi-annual billing cycle', months: 6, is_active: true },
  { name: 'Annual', description: 'Annual billing cycle', months: 12, is_active: true }
];

const BillingFrequenciesConfigSupabase = () => {
  const { toast } = useToast();
  const [frequencies, setFrequencies] = useState<BillingFrequency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [newFrequency, setNewFrequency] = useState({ 
    name: '', 
    description: '', 
    months: 1,
    is_active: true 
  });
  const [editingItem, setEditingItem] = useState<BillingFrequency | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, item: BillingFrequency} | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

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
      console.log('✅ Billing Frequencies loaded:', data);
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
            months: newFrequency.months,
            is_active: newFrequency.is_active
          }]);

        if (error) throw error;

        setNewFrequency({ name: '', description: '', months: 1, is_active: true });
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

  const handleResetToDefault = async () => {
    try {
      // Clear existing frequencies
      await supabase.from('master_billing_frequencies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert default frequencies
      const { error } = await supabase
        .from('master_billing_frequencies')
        .insert(defaultBillingFrequencies);

      if (error) throw error;

      fetchFrequencies();
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

  const handleEdit = (item: BillingFrequency) => {
    setEditingItem({ ...item });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      const { error } = await supabase
        .from('master_billing_frequencies')
        .update({
          name: editingItem.name.trim(),
          description: editingItem.description?.trim() || null,
          months: editingItem.months,
          is_active: editingItem.is_active
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      setEditingItem(null);
      setShowEditDialog(false);
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
  };

  const handleDelete = async (item: BillingFrequency) => {
    try {
      const { error } = await supabase
        .from('master_billing_frequencies')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      setDeleteDialog(null);
      fetchFrequencies();
      toast({
        title: "Deleted",
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

  const handleToggleStatus = async (item: BillingFrequency) => {
    try {
      const { error } = await supabase
        .from('master_billing_frequencies')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;

      fetchFrequencies();
      toast({
        title: "Status Updated",
        description: `Billing frequency ${!item.is_active ? 'activated' : 'deactivated'}`,
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

  // Filter frequencies based on search term
  const filteredFrequencies = frequencies.filter(freq => 
    freq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (freq.description && freq.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading billing frequencies...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Billing Frequencies Manager
              </CardTitle>
              <CardDescription>
                Manage billing frequency options for subscription services
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
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
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search billing frequencies..."
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
            <Calendar className="w-5 h-5" />
            Billing Frequencies Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold">{frequencies.length}</div>
              <div className="text-sm text-muted-foreground">Total Frequencies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {frequencies.filter(f => f.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Active Frequencies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {frequencies.filter(f => !f.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Inactive Frequencies</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Frequency */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Billing Frequencies</CardTitle>
            <Button 
              onClick={() => setIsAdding(true)} 
              disabled={isAdding}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Frequency
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding && (
            <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                    <Switch
                      id="new-frequency-active"
                      checked={newFrequency.is_active}
                      onCheckedChange={(checked) => setNewFrequency({...newFrequency, is_active: checked})}
                    />
                    <Label htmlFor="new-frequency-active">Active</Label>
                  </div>
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
              </div>
              <div className="flex gap-2 items-end">
                <Button onClick={handleAddFrequency} size="sm" className="flex items-center gap-1">
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

          {/* Frequencies List */}
          <div className="space-y-4">
            {filteredFrequencies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No billing frequencies found. Add some frequencies to get started.</p>
              </div>
            ) : (
              filteredFrequencies.map((frequency) => (
                <div key={frequency.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{frequency.name}</span>
                        <Badge variant={frequency.is_active ? "default" : "secondary"}>
                          {frequency.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {frequency.months && (
                          <Badge variant="outline">
                            {frequency.months} month{frequency.months !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      {frequency.description && (
                        <p className="text-sm text-muted-foreground mt-1">{frequency.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleToggleStatus(frequency)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Switch checked={frequency.is_active} className="w-3 h-3" />
                      {frequency.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      onClick={() => handleEdit(frequency)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteDialog({ open: true, item: frequency })}
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
              This will permanently delete the billing frequency "{deleteDialog?.item?.name}". 
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

export default BillingFrequenciesConfigSupabase;
