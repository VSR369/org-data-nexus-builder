
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
  Crown, TrendingUp, AlertTriangle
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

interface PricingTier {
  id: string;
  name: string;
  description?: string;
  level_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  tier_configurations?: TierConfiguration[];
}

interface TierConfiguration {
  id: string;
  monthly_challenge_limit?: number;
  solutions_per_challenge: number;
  allows_overage: boolean;
  fixed_charge_per_challenge: number;
  country?: {
    name: string;
  };
  currency?: {
    code: string;
  };
}

const defaultPricingTiers = [
  { name: 'Basic', description: 'Basic tier with limited features', level_order: 1, is_active: true },
  { name: 'Standard', description: 'Standard tier with enhanced features', level_order: 2, is_active: true },
  { name: 'Premium', description: 'Premium tier with advanced features', level_order: 3, is_active: true },
  { name: 'Enterprise', description: 'Enterprise tier with full features', level_order: 4, is_active: true }
];

const PricingTiersConfigSupabase = () => {
  const { toast } = useToast();
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [newTier, setNewTier] = useState({ 
    name: '', 
    description: '', 
    level_order: 1,
    is_active: true 
  });
  const [editingItem, setEditingItem] = useState<PricingTier | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, item: PricingTier} | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      setLoading(true);
      
      // Fetch pricing tiers with related configurations
      const { data: tiersData, error: tiersError } = await supabase
        .from('master_pricing_tiers')
        .select(`
          *,
          tier_configurations:master_tier_configurations(
            *,
            country:master_countries(name),
            currency:master_currencies(code)
          )
        `)
        .order('level_order');

      if (tiersError) throw tiersError;

      setTiers(tiersData || []);
      console.log('✅ Pricing Tiers loaded:', tiersData);
    } catch (error) {
      console.error('Error fetching pricing tiers:', error);
      toast({
        title: "Error",
        description: "Failed to load pricing tiers.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTier = async () => {
    if (newTier.name.trim()) {
      try {
        const duplicate = tiers.find(t => 
          t.name.toLowerCase() === newTier.name.trim().toLowerCase()
        );
        
        if (duplicate) {
          toast({
            title: "Duplicate Entry",
            description: "A pricing tier with this name already exists.",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('master_pricing_tiers')
          .insert([{
            name: newTier.name.trim(),
            description: newTier.description.trim() || null,
            level_order: newTier.level_order,
            is_active: newTier.is_active
          }]);

        if (error) throw error;

        setNewTier({ name: '', description: '', level_order: 1, is_active: true });
        setIsAdding(false);
        fetchTiers();
        toast({
          title: "Success",
          description: "Pricing tier added successfully",
        });
      } catch (error) {
        console.error('Error adding pricing tier:', error);
        toast({
          title: "Error",
          description: "Failed to add pricing tier.",
          variant: "destructive",
        });
      }
    }
  };

  const handleResetToDefault = async () => {
    try {
      // Clear existing tiers
      await supabase.from('master_pricing_tiers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert default tiers
      const { error } = await supabase
        .from('master_pricing_tiers')
        .insert(defaultPricingTiers);

      if (error) throw error;

      fetchTiers();
      toast({
        title: "Success",
        description: "Pricing tiers reset to default values",
      });
    } catch (error) {
      console.error('Error resetting pricing tiers:', error);
      toast({
        title: "Error",
        description: "Failed to reset pricing tiers.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: PricingTier) => {
    setEditingItem({ ...item });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      const { error } = await supabase
        .from('master_pricing_tiers')
        .update({
          name: editingItem.name.trim(),
          description: editingItem.description?.trim() || null,
          level_order: editingItem.level_order,
          is_active: editingItem.is_active
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      setEditingItem(null);
      setShowEditDialog(false);
      fetchTiers();
      toast({
        title: "Success",
        description: "Pricing tier updated successfully",
      });
    } catch (error) {
      console.error('Error updating pricing tier:', error);
      toast({
        title: "Error",
        description: "Failed to update pricing tier.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (item: PricingTier) => {
    try {
      const { error } = await supabase
        .from('master_pricing_tiers')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      setDeleteDialog(null);
      fetchTiers();
      toast({
        title: "Deleted",
        description: "Pricing tier deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting pricing tier:', error);
      toast({
        title: "Error",
        description: "Failed to delete pricing tier.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (item: PricingTier) => {
    try {
      const { error } = await supabase
        .from('master_pricing_tiers')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;

      fetchTiers();
      toast({
        title: "Status Updated",
        description: `Pricing tier ${!item.is_active ? 'activated' : 'deactivated'}`,
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

  const getTierIcon = (levelOrder: number) => {
    switch (levelOrder) {
      case 1:
        return <Badge variant="outline" className="bg-gray-50">Basic</Badge>;
      case 2:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Standard</Badge>;
      case 3:
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Premium</Badge>;
      case 4:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700"><Crown className="w-3 h-3 mr-1" />Enterprise</Badge>;
      default:
        return <Badge variant="outline">Tier {levelOrder}</Badge>;
    }
  };

  // Filter tiers based on search term
  const filteredTiers = tiers.filter(tier => 
    tier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tier.description && tier.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading pricing tiers...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Pricing Tiers Manager
              </CardTitle>
              <CardDescription>
                Manage pricing tier levels and configurations for service offerings
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={fetchTiers}
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
              placeholder="Search pricing tiers..."
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
            <Crown className="w-5 h-5" />
            Pricing Tiers Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold">{tiers.length}</div>
              <div className="text-sm text-muted-foreground">Total Tiers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {tiers.filter(t => t.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Active Tiers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {tiers.reduce((sum, t) => sum + (t.tier_configurations?.length || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Configurations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Tier */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pricing Tiers</CardTitle>
            <Button 
              onClick={() => setIsAdding(true)} 
              disabled={isAdding}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Tier
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdding && (
            <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="new-tier-name">Tier Name</Label>
                    <Input
                      id="new-tier-name"
                      value={newTier.name}
                      onChange={(e) => setNewTier({...newTier, name: e.target.value})}
                      placeholder="Enter tier name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-tier-order">Level Order</Label>
                    <Input
                      id="new-tier-order"
                      type="number"
                      value={newTier.level_order}
                      onChange={(e) => setNewTier({...newTier, level_order: parseInt(e.target.value) || 1})}
                      placeholder="1"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Switch
                      id="new-tier-active"
                      checked={newTier.is_active}
                      onCheckedChange={(checked) => setNewTier({...newTier, is_active: checked})}
                    />
                    <Label htmlFor="new-tier-active">Active</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-tier-description">Description</Label>
                  <Textarea
                    id="new-tier-description"
                    value={newTier.description}
                    onChange={(e) => setNewTier({...newTier, description: e.target.value})}
                    placeholder="Enter description"
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex gap-2 items-end">
                <Button onClick={handleAddTier} size="sm" className="flex items-center gap-1">
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

          {/* Tiers List */}
          <div className="space-y-4">
            {filteredTiers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Crown className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pricing tiers found. Add some tiers to get started.</p>
              </div>
            ) : (
              filteredTiers.map((tier) => (
                <div key={tier.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tier.name}</span>
                        {getTierIcon(tier.level_order)}
                        <Badge variant={tier.is_active ? "default" : "secondary"}>
                          {tier.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          Level {tier.level_order}
                        </Badge>
                      </div>
                      {tier.description && (
                        <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {tier.tier_configurations && (
                          <span>{tier.tier_configurations.length} configuration{tier.tier_configurations.length !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleToggleStatus(tier)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Switch checked={tier.is_active} className="w-3 h-3" />
                      {tier.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      onClick={() => handleEdit(tier)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteDialog({ open: true, item: tier })}
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
              This will permanently delete the pricing tier "{deleteDialog?.item?.name}". 
              This action cannot be undone and may affect related configurations.
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

export default PricingTiersConfigSupabase;
