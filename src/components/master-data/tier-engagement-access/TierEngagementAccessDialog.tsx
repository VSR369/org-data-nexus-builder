import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, Plus, Edit, Trash2 } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pricing_tier_id: '',
    engagement_model_id: '',
    is_allowed: true,
    is_default: false,
    selection_scope: 'per_challenge',
    max_concurrent_models: 1,
    switch_requirements: 'none',
    allows_multiple_challenges: true,
    business_rules: {},
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
        selection_scope: item.selection_scope || 'per_challenge',
        max_concurrent_models: item.max_concurrent_models || 1,
        switch_requirements: item.switch_requirements || 'none',
        allows_multiple_challenges: item.allows_multiple_challenges ?? true,
        business_rules: item.business_rules || {},
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

      if (onSuccess) onSuccess();
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
              <DialogTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogTrigger>
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

        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="selection_scope">Selection Scope</Label>
            <Select
              value={formData.selection_scope}
              onValueChange={(value) => setFormData(prev => ({ ...prev, selection_scope: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global (Basic Tier)</SelectItem>
                <SelectItem value="per_challenge">Per Challenge (Standard/Premium)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="max_concurrent_models">Max Concurrent Models</Label>
            <Input
              id="max_concurrent_models"
              type="number"
              min="1"
              max="999"
              value={formData.max_concurrent_models}
              onChange={(e) => setFormData(prev => ({ ...prev, max_concurrent_models: parseInt(e.target.value) || 1 }))}
            />
          </div>

          <div>
            <Label htmlFor="switch_requirements">Switch Requirements</Label>
            <Select
              value={formData.switch_requirements}
              onValueChange={(value) => setFormData(prev => ({ ...prev, switch_requirements: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select requirements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_active_challenges">No Active Challenges (Basic)</SelectItem>
                <SelectItem value="none">None (Standard/Premium)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Switch
              id="allows_multiple_challenges"
              checked={formData.allows_multiple_challenges}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allows_multiple_challenges: checked }))}
            />
            <Label htmlFor="allows_multiple_challenges">Allows Multiple Challenges</Label>
          </div>
        </div>

        <div>
          <Label htmlFor="business_rules">Business Rules (JSON)</Label>
          <Textarea
            id="business_rules"
            placeholder='{"description": "Tier-specific rules", "restrictions": []}'
            value={JSON.stringify(formData.business_rules, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value || '{}');
                setFormData(prev => ({ ...prev, business_rules: parsed }));
              } catch (error) {
                // Keep the text as-is if not valid JSON
              }
            }}
            className="min-h-[100px] font-mono text-sm"
          />
        </div>

        {formData.selection_scope === 'global' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Basic Tier Rules</h4>
                <ul className="text-sm text-blue-800 mt-1 space-y-1">
                  <li>• Multiple challenges allowed but only one global engagement model</li>
                  <li>• Must complete/pause all active challenges before switching models</li>
                  <li>• Selected model applies to all challenges within the tier</li>
                </ul>
              </div>
            </div>
          </div>
        )}

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
          <DialogTrigger asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : mode === 'add' ? 'Add' : 'Update'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant={mode === 'delete' ? 'destructive' : 'default'} 
          size="sm"
        >
          {children || (
            <>
              {mode === 'add' && <Plus className="w-4 h-4 mr-2" />}
              {mode === 'edit' && <Edit className="w-4 h-4 mr-2" />}
              {mode === 'delete' && <Trash2 className="w-4 h-4 mr-2" />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </>
          )}
        </Button>
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