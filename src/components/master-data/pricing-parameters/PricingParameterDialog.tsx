import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useMasterDataCRUD } from '@/hooks/useMasterDataCRUD';

interface PricingParameterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parameter?: any;
  onSave: (data: any) => void;
  loading?: boolean;
}

const PricingParameterDialog: React.FC<PricingParameterDialogProps> = ({
  open,
  onOpenChange,
  parameter,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    country_id: '',
    organization_type_id: '',
    entity_type_id: '',
    fee_component_id: '',
    currency_id: '',
    unit_of_measure_id: '',
    amount: '',
    effective_from: '',
    effective_to: '',
    rate_type: 'currency' as 'currency' | 'percentage',
    complexity_applicable: false,
    engagement_model_context: {}
  });

  const { items: countries } = useMasterDataCRUD('master_countries');
  const { items: organizationTypes } = useMasterDataCRUD('master_organization_types');
  const { items: entityTypes } = useMasterDataCRUD('master_entity_types');
  const { items: feeComponents } = useMasterDataCRUD('master_fee_components');
  const { items: currencies } = useMasterDataCRUD('master_currencies');
  const { items: unitsOfMeasure } = useMasterDataCRUD('master_units_of_measure');

  useEffect(() => {
    if (parameter) {
      setFormData({
        country_id: parameter.country_id || '',
        organization_type_id: parameter.organization_type_id || '',
        entity_type_id: parameter.entity_type_id || '',
        fee_component_id: parameter.fee_component_id || '',
        currency_id: parameter.currency_id || '',
        unit_of_measure_id: parameter.unit_of_measure_id || '',
        amount: parameter.amount?.toString() || '',
        effective_from: parameter.effective_from || '',
        effective_to: parameter.effective_to || '',
        rate_type: parameter.rate_type || 'currency',
        complexity_applicable: parameter.complexity_applicable || false,
        engagement_model_context: parameter.engagement_model_context || {}
      });
    } else {
      setFormData({
        country_id: '',
        organization_type_id: '',
        entity_type_id: '',
        fee_component_id: '',
        currency_id: '',
        unit_of_measure_id: '',
        amount: '',
        effective_from: '',
        effective_to: '',
        rate_type: 'currency',
        complexity_applicable: false,
        engagement_model_context: {}
      });
    }
  }, [parameter, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      amount: parseFloat(formData.amount),
      effective_from: formData.effective_from || null,
      effective_to: formData.effective_to || null
    };
    
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {parameter ? 'Edit Pricing Parameter' : 'Add New Pricing Parameter'}
          </DialogTitle>
          <DialogDescription>
            Configure pricing parameters for specific countries, organization types, and fee components.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                value={formData.country_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, country_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country: any) => (
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
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type: any) => (
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
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map((type: any) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee_component">Fee Component *</Label>
              <Select
                value={formData.fee_component_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, fee_component_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fee component" />
                </SelectTrigger>
                <SelectContent>
                  {feeComponents.map((component: any) => (
                    <SelectItem key={component.id} value={component.id}>
                      {component.name} ({component.component_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select
                value={formData.currency_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, currency_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency: any) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      {currency.name} ({currency.code})
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
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitsOfMeasure.map((unit: any) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name} {unit.symbol && `(${unit.symbol})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate_type">Rate Type *</Label>
              <Select
                value={formData.rate_type}
                onValueChange={(value: 'currency' | 'percentage') => setFormData(prev => ({ ...prev, rate_type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rate type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="currency">Currency Amount</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                {formData.rate_type === 'percentage' ? 'Percentage (%)' : 'Amount'} *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={formData.rate_type === 'percentage' ? '100' : undefined}
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder={formData.rate_type === 'percentage' ? '15.00' : '0.00'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="effective_from">Effective From</Label>
              <Input
                id="effective_from"
                type="date"
                value={formData.effective_from}
                onChange={(e) => setFormData(prev => ({ ...prev, effective_from: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="effective_to">Effective To</Label>
              <Input
                id="effective_to"
                type="date"
                value={formData.effective_to}
                onChange={(e) => setFormData(prev => ({ ...prev, effective_to: e.target.value }))}
                placeholder="Leave empty for indefinite"
              />
            </div>
          </div>

          {/* New Advanced Settings Section */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium">Advanced Settings</h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="complexity_applicable"
                checked={formData.complexity_applicable}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, complexity_applicable: checked }))}
              />
              <Label htmlFor="complexity_applicable" className="text-sm">
                Apply Challenge Complexity Multiplier
              </Label>
            </div>
            
            {formData.complexity_applicable && (
              <div className="ml-6 text-sm text-muted-foreground">
                When enabled, this fee will be adjusted based on the challenge complexity level (Low, Medium, High, Expert).
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : parameter ? 'Update Parameter' : 'Add Parameter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { PricingParameterDialog };