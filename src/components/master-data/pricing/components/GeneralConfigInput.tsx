
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PricingConfig } from '../types';
import { engagementModelsDataManager } from '../../engagement-models/engagementModelsDataManager';
import { EngagementModel } from '../../engagement-models/types';
import { organizationTypesDataManager, countriesDataManager } from '@/utils/sharedDataManagers';
import { DataManager } from '@/utils/dataManager';
import MasterDataSelectionSection from './MasterDataSelectionSection';
import DiscountSection from './DiscountSection';
import EngagementModelPricingSection from './EngagementModelPricingSection';
import ConfigurationActions from './ConfigurationActions';

// Entity types data manager
const entityTypeDataManager = new DataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: ['Commercial', 'Non-Profit Organization', 'Society/ Trust'],
  version: 1
});

interface GeneralConfigInputProps {
  currentConfig: Partial<PricingConfig>;
  setCurrentConfig: React.Dispatch<React.SetStateAction<Partial<PricingConfig>>>;
  organizationTypes: string[];
  onSave: () => void;
  onClear: () => void;
}

const GeneralConfigInput: React.FC<GeneralConfigInputProps> = ({
  currentConfig,
  setCurrentConfig,
  organizationTypes,
  onSave,
  onClear
}) => {
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [organizationTypesFromMaster, setOrganizationTypesFromMaster] = useState<string[]>([]);
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    // Load engagement models from master data
    const loadedModels = engagementModelsDataManager.getEngagementModels();
    console.log('🔄 GeneralConfigInput: Loading engagement models:', loadedModels);
    setEngagementModels(loadedModels);

    // Load entity types from master data
    const loadedEntityTypes = entityTypeDataManager.loadData();
    console.log('🔄 GeneralConfigInput: Loading entity types:', loadedEntityTypes);
    setEntityTypes(loadedEntityTypes);

    // Load organization types from master data
    const loadedOrgTypes = organizationTypesDataManager.loadData();
    console.log('🔄 GeneralConfigInput: Loading organization types:', loadedOrgTypes);
    setOrganizationTypesFromMaster(loadedOrgTypes);

    // Load countries from master data
    const loadedCountries = countriesDataManager.loadData();
    console.log('🔄 GeneralConfigInput: Loading countries:', loadedCountries);
    setCountries(loadedCountries);
  }, []);

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          {/* Master Data Selection Section */}
          <MasterDataSelectionSection
            currentConfig={currentConfig}
            setCurrentConfig={setCurrentConfig}
            entityTypes={entityTypes}
            organizationTypesFromMaster={organizationTypesFromMaster}
            countries={countries}
          />

          {/* Discount Section for Active Members */}
          <DiscountSection
            currentConfig={currentConfig}
            setCurrentConfig={setCurrentConfig}
          />

          {/* Engagement Model Pricing Section */}
          <EngagementModelPricingSection
            currentConfig={currentConfig}
            setCurrentConfig={setCurrentConfig}
            engagementModels={engagementModels}
          />

          <ConfigurationActions
            currentConfig={currentConfig}
            onSave={onSave}
            onClear={onClear}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralConfigInput;
