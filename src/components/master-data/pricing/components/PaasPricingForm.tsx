
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CountryPricing } from '@/types/pricing';
import { getCurrencyByCountry } from '../utils/currencyUtils';

interface PaasPricingFormProps {
  newCountryPricing: Partial<CountryPricing & { organizationType: string }>;
  setNewCountryPricing: React.Dispatch<React.SetStateAction<Partial<CountryPricing & { organizationType: string }>>>;
  countries: { id: string; name: string; code: string; region?: string }[];
  organizationTypes: string[];
  onAddPricing: () => void;
}

const PaasPricingForm: React.FC<PaasPricingFormProps> = ({
  newCountryPricing,
  setNewCountryPricing,
  countries,
  organizationTypes,
  onAddPricing
}) => {
  const { toast } = useToast();

  const handleCountryChange = (countryName: string) => {
    console.log('🔄 Country selected:', countryName);
    const currency = getCurrencyByCountry(countryName);
    console.log('💱 Auto-selected currency from master data:', currency);
    
    setNewCountryPricing(prev => ({ 
      ...prev, 
      country: countryName,
      currency: currency
    }));
    
    if (currency) {
      toast({
        title: "Currency Auto-Selected",
        description: `Currency ${currency} automatically selected for ${countryName} from master data`,
      });
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-muted/30">
      <h4 className="text-lg font-medium mb-4">Add New Pricing Entry</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <Label>Organization Type *</Label>
          <Select
            value={newCountryPricing.organizationType}
            onValueChange={(value) => setNewCountryPricing(prev => ({ ...prev, organizationType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              {organizationTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Country *</Label>
          <Select
            value={newCountryPricing.country}
            onValueChange={handleCountryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.name}>{country.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Currency *</Label>
          <Input
            value={newCountryPricing.currency || ''}
            onChange={(e) => setNewCountryPricing(prev => ({ ...prev, currency: e.target.value }))}
            placeholder="Auto-populated from master data"
            readOnly
            className="bg-muted"
          />
        </div>

        <div>
          <Label>Membership Status *</Label>
          <Select
            value={newCountryPricing.membershipStatus}
            onValueChange={(value: 'active' | 'inactive' | 'not-a-member') => {
              setNewCountryPricing(prev => ({ 
                ...prev, 
                membershipStatus: value,
                discountPercentage: value === 'active' ? prev.discountPercentage : undefined
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select membership status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="not-a-member">Not a Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {newCountryPricing.membershipStatus === 'active' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <Label>Discount (%) *</Label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={newCountryPricing.discountPercentage || ''}
              onChange={(e) => setNewCountryPricing(prev => ({ ...prev, discountPercentage: parseFloat(e.target.value) }))}
              placeholder="0"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label>Quarterly Price</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={newCountryPricing.quarterlyPrice || ''}
            onChange={(e) => setNewCountryPricing(prev => ({ ...prev, quarterlyPrice: parseFloat(e.target.value) }))}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label>Half-Yearly Price</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={newCountryPricing.halfYearlyPrice || ''}
            onChange={(e) => setNewCountryPricing(prev => ({ ...prev, halfYearlyPrice: parseFloat(e.target.value) }))}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label>Annual Price</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={newCountryPricing.annualPrice || ''}
            onChange={(e) => setNewCountryPricing(prev => ({ ...prev, annualPrice: parseFloat(e.target.value) }))}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={onAddPricing}
        >
          Add Pricing
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setNewCountryPricing({})}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default PaasPricingForm;
