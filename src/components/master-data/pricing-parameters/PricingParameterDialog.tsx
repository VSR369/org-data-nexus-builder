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
    effective_to: ''
  });

  const { items: countries } = useMasterDataCRUD('master_countries');
  const { items: organizationTypes } = useMasterDataCRUD('master_organization_types');
  const { items: entityTypes } = useMasterDataCRUD('master_entity_types');
  const { items: feeComponents } = useMasterDataCRUD('master_fee_components');
  const { items: currencies } = useMasterDataCRUD('master_currencies');
  const { items: unitsOfMeasure } = useMasterDataCRUD('master_units_of_measure');

  // Filter fee components to only show management and consulting fees
  const managementConsultingFees = feeComponents.filter(component => 
    component.component_type === 'management_fee' || component.component_type === 'consulting_fee'
  );

  // Auto-populate currency when country changes
  const handleCountryChange = (countryId: string) => {
    setFormData(prev => ({ ...prev, country_id: countryId }));
    
    // Find the selected country
    const selectedCountry = countries.find(c => c.id === countryId);
    if (selectedCountry) {
      // Find currency for this country
      const countryCurrency = currencies.find(currency => 
        currency.country === selectedCountry.name
      );
      if (countryCurrency) {
        setFormData(prev => ({ ...prev, currency_id: countryCurrency.id }));
      }
    }
  };

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
        effective_to: parameter.effective_to || ''
      });
    } else {
      // Find default currency unit of measure
      const defaultCurrencyUnit = unitsOfMeasure.find(unit => 
        unit.name?.toLowerCase().includes('currency') || unit.symbol === '$'
      );
      
      setFormData({
        country_id: '',
        organization_type_id: '',
        entity_type_id: '',
        fee_component_id: '',
        currency_id: '',
        unit_of_measure_id: defaultCurrencyUnit?.id || '',
        amount: '',
        effective_from: '',
        effective_to: ''
      });
    }
  }, [parameter, open, unitsOfMeasure]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      amount: parseFloat(formData.amount),
      effective_from: formData.effective_from || null,
      effective_to: formData.effective_to || null,
      rate_type: 'currency', // Always currency for management/consulting fees
      complexity_applicable: true // Always true for management/consulting fees
    };
    
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {parameter ? 'Edit Management/Consulting Fee' : 'Add New Management/Consulting Fee'}
          </DialogTitle>
          <DialogDescription>
            Configure management and consulting fees for specific countries, organization types, and entity types.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                value={formData.country_id}
                onValueChange={handleCountryChange}
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
                  {managementConsultingFees.map((component: any) => (
                    <SelectItem key={component.id} value={component.id}>
                      {component.name}
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
                disabled={true}
              >
                <SelectTrigger className="bg-muted">
                  <SelectValue placeholder="Auto-populated based on country" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency: any) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Currency is automatically selected based on the country choice.
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="amount">Fee Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                required
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground">
                Enter the fee amount in the selected currency.
              </p>
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

          {/* Info Section */}
          <div className="space-y-4 border-t pt-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Automatic Settings</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Rate Type: Always set to "Currency Amount"</li>
                <li>• Complexity Applicable: Always enabled for management and consulting fees</li>
                <li>• Unit of Measure: Automatically set to currency unit</li>
              </ul>
            </div>
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
              {loading ? 'Saving...' : parameter ? 'Update Fee Setup' : 'Add Fee Setup'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { PricingParameterDialog };