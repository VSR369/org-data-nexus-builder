
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

    if (!config.engagementModel) {
      toast({
        title: "Validation Error",
        description: "Please select an engagement model.",
        variant: "destructive",
      });
      return false;
    }

    if (config.engagementModelFee === undefined || config.engagementModelFee < 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid engagement model fee.",
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

    if (config.membershipStatus === 'active' && (config.discountPercentage === undefined || config.discountPercentage < 0)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid discount percentage for active members.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const checkForDuplicates = (config: Partial<PricingConfig>, existingConfigs: PricingConfig[]): boolean => {
    const duplicate = existingConfigs.find(existing => 
      existing.id !== config.id &&
      existing.organizationType === config.organizationType &&
      existing.engagementModel === config.engagementModel &&
      existing.membershipStatus === config.membershipStatus
    );

    if (duplicate) {
      toast({
        title: "Duplicate Configuration",
        description: "A configuration with the same organization type, engagement model, and membership status already exists.",
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
