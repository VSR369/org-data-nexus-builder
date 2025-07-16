import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ChallengeOverageFeeDialogProps {
  mode: 'add' | 'edit' | 'delete';
  item?: any;
  onSuccess: () => void;
  children?: React.ReactNode;
}

export const ChallengeOverageFeeDialog: React.FC<ChallengeOverageFeeDialogProps> = ({
  mode,
  item,
  onSuccess,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    country_id: '',
    currency_id: '',
    pricing_tier_id: '',
    fee_per_additional_challenge: 0,
    is_active: true
  });
  
  const [options, setOptions] = useState({
    countries: [],
    currencies: [],
    pricingTiers: []
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (item && mode === 'edit') {
      setFormData({
        country_id: item.country_id || '',
        currency_id: item.currency_id || '',
        pricing_tier_id: item.pricing_tier_id || '',
        fee_per_additional_challenge: item.fee_per_additional_challenge || 0,
        is_active: item.is_active ?? true
      });
    }
  }, [item, mode]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [countries, currencies, pricingTiers] = await Promise.all([
        supabase.from('master_countries').select('id, name'),
        supabase.from('master_currencies').select('id, name, code, symbol'),
        supabase.from('master_pricing_tiers').select('id, name').eq('is_active', true)
      ]);

      setOptions({
        countries: countries.data || [],
        currencies: currencies.data || [],
        pricingTiers: pricingTiers.data || []
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
          .from('master_challenge_overage_fees')
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Challenge overage fee added successfully",
        });
      } else if (mode === 'edit') {
        const { error } = await supabase
          .from('master_challenge_overage_fees')
          .update(formData)
          .eq('id', item.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Challenge overage fee updated successfully",
        });
      } else if (mode === 'delete') {
        const { error } = await supabase
          .from('master_challenge_overage_fees')
          .delete()
          .eq('id', item.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Challenge overage fee deleted successfully",
        });
      }

      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: `Failed to ${mode} challenge overage fee`,
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
          <p>Are you sure you want to delete this challenge overage fee?</p>
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
            <Label htmlFor="country_id">Country *</Label>
            <Select
              value={formData.country_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, country_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {options.countries.map((country: any) => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="currency_id">Currency *</Label>
            <Select
              value={formData.currency_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, currency_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {options.currencies.map((currency: any) => (
                  <SelectItem key={currency.id} value={currency.id}>
                    {currency.name} ({currency.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <Label htmlFor="fee_per_additional_challenge">Fee per Additional Challenge *</Label>
            <Input
              id="fee_per_additional_challenge"
              type="number"
              step="0.01"
              value={formData.fee_per_additional_challenge}
              onChange={(e) => setFormData(prev => ({ ...prev, fee_per_additional_challenge: parseFloat(e.target.value) || 0 }))}
              min="0"
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="is_active">Active</Label>
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
            {mode === 'add' && 'Add Challenge Overage Fee'}
            {mode === 'edit' && 'Edit Challenge Overage Fee'}
            {mode === 'delete' && 'Delete Challenge Overage Fee'}
          </DialogTitle>
        </DialogHeader>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
};