
import { useToast } from "@/hooks/use-toast";
import { PricingConfig } from '../types';

export const useGeneralConfigValidation = () => {
  const { toast } = useToast();

  const validateConfig = (config: Partial<PricingConfig>): boolean => {
    if (!config.organizationType) {
      toast({
        title: "Validation Error",
        description: "Please select an organization type.",
        variant: "destructive",
      });
      return false;
    }

    if (!config.entityType) {
      toast({
        title: "Validation Error",
        description: "Please select an entity type.",
        variant: "destructive",
      });
      return false;
    }

    if (!config.engagementModel) {
      toast({
        title: "Validation Error",
        description: "Please select an engagement model.",
        variant: "destructive",
      });
      return false;
    }

    if (!config.membershipStatus) {
      toast({
        title: "Validation Error",
        description: "Please select a membership status.",
        variant: "destructive",
      });
      return false;
    }

    // Validate at least one fee is provided
    const hasQuarterlyFee = config.quarterlyFee !== undefined && config.quarterlyFee > 0;
    const hasHalfYearlyFee = config.halfYearlyFee !== undefined && config.halfYearlyFee > 0;
    const hasAnnualFee = config.annualFee !== undefined && config.annualFee > 0;

    if (!hasQuarterlyFee && !hasHalfYearlyFee && !hasAnnualFee) {
      toast({
        title: "Validation Error",
        description: "Please provide at least one engagement model fee (quarterly, half yearly, or annual).",
        variant: "destructive",
      });
      return false;
    }

    if (config.membershipStatus === 'active' && (config.discountPercentage === undefined || config.discountPercentage < 0)) {
      toast({
        title: "Validation Error",
        description: "Please provide a valid discount percentage for active members.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const checkForDuplicates = (currentConfig: Partial<PricingConfig>, existingConfigs: PricingConfig[]): boolean => {
    const duplicate = existingConfigs.find(config => 
      config.id !== currentConfig.id &&
      config.organizationType === currentConfig.organizationType &&
      config.entityType === currentConfig.entityType &&
      config.engagementModel === currentConfig.engagementModel &&
      config.membershipStatus === currentConfig.membershipStatus
    );

    if (duplicate) {
      toast({
        title: "Duplicate Configuration",
        description: "A configuration with the same organization type, entity type, engagement model, and membership status already exists.",
        variant: "destructive",
      });
      return true;
    }

    return false;
  };

  return {
    validateConfig,
    checkForDuplicates
  };
};
