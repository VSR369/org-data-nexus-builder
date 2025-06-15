
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CountryPricing, PricingConfig } from './types';
import { countriesDataManager, organizationTypesDataManager } from '@/utils/sharedDataManagers';
import PaasPricingForm from './components/PaasPricingForm';
import PaasPricingTable from './components/PaasPricingTable';

interface InternalPaasPricingManagerProps {
  configs: PricingConfig[];
  setConfigs: React.Dispatch<React.SetStateAction<PricingConfig[]>>;
}

const InternalPaasPricingManager: React.FC<InternalPaasPricingManagerProps> = ({
  configs,
  setConfigs
}) => {
  const [newCountryPricing, setNewCountryPricing] = useState<Partial<CountryPricing & { organizationType: string }>>({});
  const [countries, setCountries] = useState<{ id: string; name: string; code: string; region?: string }[]>([]);
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);
  const { toast } = useToast();

  // Load countries and organization types from master data
  useEffect(() => {
    console.log('🔄 InternalPaasPricingManager: Loading countries from master data...');
    const loadedCountries = countriesDataManager.loadData();
    console.log('✅ InternalPaasPricingManager: Loaded countries:', loadedCountries);
    setCountries(loadedCountries);

    console.log('🔄 InternalPaasPricingManager: Loading organization types from master data...');
    const loadedOrgTypes = organizationTypesDataManager.loadData();
    console.log('✅ InternalPaasPricingManager: Loaded organization types:', loadedOrgTypes);
    setOrganizationTypes(loadedOrgTypes);
  }, []);

  const handleAddPricing = () => {
    // Validate required fields
    const requiredFields = ['organizationType', 'country', 'currency', 'membershipStatus'];
    const missingFields = requiredFields.filter(field => !newCountryPricing[field as keyof typeof newCountryPricing]);
    
    // If membership status is active, discount percentage is required
    if (newCountryPricing.membershipStatus === 'active' && 
        (newCountryPricing.discountPercentage === undefined || 
         newCountryPricing.discountPercentage === null || 
         isNaN(newCountryPricing.discountPercentage))) {
      missingFields.push('discountPercentage');
    }

    if (missingFields.length > 0) {
      let errorMessage = `Please fill in all required fields: ${missingFields.join(', ')}`;
      if (newCountryPricing.membershipStatus === 'active' && missingFields.includes('discountPercentage')) {
        errorMessage = "Discount percentage is required when membership status is Active.";
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    // Find existing config for this organization type or create new one
    let existingConfig = configs.find(config => config.organizationType === newCountryPricing.organizationType);
    
    const pricingEntry = {
      id: Date.now().toString(),
      country: newCountryPricing.country!,
      currency: newCountryPricing.currency!,
      quarterlyPrice: newCountryPricing.quarterlyPrice || 0,
      halfYearlyPrice: newCountryPricing.halfYearlyPrice || 0,
      annualPrice: newCountryPricing.annualPrice || 0,
      membershipStatus: newCountryPricing.membershipStatus!,
      discountPercentage: newCountryPricing.membershipStatus === 'active' ? newCountryPricing.discountPercentage! : undefined,
    } as CountryPricing;

    if (existingConfig) {
      // Update existing config
      const updatedConfig = {
        ...existingConfig,
        internalPaasPricing: [...existingConfig.internalPaasPricing, pricingEntry],
        version: existingConfig.version + 1
      };
      
      setConfigs(prev => prev.map(config => 
        config.id === existingConfig!.id ? updatedConfig : config
      ));
    } else {
      // Create new config
      const newConfig = {
        id: Date.now().toString(),
        organizationType: newCountryPricing.organizationType!,
        marketplaceFee: 0,
        aggregatorFee: 0,
        marketplacePlusAggregatorFee: 0,
        internalPaasPricing: [pricingEntry],
        version: 1,
        createdAt: new Date().toISOString().split('T')[0],
      } as PricingConfig;
      
      setConfigs(prev => [...prev, newConfig]);
    }

    setNewCountryPricing({});
    
    toast({
      title: "Success",
      description: "Platform as a Service pricing added successfully.",
    });
  };

  // Get all pricing entries across all configs
  const allPricingEntries = configs.flatMap(config => 
    config.internalPaasPricing.map(pricing => ({
      ...pricing,
      organizationType: config.organizationType
    }))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform as a Service Pricing Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <PaasPricingForm
              newCountryPricing={newCountryPricing}
              setNewCountryPricing={setNewCountryPricing}
              countries={countries}
              organizationTypes={organizationTypes}
              onAddPricing={handleAddPricing}
            />

            <PaasPricingTable
              pricingEntries={allPricingEntries}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InternalPaasPricingManager;
