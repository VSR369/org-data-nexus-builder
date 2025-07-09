
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
      platformFeePercentage: currentConfig.platformFeePercentage,
      membershipStatus: currentConfig.membershipStatus!,
      discountPercentage: currentConfig.membershipStatus === 'member' ? currentConfig.discountPercentage! : undefined,
      internalPaasPricing: currentConfig.internalPaasPricing || [],
      version: (currentConfig.version || 0) + 1,
      createdAt: currentConfig.createdAt || new Date().toISOString().split('T')[0],
    } as PricingConfig;

    console.log('✅ Configuration to save:', configToSave);

    try {
      // Update configs state first
      const updatedConfigs = currentConfig.id 
        ? configs.map(config => config.id === currentConfig.id ? configToSave : config)
        : [...configs, configToSave];
      
      setConfigs(updatedConfigs);

      // Save to Supabase with better error handling
      const { savePricingConfigsAsync } = await import('@/utils/pricing/pricingCore');
      
      console.log('🔄 Attempting to save to database...');
      await savePricingConfigsAsync(updatedConfigs);
      console.log('✅ Successfully saved to database');

      toast({
        title: "Success",
        description: "Configuration saved to database successfully.",
      });

      console.log('✅ Configuration saved to Supabase successfully');
      
      // Clear form after successful save
      setCurrentConfig({});
      
    } catch (error: any) {
      console.error('❌ Database save failed:', error);
      
      // Check if it's a specific Supabase error
      const errorMessage = error?.message || error?.error?.message || 'Unknown error';
      console.error('❌ Error details:', errorMessage);
      
      toast({
        title: "Database Error",
        description: `Failed to save to database: ${errorMessage}. Data saved locally only.`,
        variant: "destructive",
      });
      
      // Don't clear form on error so user can retry
    }
  };

  const handleEdit = (config: PricingConfig) => {
    setCurrentConfig(config);
  };

  const handleDelete = async (configId: string) => {
    try {
      // Delete from database permanently
      const { deletePricingConfigFromDatabase } = await import('@/utils/pricing/pricingCore');
      await deletePricingConfigFromDatabase(configId);
      
      // Update local state
      const updatedConfigs = configs.filter(config => config.id !== configId);
      setConfigs(updatedConfigs);
      
      toast({
        title: "Success",
        description: "Configuration permanently deleted from database.",
      });
      
      console.log('✅ Configuration permanently deleted');
    } catch (error) {
      console.error('❌ Failed to permanently delete from database:', error);
      
      toast({
        title: "Error",
        description: "Failed to delete configuration permanently. Please try again.",
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
