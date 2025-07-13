import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PricingTemplate {
  id: string;
  template_name: string;
  engagement_model_id: string;
  engagement_model: string;
  template_type: 'marketplace' | 'paas';
  base_platform_fee_percentage?: number;
  base_quarterly_fee?: number;
  base_half_yearly_fee?: number;
  base_annual_fee?: number;
  base_currency?: string;
  internal_paas_pricing?: any;
  is_active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PricingRule {
  id: string;
  rule_name: string;
  rule_type: 'member_discount' | 'org_multiplier' | 'country_adjustment';
  target_field: string;
  condition_type: 'organization_type' | 'membership_status' | 'country';
  condition_value: string;
  adjustment_type: 'percentage' | 'fixed_amount' | 'multiplier';
  adjustment_value: number;
  priority: number;
  is_active: boolean;
  description?: string;
}

export interface PricingOverride {
  id: string;
  country_id?: string;
  organization_type_id?: string;
  entity_type_id?: string;
  engagement_model_id?: string;
  membership_status?: string;
  override_field: string;
  override_value: number;
  override_currency?: string;
  is_active: boolean;
  description?: string;
}

export const usePricingTemplates = () => {
  const [templates, setTemplates] = useState<PricingTemplate[]>([]);
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [overrides, setOverrides] = useState<PricingOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_templates')
        .select('*')
        .eq('is_active', true)
        .order('template_name');

      if (error) throw error;
      setTemplates((data as PricingTemplate[]) || []);
    } catch (err) {
      console.error('Error loading pricing templates:', err);
      setError('Failed to load pricing templates');
    }
  };

  const loadRules = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_rules')
        .select('*')
        .eq('is_active', true)
        .order('priority');

      if (error) throw error;
      setRules((data as PricingRule[]) || []);
    } catch (err) {
      console.error('Error loading pricing rules:', err);
      setError('Failed to load pricing rules');
    }
  };

  const loadOverrides = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_overrides')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setOverrides((data as PricingOverride[]) || []);
    } catch (err) {
      console.error('Error loading pricing overrides:', err);
      setError('Failed to load pricing overrides');
    }
  };

  const loadAllPricingData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([loadTemplates(), loadRules(), loadOverrides()]);
    } catch (err) {
      console.error('Error loading pricing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllPricingData();
  }, []);

  const calculatePricing = (
    engagementModel: string,
    organizationType: string,
    membershipStatus: 'Member' | 'Non-Member',
    country?: string
  ) => {
    // Find the appropriate template
    const template = templates.find(t => 
      t.engagement_model === engagementModel && t.is_active
    );

    if (!template) {
      console.warn(`No template found for engagement model: ${engagementModel}`);
      return null;
    }

    // Start with base values from template
    let calculatedPricing = {
      platformFeePercentage: template.base_platform_fee_percentage || 0,
      quarterlyFee: template.base_quarterly_fee || 0,
      halfYearlyFee: template.base_half_yearly_fee || 0,
      annualFee: template.base_annual_fee || 0,
      currency: template.base_currency || 'INR',
      internalPaasPricing: template.internal_paas_pricing || [],
      template: template.template_name
    };

    // Apply business rules
    const applicableRules = rules.filter(rule => {
      if (!rule.is_active) return false;
      
      switch (rule.condition_type) {
        case 'organization_type':
          return rule.condition_value === organizationType;
        case 'membership_status':
          return rule.condition_value === membershipStatus;
        case 'country':
          return rule.condition_value === country;
        default:
          return false;
      }
    }).sort((a, b) => a.priority - b.priority);

    // Apply rules in priority order
    applicableRules.forEach(rule => {
      const targetValue = calculatedPricing[rule.target_field as keyof typeof calculatedPricing] as number;
      
      if (typeof targetValue !== 'number') return;

      let newValue = targetValue;

      switch (rule.adjustment_type) {
        case 'multiplier':
          newValue = targetValue * rule.adjustment_value;
          break;
        case 'percentage':
          newValue = targetValue * (1 - rule.adjustment_value / 100);
          break;
        case 'fixed_amount':
          newValue = targetValue + rule.adjustment_value;
          break;
      }

      // Special handling for member discount on all fees
      if (rule.rule_type === 'member_discount' && rule.target_field === 'all_fees') {
        if (calculatedPricing.platformFeePercentage > 0) {
          calculatedPricing.platformFeePercentage *= (1 - rule.adjustment_value / 100);
        }
        if (calculatedPricing.quarterlyFee > 0) {
          calculatedPricing.quarterlyFee *= (1 - rule.adjustment_value / 100);
        }
        if (calculatedPricing.halfYearlyFee > 0) {
          calculatedPricing.halfYearlyFee *= (1 - rule.adjustment_value / 100);
        }
        if (calculatedPricing.annualFee > 0) {
          calculatedPricing.annualFee *= (1 - rule.adjustment_value / 100);
        }
      } else {
        (calculatedPricing as any)[rule.target_field] = newValue;
      }
    });

    // Apply any specific overrides
    // TODO: Implement override logic when needed

    console.log('🎯 Calculated pricing:', {
      engagementModel,
      organizationType,
      membershipStatus,
      country,
      result: calculatedPricing
    });

    return calculatedPricing;
  };

  const saveTemplate = async (template: Omit<PricingTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('pricing_templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;

      toast.success('Pricing template saved successfully');
      await loadTemplates();
      return data;
    } catch (err: any) {
      console.error('Error saving template:', err);
      toast.error(err.message || 'Failed to save pricing template');
      throw err;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<PricingTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('pricing_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Pricing template updated successfully');
      await loadTemplates();
      return data;
    } catch (err: any) {
      console.error('Error updating template:', err);
      toast.error(err.message || 'Failed to update pricing template');
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pricing_templates')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast.success('Pricing template deleted successfully');
      await loadTemplates();
    } catch (err: any) {
      console.error('Error deleting template:', err);
      toast.error(err.message || 'Failed to delete pricing template');
      throw err;
    }
  };

  return {
    templates,
    rules,
    overrides,
    loading,
    error,
    calculatePricing,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: loadAllPricingData
  };
};