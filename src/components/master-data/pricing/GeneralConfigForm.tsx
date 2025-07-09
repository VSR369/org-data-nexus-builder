
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PricingConfig } from '@/types/pricing';
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

  const handleSaveConfig = async () => {
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
      discountPercentage: currentConfig.membershipStatus === 'member' ? currentConfig.discountPercentage! : undefined,
      internalPaasPricing: currentConfig.internalPaasPricing || [],
      version: (currentConfig.version || 0) + 1,
      createdAt: currentConfig.createdAt || new Date().toISOString().split('T')[0],
    } as PricingConfig;

    console.log('✅ Configuration to save:', configToSave);

    try {
      // Update configs state
      const updatedConfigs = currentConfig.id 
        ? configs.map(config => config.id === currentConfig.id ? configToSave : config)
        : [...configs, configToSave];
      
      setConfigs(updatedConfigs);

      // Save to Supabase asynchronously
      const { savePricingConfigsAsync } = await import('@/utils/pricing/pricingCore');
      await savePricingConfigsAsync(updatedConfigs);

      toast({
        title: "Success",
        description: "Configuration saved to database successfully.",
      });

      console.log('✅ Configuration saved to Supabase successfully');
    } catch (error) {
      console.error('❌ Failed to save to Supabase:', error);
      
      toast({
        title: "Warning",
        description: "Configuration saved locally but may not be persistent. Please try again.",
        variant: "destructive",
      });
    }

    // Clear form after saving
    setCurrentConfig({});
  };

  const handleEdit = (config: PricingConfig) => {
    setCurrentConfig(config);
  };

  const handleDelete = async (configId: string) => {
    try {
      const updatedConfigs = configs.filter(config => config.id !== configId);
      setConfigs(updatedConfigs);

      // Delete from Supabase asynchronously
      const { savePricingConfigsAsync } = await import('@/utils/pricing/pricingCore');
      await savePricingConfigsAsync(updatedConfigs);
      
      toast({
        title: "Success",
        description: "Configuration deleted from database successfully.",
      });
    } catch (error) {
      console.error('❌ Failed to delete from Supabase:', error);
      
      toast({
        title: "Warning", 
        description: "Configuration deleted locally but may not be persistent.",
        variant: "destructive",
      });
    }
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
