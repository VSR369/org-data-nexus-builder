
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PricingConfig } from '@/types/pricing';
import { CurrencyService } from '@/utils/masterData/currencyService';
import { useToast } from "@/hooks/use-toast";

interface MasterDataSelectionSectionProps {
  currentConfig: Partial<PricingConfig>;
  setCurrentConfig: React.Dispatch<React.SetStateAction<Partial<PricingConfig>>>;
  entityTypes: string[];
  organizationTypesFromMaster: string[];
  countries: any[];
}

const MasterDataSelectionSection: React.FC<MasterDataSelectionSectionProps> = ({
  currentConfig,
  setCurrentConfig,
  entityTypes,
  organizationTypesFromMaster,
  countries
}) => {
  const { toast } = useToast();

  const handleCountryChange = (countryName: string) => {
    console.log('🔄 Country selected:', countryName);
    const currency = CurrencyService.getCurrencyByCountry(countryName);
    console.log('💱 Auto-selected currency from master data:', currency);
    
    setCurrentConfig(prev => ({ 
      ...prev, 
      country: countryName,
      currency: currency?.code || ''
    }));
    
    if (currency) {
      toast({
        title: "Currency Auto-Selected",
        description: `Currency ${currency.code} automatically selected for ${countryName} from master data`,
      });
    }
  };

  const membershipStatuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'not-a-member', label: 'Not a Member' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="country">Country *</Label>
        <Select
          value={currentConfig.country || ''}
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
        {countries.length === 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            No countries found in master data.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="currency">Currency</Label>
        <Input
          id="currency"
          value={currentConfig.currency || ''}
          readOnly
          placeholder="Auto-populated from master data"
          className="bg-muted"
        />
      </div>

      <div>
        <Label htmlFor="organizationType">Organization Type *</Label>
        <Select
          value={currentConfig.organizationType || ''}
          onValueChange={(value) => setCurrentConfig(prev => ({ ...prev, organizationType: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select organization type" />
          </SelectTrigger>
          <SelectContent>
            {organizationTypesFromMaster.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {organizationTypesFromMaster.length === 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            No organization types found in master data.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="entityType">Entity Type *</Label>
        <Select
          value={currentConfig.entityType || ''}
          onValueChange={(value) => setCurrentConfig(prev => ({ ...prev, entityType: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select entity type" />
          </SelectTrigger>
          <SelectContent>
            {entityTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {entityTypes.length === 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            No entity types found in master data.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="membershipStatus">Membership Status *</Label>
        <Select
          value={currentConfig.membershipStatus || ''}
          onValueChange={(value: 'active' | 'inactive' | 'not-a-member') => {
            setCurrentConfig(prev => ({ 
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
            {membershipStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MasterDataSelectionSection;
