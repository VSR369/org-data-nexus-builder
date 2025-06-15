
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PricingConfig } from './types';
import GeneralConfigInput from './components/GeneralConfigInput';
import SavedConfigurationsList from './components/SavedConfigurationsList';
import { useGeneralConfigValidation } from './hooks/useGeneralConfigValidation';

interface GeneralConfigFormProps {
  currentConfig: Partial<PricingConfig>;
  setCurrentConfig: React.Dispatch<React.SetStateAction<Partial<PricingConfig>>>;
  organizationTypes: string[];
  configs: PricingConfig[];
  setConfigs: React.Dispatch<React.SetStateAction<PricingConfig[]>>;
}

const GeneralConfigForm: React.FC<GeneralConfigFormProps> = ({
  currentConfig,
  setCurrentConfig,
  organizationTypes,
  configs,
  setConfigs
}) => {
  const { toast } = useToast();
  const { validateConfig, checkForDuplicates } = useGeneralConfigValidation();

  const handleSaveConfig = () => {
    // Validate configuration
    if (!validateConfig(currentConfig)) {
      return;
    }

    // Check for duplicates
    if (checkForDuplicates(currentConfig, configs)) {
      return;
    }

    // Create configuration to save
    const configToSave = {
      id: currentConfig.id || Date.now().toString(),
      country: currentConfig.country!,
      currency: currentConfig.currency || '',
      organizationType: currentConfig.organizationType!,
      entityType: currentConfig.entityType!,
      engagementModel: currentConfig.engagementModel!,
      quarterlyFee: currentConfig.quarterlyFee,
      halfYearlyFee: currentConfig.halfYearlyFee,
      annualFee: currentConfig.annualFee,
      membershipStatus: currentConfig.membershipStatus!,
      discountPercentage: currentConfig.membershipStatus === 'active' ? currentConfig.discountPercentage! : undefined,
      internalPaasPricing: currentConfig.internalPaasPricing || [],
      version: (currentConfig.version || 0) + 1,
      createdAt: currentConfig.createdAt || new Date().toISOString().split('T')[0],
    } as PricingConfig;

    console.log('✅ Configuration to save:', configToSave);

    // Update configs state
    if (currentConfig.id) {
      // Update existing
      setConfigs(prev => prev.map(config => 
        config.id === currentConfig.id ? configToSave : config
      ));
    } else {
      // Add new
      setConfigs(prev => [...prev, configToSave]);
    }

    toast({
      title: "Success",
      description: "General configuration saved successfully.",
    });

    // Clear form after saving
    setCurrentConfig({});
  };

  const handleEdit = (config: PricingConfig) => {
    setCurrentConfig(config);
  };

  const handleDelete = (configId: string) => {
    setConfigs(prev => prev.filter(config => config.id !== configId));
    toast({
      title: "Success",
      description: "Configuration deleted successfully.",
    });
  };

  const handleClear = () => {
    setCurrentConfig({});
  };

  return (
    <div className="space-y-6">
      <GeneralConfigInput
        currentConfig={currentConfig}
        setCurrentConfig={setCurrentConfig}
        organizationTypes={organizationTypes}
        onSave={handleSaveConfig}
        onClear={handleClear}
      />

      <SavedConfigurationsList
        configs={configs}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default GeneralConfigForm;
