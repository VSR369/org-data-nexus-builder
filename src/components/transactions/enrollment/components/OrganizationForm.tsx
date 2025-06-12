
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from '../types';
import { cn } from "@/lib/utils";
import { organizationTypesDataManager, countriesDataManager } from '@/utils/sharedDataManagers';

interface OrganizationFormProps {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
  organizationTypes: string[];
  countries: string[];
  invalidFields?: Set<string>;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  formData,
  updateFormData,
  organizationTypes: propOrgTypes,
  countries: propCountries,
  invalidFields = new Set()
}) => {
  const [organizationTypes, setOrganizationTypes] = useState<string[]>(propOrgTypes);
  const [countries, setCountries] = useState<any[]>([]);

  // Load data from master data instead of props
  useEffect(() => {
    console.log('🔄 OrganizationForm: Loading data from master data...');
    
    // Load organization types from master data
    const loadedOrgTypes = organizationTypesDataManager.loadData();
    console.log('✅ OrganizationForm: Loaded organization types:', loadedOrgTypes);
    setOrganizationTypes(loadedOrgTypes);

    // Load countries from master data
    const loadedCountries = countriesDataManager.loadData();
    console.log('✅ OrganizationForm: Loaded countries:', loadedCountries);
    setCountries(loadedCountries);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="org-name">Organization Name *</Label>
        <Input 
          id="org-name" 
          placeholder="Enter organization name"
          value={formData.orgName}
          onChange={(e) => updateFormData('orgName', e.target.value)}
          className={cn(invalidFields.has('orgName') && "border-destructive")}
        />
        {invalidFields.has('orgName') && (
          <p className="text-sm text-destructive">Organization Name is required</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="org-type">Organization Type *</Label>
        <Select value={formData.orgType} onValueChange={(value) => updateFormData('orgType', value)}>
          <SelectTrigger className={cn(invalidFields.has('orgType') && "border-destructive")}>
            <SelectValue placeholder="Select organization type" />
          </SelectTrigger>
          <SelectContent>
            {organizationTypes.map((type) => (
              <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {invalidFields.has('orgType') && (
          <p className="text-sm text-destructive">Organization Type is required</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="org-country">Country *</Label>
        <Select value={formData.orgCountry} onValueChange={(value) => updateFormData('orgCountry', value)}>
          <SelectTrigger className={cn(invalidFields.has('orgCountry') && "border-destructive")}>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.name.toLowerCase().replace(/\s+/g, '-')}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {invalidFields.has('orgCountry') && (
          <p className="text-sm text-destructive">Country is required</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Official Website URL</Label>
        <Input 
          id="website" 
          type="url" 
          placeholder="https://example.com"
          value={formData.website}
          onChange={(e) => updateFormData('website', e.target.value)}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="reg-address">Registered Address *</Label>
        <Textarea 
          id="reg-address" 
          placeholder="Enter complete registered address"
          value={formData.regAddress}
          onChange={(e) => updateFormData('regAddress', e.target.value)}
          className={cn(invalidFields.has('regAddress') && "border-destructive")}
        />
        {invalidFields.has('regAddress') && (
          <p className="text-sm text-destructive">Registered Address is required</p>
        )}
      </div>
    </div>
  );
};

export default OrganizationForm;
