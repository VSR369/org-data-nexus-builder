import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, DollarSign, Percent, Calculator, Layers, Package, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FormulaCalculationEngine } from '../../../services/FormulaCalculationEngine';
import { PricingCalculationService } from '../../../services/PricingCalculationService';

interface EnhancedPricingConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configuration: any;
  masterData: any;
  onSave: (data: any) => void;
  loading: boolean;
}

export const EnhancedPricingConfigurationDialog: React.FC<EnhancedPricingConfigurationDialogProps> = ({
  open,
  onOpenChange,
  configuration,
  masterData,
  onSave,
  loading
}) => {
  const [formData, setFormData] = useState({
    config_name: '',
    country_id: '',
    organization_type_id: '',
    entity_type_id: '',
    engagement_model_id: '',
    engagement_model_subtype_id: '',
    membership_status_id: '',
    pricing_tier_id: '',
    unit_of_measure_id: '',
    base_value: '',
    membership_discount_percentage: '',
    currency_id: '',
    billing_frequency_id: '',
    platform_fee_formula_id: '',
    advance_payment_type_id: '',
    consulting_fee_amount: '',
    management_fee_amount: '',
    formula_variables: {} as any,
    effective_from: null as Date | null,
    effective_to: null as Date | null,
    remarks: '',
    is_active: true
  });

  const [calculations, setCalculations] = useState({
    calculated_value: 0,
    calculated_platform_fee: 0,
    calculated_advance_payment: 0,
    formula_breakdown: ''
  });

  const [availableSubtypes, setAvailableSubtypes] = useState<any[]>([]);
  const [selectedTierRestrictions, setSelectedTierRestrictions] = useState<any[]>([]);
  const [countrySpecificFees, setCountrySpecificFees] = useState<any[]>([]);

  // Load tier-specific engagement model restrictions
  useEffect(() => {
    if (formData.pricing_tier_id && masterData.tierEngagementRestrictions) {
      const restrictions = masterData.tierEngagementRestrictions.filter(
        (r: any) => r.pricing_tier_id === formData.pricing_tier_id && r.is_allowed
      );
      setSelectedTierRestrictions(restrictions);
    }
  }, [formData.pricing_tier_id, masterData.tierEngagementRestrictions]);

  // Load available subtypes based on selected engagement model and tier restrictions
  useEffect(() => {
    if (formData.engagement_model_id) {
      let filteredSubtypes = masterData.engagementModelSubtypes?.filter(
        (s: any) => s.engagement_model_id === formData.engagement_model_id
      ) || [];

      // Further filter by tier restrictions if a tier is selected
      if (formData.pricing_tier_id && selectedTierRestrictions.length > 0) {
        const allowedModelIds = selectedTierRestrictions.map((r: any) => r.engagement_model_id);
        if (allowedModelIds.includes(formData.engagement_model_id)) {
          const restrictionsBySubtype = selectedTierRestrictions.filter(
            (r: any) => r.engagement_model_id === formData.engagement_model_id && r.engagement_model_subtype_id
          );
          
          if (restrictionsBySubtype.length > 0) {
            const allowedSubtypeIds = restrictionsBySubtype.map((r: any) => r.engagement_model_subtype_id);
            filteredSubtypes = filteredSubtypes.filter((s: any) => allowedSubtypeIds.includes(s.id));
          }
        } else {
          filteredSubtypes = []; // No access to this engagement model for this tier
        }
      }

      setAvailableSubtypes(filteredSubtypes);
    } else {
      setAvailableSubtypes([]);
    }
  }, [formData.engagement_model_id, formData.pricing_tier_id, selectedTierRestrictions, masterData.engagementModelSubtypes]);

  // Load country/currency-specific fee parameters
  useEffect(() => {
    if (formData.country_id && formData.currency_id && masterData.pricingParameters) {
      const countryFees = masterData.pricingParameters.filter(
        (p: any) => p.country_id === formData.country_id && p.currency_id === formData.currency_id
      );
      setCountrySpecificFees(countryFees);
    }
  }, [formData.country_id, formData.currency_id, masterData.pricingParameters]);

  // Real-time calculations
  useEffect(() => {
    calculatePricing();
  }, [
    formData.base_value,
    formData.membership_discount_percentage,
    formData.platform_fee_formula_id,
    formData.advance_payment_type_id,
    formData.consulting_fee_amount,
    formData.management_fee_amount,
    formData.formula_variables,
    countrySpecificFees
  ]);

  const calculatePricing = () => {
    try {
      const baseValue = parseFloat(formData.base_value) || 0;
      const discountPercent = parseFloat(formData.membership_discount_percentage) || 0;
      
      // Calculate base value after membership discount
      const discountedValue = baseValue * (1 - discountPercent / 100);
      
      // Calculate platform fee using formula
      let platformFee = 0;
      let formulaBreakdown = '';
      
      if (formData.platform_fee_formula_id && masterData.platformFeeFormulas) {
        const formula = masterData.platformFeeFormulas.find(
          (f: any) => f.id === formData.platform_fee_formula_id
        );
        
        if (formula) {
          const variables = {
            base_value: baseValue,
            discounted_value: discountedValue,
            consulting_fee: parseFloat(formData.consulting_fee_amount) || 0,
            management_fee: parseFloat(formData.management_fee_amount) || 0,
            ...formData.formula_variables
          };
          
          const calculationResult = FormulaCalculationEngine.calculateFormula(
            formula.formula_expression,
            variables
          );
          
          platformFee = calculationResult.result;
          formulaBreakdown = calculationResult.breakdown;
        }
      }
      
      // Calculate advance payment
      let advancePayment = 0;
      if (formData.advance_payment_type_id && masterData.advancePaymentTypes) {
        const advanceType = masterData.advancePaymentTypes.find(
          (a: any) => a.id === formData.advance_payment_type_id
        );
        
        if (advanceType) {
          advancePayment = platformFee * (advanceType.percentage_of_platform_fee / 100);
        }
      }
      
      setCalculations({
        calculated_value: discountedValue,
        calculated_platform_fee: platformFee,
        calculated_advance_payment: advancePayment,
        formula_breakdown: formulaBreakdown
      });
      
    } catch (error) {
      console.error('Calculation error:', error);
      setCalculations({
        calculated_value: 0,
        calculated_platform_fee: 0,
        calculated_advance_payment: 0,
        formula_breakdown: 'Calculation error'
      });
    }
  };

  useEffect(() => {
    if (configuration) {
      setFormData({
        config_name: configuration.config_name || '',
        country_id: configuration.country_id || '',
        organization_type_id: configuration.organization_type_id || '',
        entity_type_id: configuration.entity_type_id || '',
        engagement_model_id: configuration.engagement_model_id || '',
        engagement_model_subtype_id: configuration.engagement_model_subtype_id || '',
        membership_status_id: configuration.membership_status_id || '',
        pricing_tier_id: configuration.pricing_tier_id || '',
        unit_of_measure_id: configuration.unit_of_measure_id || '',
        base_value: configuration.base_value?.toString() || '',
        membership_discount_percentage: configuration.membership_discount_percentage?.toString() || '0',
        currency_id: configuration.currency_id || '',
        billing_frequency_id: configuration.billing_frequency_id || '',
        platform_fee_formula_id: configuration.platform_fee_formula_id || '',
        advance_payment_type_id: configuration.advance_payment_type_id || '',
        consulting_fee_amount: configuration.consulting_fee_amount?.toString() || '',
        management_fee_amount: configuration.management_fee_amount?.toString() || '',
        formula_variables: configuration.formula_variables || {},
        effective_from: configuration.effective_from ? new Date(configuration.effective_from) : null,
        effective_to: configuration.effective_to ? new Date(configuration.effective_to) : null,
        remarks: configuration.remarks || '',
        is_active: configuration.is_active ?? true
      });
    } else {
      // Reset form for new configuration
      setFormData({
        config_name: '',
        country_id: '',
        organization_type_id: '',
        entity_type_id: '',
        engagement_model_id: '',
        engagement_model_subtype_id: '',
        membership_status_id: '',
        pricing_tier_id: '',
        unit_of_measure_id: '',
        base_value: '',
        membership_discount_percentage: '0',
        currency_id: '',
        billing_frequency_id: '',
        platform_fee_formula_id: '',
        advance_payment_type_id: '',
        consulting_fee_amount: '',
        management_fee_amount: '',
        formula_variables: {},
        effective_from: new Date(),
        effective_to: null,
        remarks: '',
        is_active: true
      });
    }
  }, [configuration, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      base_value: parseFloat(formData.base_value) || 0,
      membership_discount_percentage: parseFloat(formData.membership_discount_percentage) || 0,
      consulting_fee_amount: parseFloat(formData.consulting_fee_amount) || null,
      management_fee_amount: parseFloat(formData.management_fee_amount) || null,
      calculated_value: calculations.calculated_value,
      calculated_platform_fee: calculations.calculated_platform_fee,
      calculated_advance_payment: calculations.calculated_advance_payment,
      effective_from: formData.effective_from ? format(formData.effective_from, 'yyyy-MM-dd') : null,
      effective_to: formData.effective_to ? format(formData.effective_to, 'yyyy-MM-dd') : null,
      engagement_model_subtype_id: formData.engagement_model_subtype_id || null,
      platform_fee_formula_id: formData.platform_fee_formula_id || null,
      advance_payment_type_id: formData.advance_payment_type_id || null,
      pricing_tier_id: formData.pricing_tier_id || null
    };
    
    onSave(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {configuration ? 'Edit' : 'Add'} Pricing Configuration
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="config_name">Configuration Name *</Label>
                  <Input
                    id="config_name"
                    value={formData.config_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, config_name: e.target.value }))}
                    placeholder="Enter configuration name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricing_tier">Pricing Tier *</Label>
                  <Select
                    value={formData.pricing_tier_id}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      pricing_tier_id: value,
                      engagement_model_id: '', // Reset dependent fields
                      engagement_model_subtype_id: ''
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pricing tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.pricingTiers?.map((tier: any) => (
                        <SelectItem key={tier.id} value={tier.id}>
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            {tier.name} (Level {tier.level_order})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.country_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, country_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.countries?.map((country: any) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization_type">Organization Type *</Label>
                  <Select
                    value={formData.organization_type_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, organization_type_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.organizationTypes?.map((type: any) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entity_type">Entity Type *</Label>
                  <Select
                    value={formData.entity_type_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, entity_type_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.entityTypes?.map((type: any) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="h-4 w-4" />
                Engagement Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="engagement_model">Engagement Model *</Label>
                  <Select
                    value={formData.engagement_model_id}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      engagement_model_id: value,
                      engagement_model_subtype_id: '' // Reset subtype when model changes
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select engagement model" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.engagementModels?.map((model: any) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.pricing_tier_id && selectedTierRestrictions.length === 0 && (
                    <p className="text-xs text-destructive">No engagement models available for selected tier</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="engagement_subtype">Engagement Subtype</Label>
                  <Select
                    value={formData.engagement_model_subtype_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, engagement_model_subtype_id: value }))}
                    disabled={!formData.engagement_model_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subtype (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific subtype</SelectItem>
                      {availableSubtypes.map((subtype: any) => (
                        <SelectItem key={subtype.id} value={subtype.id}>
                          {subtype.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="membership_status">Membership Status *</Label>
                  <Select
                    value={formData.membership_status_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, membership_status_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select membership status" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.membershipStatuses?.map((status: any) => (
                        <SelectItem key={status.id} value={status.id}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing_frequency">Billing Frequency</Label>
                  <Select
                    value={formData.billing_frequency_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, billing_frequency_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.billingFrequencies?.map((freq: any) => (
                        <SelectItem key={freq.id} value={freq.id}>
                          {freq.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Pricing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base_value">Base Value *</Label>
                  <Input
                    id="base_value"
                    type="number"
                    step="0.01"
                    value={formData.base_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, base_value: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <Select
                    value={formData.currency_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.currencies?.map((currency: any) => (
                        <SelectItem key={currency.id} value={currency.id}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_of_measure">Unit of Measure *</Label>
                  <Select
                    value={formData.unit_of_measure_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, unit_of_measure_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.unitsOfMeasure?.map((unit: any) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name} {unit.symbol && `(${unit.symbol})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="membership_discount">Membership Discount (%)</Label>
                  <Input
                    id="membership_discount"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.membership_discount_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, membership_discount_percentage: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform_fee_formula">Platform Fee Formula</Label>
                  <Select
                    value={formData.platform_fee_formula_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, platform_fee_formula_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select formula" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.platformFeeFormulas?.map((formula: any) => (
                        <SelectItem key={formula.id} value={formula.id}>
                          <div>
                            <div className="font-medium">{formula.formula_name}</div>
                            <div className="text-xs text-muted-foreground">{formula.formula_expression}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="consulting_fee">Consulting Fee</Label>
                  <Input
                    id="consulting_fee"
                    type="number"
                    step="0.01"
                    value={formData.consulting_fee_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, consulting_fee_amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="management_fee">Management Fee</Label>
                  <Input
                    id="management_fee"
                    type="number"
                    step="0.01"
                    value={formData.management_fee_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, management_fee_amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advance_payment_type">Advance Payment Type</Label>
                  <Select
                    value={formData.advance_payment_type_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, advance_payment_type_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select advance payment" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.advancePaymentTypes?.map((type: any) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name} ({type.percentage_of_platform_fee}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Calculations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Calculated Values
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {calculations.calculated_value.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Final Value (after discount)</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {calculations.calculated_platform_fee.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Platform Fee</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {calculations.calculated_advance_payment.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Advance Payment</div>
                </div>
              </div>
              
              {calculations.formula_breakdown && (
                <div className="p-3 bg-muted rounded text-sm">
                  <strong>Formula Breakdown:</strong>
                  <div className="mt-1 font-mono text-xs">{calculations.formula_breakdown}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validity Period */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Validity Period</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Effective From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.effective_from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.effective_from ? format(formData.effective_from, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.effective_from}
                        onSelect={(date) => setFormData(prev => ({ ...prev, effective_from: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Effective To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.effective_to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.effective_to ? format(formData.effective_to, "PPP") : <span>No end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.effective_to}
                        onSelect={(date) => setFormData(prev => ({ ...prev, effective_to: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="Additional notes or comments"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active Configuration</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};