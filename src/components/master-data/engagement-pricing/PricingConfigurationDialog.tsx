import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
import { CalendarIcon, DollarSign, Percent, Calculator } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PricingConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configuration: any;
  masterData: any;
  onSave: (data: any) => void;
  loading: boolean;
}

export const PricingConfigurationDialog: React.FC<PricingConfigurationDialogProps> = ({
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
    membership_status_id: '',
    unit_of_measure_id: '',
    base_value: '',
    membership_discount_percentage: '',
    currency_id: '',
    billing_frequency_id: '',
    effective_from: null as Date | null,
    effective_to: null as Date | null,
    remarks: '',
    is_active: true
  });

  const [calculatedValue, setCalculatedValue] = useState(0);

  useEffect(() => {
    if (configuration) {
      setFormData({
        config_name: configuration.config_name || '',
        country_id: configuration.country_id || '',
        organization_type_id: configuration.organization_type_id || '',
        entity_type_id: configuration.entity_type_id || '',
        engagement_model_id: configuration.engagement_model_id || '',
        membership_status_id: configuration.membership_status_id || '',
        unit_of_measure_id: configuration.unit_of_measure_id || '',
        base_value: configuration.base_value?.toString() || '',
        membership_discount_percentage: configuration.membership_discount_percentage?.toString() || '0',
        currency_id: configuration.currency_id || '',
        billing_frequency_id: configuration.billing_frequency_id || '',
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
        membership_status_id: '',
        unit_of_measure_id: '',
        base_value: '',
        membership_discount_percentage: '0',
        currency_id: '',
        billing_frequency_id: '',
        effective_from: new Date(),
        effective_to: null,
        remarks: '',
        is_active: true
      });
    }
  }, [configuration, open]);

  // Calculate final value when base value or discount changes
  useEffect(() => {
    const baseValue = parseFloat(formData.base_value) || 0;
    const discount = parseFloat(formData.membership_discount_percentage) || 0;
    const calculated = baseValue * (1 - discount / 100);
    setCalculatedValue(calculated);
  }, [formData.base_value, formData.membership_discount_percentage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      base_value: parseFloat(formData.base_value) || 0,
      membership_discount_percentage: parseFloat(formData.membership_discount_percentage) || 0,
      calculated_value: calculatedValue,
      effective_from: formData.effective_from?.toISOString().split('T')[0] || null,
      effective_to: formData.effective_to?.toISOString().split('T')[0] || null,
    };

    onSave(submitData);
  };

  const isPercentageUnit = () => {
    const selectedUnit = masterData.unitsOfMeasure?.find((unit: any) => unit.id === formData.unit_of_measure_id);
    return selectedUnit?.is_percentage;
  };

  const getSelectedCurrency = () => {
    return masterData.currencies?.find((currency: any) => currency.id === formData.currency_id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {configuration ? 'Edit Pricing Configuration' : 'Add New Pricing Configuration'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Context Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration Context</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="config_name">Configuration Name</Label>
                <Input
                  id="config_name"
                  value={formData.config_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, config_name: e.target.value }))}
                  placeholder="e.g., India MSME Marketplace Pricing"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country_id">Country *</Label>
                <Select value={formData.country_id} onValueChange={(value) => setFormData(prev => ({ ...prev, country_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {masterData.countries?.map((country: any) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name} ({country.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization_type_id">Organization Type *</Label>
                <Select value={formData.organization_type_id} onValueChange={(value) => setFormData(prev => ({ ...prev, organization_type_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    {masterData.organizationTypes?.map((orgType: any) => (
                      <SelectItem key={orgType.id} value={orgType.id}>
                        {orgType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entity_type_id">Entity Type *</Label>
                <Select value={formData.entity_type_id} onValueChange={(value) => setFormData(prev => ({ ...prev, entity_type_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {masterData.entityTypes?.map((entityType: any) => (
                      <SelectItem key={entityType.id} value={entityType.id}>
                        {entityType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="engagement_model_id">Engagement Model *</Label>
                <Select value={formData.engagement_model_id} onValueChange={(value) => setFormData(prev => ({ ...prev, engagement_model_id: value }))}>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="membership_status_id">Membership Status *</Label>
                <Select value={formData.membership_status_id} onValueChange={(value) => setFormData(prev => ({ ...prev, membership_status_id: value }))}>
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
            </CardContent>
          </Card>

          {/* Pricing Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Pricing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit_of_measure_id">Unit of Measure *</Label>
                  <Select value={formData.unit_of_measure_id} onValueChange={(value) => setFormData(prev => ({ ...prev, unit_of_measure_id: value }))}>
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

                <div className="space-y-2">
                  <Label htmlFor="base_value">Base Value *</Label>
                  <div className="relative">
                    {isPercentageUnit() ? (
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    ) : (
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    )}
                    <Input
                      id="base_value"
                      type="number"
                      step="0.01"
                      value={formData.base_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, base_value: e.target.value }))}
                      placeholder="0.00"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="membership_discount_percentage">Member Discount (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="membership_discount_percentage"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.membership_discount_percentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, membership_discount_percentage: e.target.value }))}
                      placeholder="0.0"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Value Display */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Final Calculated Value:</span>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {isPercentageUnit() ? (
                      <>
                        <Percent className="h-4 w-4 mr-1" />
                        {calculatedValue.toFixed(2)}%
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4 mr-1" />
                        {calculatedValue.toFixed(2)} {getSelectedCurrency()?.code || ''}
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!isPercentageUnit() && (
                  <div className="space-y-2">
                    <Label htmlFor="currency_id">Currency</Label>
                    <Select value={formData.currency_id} onValueChange={(value) => setFormData(prev => ({ ...prev, currency_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {masterData.currencies?.map((currency: any) => (
                          <SelectItem key={currency.id} value={currency.id}>
                            {currency.name} ({currency.code}) {currency.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="billing_frequency_id">Billing Frequency</Label>
                  <Select value={formData.billing_frequency_id} onValueChange={(value) => setFormData(prev => ({ ...prev, billing_frequency_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.billingFrequencies?.map((frequency: any) => (
                        <SelectItem key={frequency.id} value={frequency.id}>
                          {frequency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validity & Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Validity Period & Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Effective From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("justify-start text-left font-normal", !formData.effective_from && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.effective_from ? format(formData.effective_from, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.effective_from}
                        onSelect={(date) => setFormData(prev => ({ ...prev, effective_from: date }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Effective To (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("justify-start text-left font-normal", !formData.effective_to && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.effective_to ? format(formData.effective_to, "PPP") : "No expiry"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.effective_to}
                        onSelect={(date) => setFormData(prev => ({ ...prev, effective_to: date }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active Configuration</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="Additional notes or comments..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (configuration ? 'Update Configuration' : 'Create Configuration')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};