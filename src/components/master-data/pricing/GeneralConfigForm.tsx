
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

    // Check for duplicates before proceeding
    const duplicateCheck = (existingConfig: PricingConfig) => 
      existingConfig.country === currentConfig.country &&
      existingConfig.organizationType === currentConfig.organizationType &&
      existingConfig.engagementModel === currentConfig.engagementModel &&
      existingConfig.membershipStatus === currentConfig.membershipStatus;

    const existingConfig = configs.find(duplicateCheck);
    if (existingConfig) {
      toast({
        title: "Duplicate Configuration",
        description: `A configuration already exists for ${currentConfig.country}, ${currentConfig.organizationType}, ${currentConfig.engagementModel}, ${currentConfig.membershipStatus}. Please edit the existing one or choose different parameters.`,
        variant: "destructive",
      });
      return;
    }

    // Generate stable unique ID using business keys to prevent timing-based duplicates
    const businessKey = `${currentConfig.country}-${currentConfig.organizationType}-${currentConfig.engagementModel}`;
    const timestamp = Date.now();
    const configsToSave: PricingConfig[] = [];

    // Always create the Not-a-Member base configuration
    const notMemberConfig = {
      id: `${businessKey}-${timestamp}-base`,
      configId: `${businessKey}-${timestamp}-base`,
      country: currentConfig.country!,
      currency: currentConfig.currency || '',
      organizationType: currentConfig.organizationType!,
      entityType: currentConfig.entityType!,
      engagementModel: currentConfig.engagementModel!,
      quarterlyFee: currentConfig.quarterlyFee,
      halfYearlyFee: currentConfig.halfYearlyFee,
      annualFee: currentConfig.annualFee,
      platformFeePercentage: currentConfig.platformFeePercentage,
      membershipStatus: 'not-a-member' as const,
      discountPercentage: undefined,
      internalPaasPricing: currentConfig.internalPaasPricing || [],
      version: (currentConfig.version || 0) + 1,
      createdAt: new Date().toISOString(),
    } as PricingConfig;

    configsToSave.push(notMemberConfig);

    // If user selected member status with discount, create member configuration
    if (currentConfig.membershipStatus === 'member' && currentConfig.discountPercentage) {
      // Also check for member duplicate
      const memberDuplicateCheck = (existingConfig: PricingConfig) => 
        existingConfig.country === currentConfig.country &&
        existingConfig.organizationType === currentConfig.organizationType &&
        existingConfig.engagementModel === currentConfig.engagementModel &&
        existingConfig.membershipStatus === 'member';

      const existingMemberConfig = configs.find(memberDuplicateCheck);
      if (existingMemberConfig) {
        toast({
          title: "Duplicate Member Configuration",
          description: `A member configuration already exists for ${currentConfig.country}, ${currentConfig.organizationType}, ${currentConfig.engagementModel}. Please edit the existing one.`,
          variant: "destructive",
        });
        return;
      }

      const discountMultiplier = (1 - currentConfig.discountPercentage / 100);
      
      const memberConfig = {
        ...notMemberConfig,
        id: `${businessKey}-${timestamp}-member`,
        configId: `${businessKey}-${timestamp}-member`,
        membershipStatus: 'member' as const,
        discountPercentage: currentConfig.discountPercentage,
        // Apply discount to all relevant fees
        quarterlyFee: currentConfig.quarterlyFee ? Math.round(currentConfig.quarterlyFee * discountMultiplier * 100) / 100 : undefined,
        halfYearlyFee: currentConfig.halfYearlyFee ? Math.round(currentConfig.halfYearlyFee * discountMultiplier * 100) / 100 : undefined,
        annualFee: currentConfig.annualFee ? Math.round(currentConfig.annualFee * discountMultiplier * 100) / 100 : undefined,
        platformFeePercentage: currentConfig.platformFeePercentage ? Math.round(currentConfig.platformFeePercentage * discountMultiplier * 10) / 10 : undefined,
      } as PricingConfig;

      configsToSave.push(memberConfig);
    }

    console.log('✅ Configurations to save:', configsToSave);

    try {
      // Use PricingDataManager directly to handle deduplication
      const { PricingDataManager } = await import('@/utils/pricing/PricingDataManager');
      
      console.log('🔄 Attempting to save to database...');
      
      // Get fresh data from database first
      const currentDbConfigs = await PricingDataManager.getAllConfigurationsAsync();
      const allConfigs = [...currentDbConfigs, ...configsToSave];
      
      await PricingDataManager.saveConfigurations(allConfigs);
      console.log('✅ Successfully saved to database');
      
      // Refresh configs from database to get the actual saved state
      const refreshedConfigs = await PricingDataManager.getAllConfigurationsAsync();
      setConfigs(refreshedConfigs);

      toast({
        title: "Success",
        description: `${configsToSave.length} configuration(s) saved successfully.`,
      });

      console.log('✅ Configuration saved successfully');
      
      // Clear form after successful save
      setCurrentConfig({});
      
    } catch (error: any) {
      console.error('❌ Database save failed:', error);
      
      // Check if it's a duplicate constraint error
      const errorMessage = error?.message || error?.error?.message || 'Unknown error';
      
      if (errorMessage.includes('unique constraint') || errorMessage.includes('duplicate key')) {
        toast({
          title: "Duplicate Configuration",
          description: "A configuration with these parameters already exists. Please check existing configurations.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Database Error",
          description: `Failed to save to database: ${errorMessage}. Please try again.`,
          variant: "destructive",
        });
      }
      
      console.error('❌ Error details:', errorMessage);
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
