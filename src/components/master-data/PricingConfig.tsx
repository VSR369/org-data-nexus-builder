
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from 'lucide-react';
import { PricingConfig as PricingConfigType } from '@/types/pricing';
import GeneralConfigForm from './pricing/GeneralConfigForm';
import { organizationTypesDataManager } from '@/utils/sharedDataManagers';
import { PricingDataManager } from '@/utils/pricingDataManager';

const PricingConfig = () => {
  const [configs, setConfigs] = useState<PricingConfigType[]>([]);
  const [organizationTypes, setOrganizationTypes] = useState<string[]>([]);
  const [currentGeneralConfig, setCurrentGeneralConfig] = useState<Partial<PricingConfigType>>({});

  // Load data on component mount
  useEffect(() => {
    console.log('🔄 PricingConfig: Loading data...');
    
    // Load pricing configurations
    const loadedConfigs = PricingDataManager.getAllConfigurations();
    setConfigs(loadedConfigs);
    
    // Load organization types
    const loadedOrgTypes = organizationTypesDataManager.loadData();
    setOrganizationTypes(loadedOrgTypes);
    
    console.log('✅ PricingConfig: Data loaded');
  }, []);

  // Save configurations whenever they change
  useEffect(() => {
    if (configs.length >= 0) {
      console.log('💾 PricingConfig: Saving configurations to persistent storage');
      PricingDataManager.saveConfigurations(configs);
    }
  }, [configs]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GeneralConfigForm
            currentConfig={currentGeneralConfig}
            setCurrentConfig={setCurrentGeneralConfig}
            organizationTypes={organizationTypes}
            configs={configs}
            setConfigs={setConfigs}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingConfig;
