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

interface TierConfigurationDialogProps {
  mode: 'add' | 'edit' | 'delete';
  item?: any;
  onSuccess: () => void;
  children?: React.ReactNode;
}

export const TierConfigurationDialog: React.FC<TierConfigurationDialogProps> = ({
  mode,
  item,
  onSuccess,
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pricing_tier_id: '',
    country_id: '',
    currency_id: '',
    monthly_challenge_limit: 0,
    solutions_per_challenge: 1,
    fixed_charge_per_challenge: 0,
    allows_overage: false,
    analytics_access_id: '',
    onboarding_type_id: '',
    support_type_id: '',
    workflow_template_id: '',
    is_active: true
  });
  
  const [options, setOptions] = useState({
    pricingTiers: [],
    countries: [],
    currencies: [],
    analyticsAccess: [],
    onboardingTypes: [],
    supportTypes: [],
    workflowTemplates: []
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (item && mode === 'edit') {
      setFormData({
        pricing_tier_id: item.pricing_tier_id || '',
        country_id: item.country_id || '',
        currency_id: item.currency_id || '',
        monthly_challenge_limit: item.monthly_challenge_limit || 0,
        solutions_per_challenge: item.solutions_per_challenge || 1,
        fixed_charge_per_challenge: item.fixed_charge_per_challenge || 0,
        allows_overage: item.allows_overage || false,
        analytics_access_id: item.analytics_access_id || '',
        onboarding_type_id: item.onboarding_type_id || '',
        support_type_id: item.support_type_id || '',
        workflow_template_id: item.workflow_template_id || '',
        is_active: item.is_active ?? true
      });
    }
  }, [item, mode]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [pricingTiers, countries, currencies, analyticsAccess, onboardingTypes, supportTypes, workflowTemplates] = await Promise.all([
        supabase.from('master_pricing_tiers').select('id, name').eq('is_active', true),
        supabase.from('master_countries').select('id, name'),
        supabase.from('master_currencies').select('id, name, code, symbol, country'),
        supabase.from('master_analytics_access_types').select('id, name').eq('is_active', true),
        supabase.from('master_onboarding_types').select('id, name').eq('is_active', true),
        supabase.from('master_support_types').select('id, name').eq('is_active', true),
        supabase.from('master_workflow_templates').select('id, name').eq('is_active', true)
      ]);

      setOptions({
        pricingTiers: pricingTiers.data || [],
        countries: countries.data || [],
        currencies: currencies.data || [],
        analyticsAccess: analyticsAccess.data || [],
        onboardingTypes: onboardingTypes.data || [],
        supportTypes: supportTypes.data || [],
        workflowTemplates: workflowTemplates.data || []
      });
    } catch (error) {
      console.error('Error loading options:', error);
    }
  };

  const handleCountryChange = (countryId: string) => {
    const selectedCountry = options.countries.find((c: any) => c.id === countryId);
    if (selectedCountry) {
      // Find matching currency for the selected country
      const matchingCurrency = options.currencies.find((c: any) => c.country === selectedCountry.name);
      if (matchingCurrency) {
        setFormData(prev => ({ 
          ...prev, 
          country_id: countryId,
          currency_id: matchingCurrency.id 
        }));
      } else {
        setFormData(prev => ({ 
          ...prev, 
          country_id: countryId,
          currency_id: '' 
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'add') {
        const { error } = await supabase
          .from('master_tier_configurations')
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Tier configuration added successfully",
        });
      } else if (mode === 'edit') {
        const { error } = await supabase
          .from('master_tier_configurations')
          .update(formData)
          .eq('id', item.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Tier configuration updated successfully",
        });
      } else if (mode === 'delete') {
        const { error } = await supabase
          .from('master_tier_configurations')
          .delete()
          .eq('id', item.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Tier configuration deleted successfully",
        });
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: `Failed to ${mode} tier configuration`,
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
          <p>Are you sure you want to delete this tier configuration?</p>
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
            <Label htmlFor="country_id">Country *</Label>
            <Select
              value={formData.country_id}
              onValueChange={handleCountryChange}
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
            <Label htmlFor="currency_id">Currency</Label>
            <Select
              value={formData.currency_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, currency_id: value }))}
              disabled={!!formData.country_id}
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
            {formData.country_id && (
              <p className="text-xs text-muted-foreground mt-1">
                Currency auto-selected based on country
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="monthly_challenge_limit">Monthly Challenge Limit</Label>
            <Input
              id="monthly_challenge_limit"
              type="number"
              value={formData.monthly_challenge_limit}
              onChange={(e) => setFormData(prev => ({ ...prev, monthly_challenge_limit: parseInt(e.target.value) || 0 }))}
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="solutions_per_challenge">Solutions per Challenge *</Label>
            <Input
              id="solutions_per_challenge"
              type="number"
              value={formData.solutions_per_challenge}
              onChange={(e) => setFormData(prev => ({ ...prev, solutions_per_challenge: parseInt(e.target.value) || 1 }))}
              min="1"
              required
            />
          </div>

          <div>
            <Label htmlFor="fixed_charge_per_challenge">Fixed Charge per Challenge</Label>
            <Input
              id="fixed_charge_per_challenge"
              type="number"
              step="0.01"
              value={formData.fixed_charge_per_challenge}
              onChange={(e) => setFormData(prev => ({ ...prev, fixed_charge_per_challenge: parseFloat(e.target.value) || 0 }))}
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="analytics_access_id">Analytics Access</Label>
            <Select
              value={formData.analytics_access_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, analytics_access_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select analytics access" />
              </SelectTrigger>
              <SelectContent>
                {options.analyticsAccess.map((access: any) => (
                  <SelectItem key={access.id} value={access.id}>
                    {access.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="onboarding_type_id">Onboarding Type</Label>
            <Select
              value={formData.onboarding_type_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, onboarding_type_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select onboarding type" />
              </SelectTrigger>
              <SelectContent>
                {options.onboardingTypes.map((type: any) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="support_type_id">Support Type</Label>
            <Select
              value={formData.support_type_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, support_type_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select support type" />
              </SelectTrigger>
              <SelectContent>
                {options.supportTypes.map((type: any) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="workflow_template_id">Workflow Template</Label>
            <Select
              value={formData.workflow_template_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, workflow_template_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select workflow template" />
              </SelectTrigger>
              <SelectContent>
                {options.workflowTemplates.map((template: any) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="allows_overage"
            checked={formData.allows_overage}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allows_overage: checked }))}
          />
          <Label htmlFor="allows_overage">Allows Overage</Label>
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
      {children ? (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button 
            variant={mode === 'delete' ? 'destructive' : 'default'} 
            size="sm"
            className="gap-2"
          >
            {mode === 'add' && <Plus className="w-4 h-4" />}
            {mode === 'edit' && <Edit className="w-4 h-4" />}
            {mode === 'delete' && <Trash2 className="w-4 h-4" />}
            {mode === 'add' && 'Add Configuration'}
            {mode === 'edit' && 'Edit'}
            {mode === 'delete' && 'Delete'}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' && 'Add Tier Configuration'}
            {mode === 'edit' && 'Edit Tier Configuration'}
            {mode === 'delete' && 'Delete Tier Configuration'}
          </DialogTitle>
        </DialogHeader>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
};