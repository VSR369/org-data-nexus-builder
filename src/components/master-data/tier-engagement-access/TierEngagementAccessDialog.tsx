import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TierEngagementAccessDialogProps {
  mode: 'add' | 'edit' | 'delete';
  item?: any;
  onSuccess: () => void;
  children?: React.ReactNode;
}

export const TierEngagementAccessDialog: React.FC<TierEngagementAccessDialogProps> = ({
  mode,
  item,
  onSuccess,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pricing_tier_id: '',
    engagement_model_id: '',
    is_allowed: true,
    is_default: false,
    selection_type: 'per_challenge',
    is_active: true
  });
  
  const [options, setOptions] = useState({
    pricingTiers: [],
    engagementModels: []
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (item && mode === 'edit') {
      setFormData({
        pricing_tier_id: item.pricing_tier_id || '',
        engagement_model_id: item.engagement_model_id || '',
        is_allowed: item.is_allowed ?? true,
        is_default: item.is_default ?? false,
        selection_type: item.selection_type || 'per_challenge',
        is_active: item.is_active ?? true
      });
    }
  }, [item, mode]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [pricingTiers, engagementModels] = await Promise.all([
        supabase.from('master_pricing_tiers').select('id, name').eq('is_active', true),
        supabase.from('master_engagement_models').select('id, name')
      ]);

      setOptions({
        pricingTiers: pricingTiers.data || [],
        engagementModels: engagementModels.data || []
      });
    } catch (error) {
      console.error('Error loading options:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'add') {
        const { error } = await supabase
          .from('master_tier_engagement_model_access')
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Tier engagement access added successfully",
        });
      } else if (mode === 'edit') {
        const { error } = await supabase
          .from('master_tier_engagement_model_access')
          .update(formData)
          .eq('id', item.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Tier engagement access updated successfully",
        });
      } else if (mode === 'delete') {
        const { error } = await supabase
          .from('master_tier_engagement_model_access')
          .delete()
          .eq('id', item.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Tier engagement access deleted successfully",
        });
      }

      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: `Failed to ${mode} tier engagement access`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderDialogContent = () => {
    if (mode === 'delete') {
      return (
        <div className="space-y-4">
          <p>Are you sure you want to delete this tier engagement access?</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pricing_tier_id">Pricing Tier *</Label>
            <Select
              value={formData.pricing_tier_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, pricing_tier_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pricing tier" />
              </SelectTrigger>
              <SelectContent>
                {options.pricingTiers.map((tier: any) => (
                  <SelectItem key={tier.id} value={tier.id}>
                    {tier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="engagement_model_id">Engagement Model *</Label>
            <Select
              value={formData.engagement_model_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, engagement_model_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select engagement model" />
              </SelectTrigger>
              <SelectContent>
                {options.engagementModels.map((model: any) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="selection_type">Selection Type</Label>
            <Select
              value={formData.selection_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, selection_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select selection type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per_challenge">Per Challenge</SelectItem>
                <SelectItem value="per_project">Per Project</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_allowed"
              checked={formData.is_allowed}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_allowed: checked }))}
            />
            <Label htmlFor="is_allowed">Allowed</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
            />
            <Label htmlFor="is_default">Default</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : mode === 'add' ? 'Add' : 'Update'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={mode === 'delete' ? 'destructive' : 'default'} size="sm">
            {mode === 'add' && <Plus className="w-4 h-4 mr-2" />}
            {mode === 'edit' && <Edit className="w-4 h-4 mr-2" />}
            {mode === 'delete' && <Trash2 className="w-4 h-4 mr-2" />}
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' && 'Add Tier Engagement Access'}
            {mode === 'edit' && 'Edit Tier Engagement Access'}
            {mode === 'delete' && 'Delete Tier Engagement Access'}
          </DialogTitle>
        </DialogHeader>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
};