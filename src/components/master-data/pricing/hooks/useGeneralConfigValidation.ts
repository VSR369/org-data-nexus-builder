
import { PricingConfig } from '../types';
import { useToast } from "@/hooks/use-toast";

export const useGeneralConfigValidation = () => {
  const { toast } = useToast();

  const validateConfig = (currentConfig: Partial<PricingConfig>) => {
    console.log('🔍 Current config before validation:', currentConfig);
    
    // Check if all required fields are filled
    const isOrgTypeValid = currentConfig.organizationType && currentConfig.organizationType.trim() !== '';
    const isMarketplaceFeeValid = currentConfig.marketplaceFee !== undefined && 
                                   currentConfig.marketplaceFee !== null && 
                                   !isNaN(currentConfig.marketplaceFee) &&
                                   currentConfig.marketplaceFee >= 0;
    const isAggregatorFeeValid = currentConfig.aggregatorFee !== undefined && 
                                 currentConfig.aggregatorFee !== null && 
                                 !isNaN(currentConfig.aggregatorFee) &&
                                 currentConfig.aggregatorFee >= 0;
    const isMarketplacePlusAggregatorFeeValid = currentConfig.marketplacePlusAggregatorFee !== undefined && 
                                                currentConfig.marketplacePlusAggregatorFee !== null && 
                                                !isNaN(currentConfig.marketplacePlusAggregatorFee) &&
                                                currentConfig.marketplacePlusAggregatorFee >= 0;

    // Validate membership status is selected
    const isMembershipStatusValid = currentConfig.membershipStatus && currentConfig.membershipStatus.trim() !== '';

    // If membership status is active, discount percentage is required
    const isDiscountValid = currentConfig.membershipStatus !== 'active' || 
                           (currentConfig.discountPercentage !== undefined && 
                            currentConfig.discountPercentage !== null && 
                            !isNaN(currentConfig.discountPercentage) &&
                            currentConfig.discountPercentage >= 0 &&
                            currentConfig.discountPercentage <= 100);

    console.log('🔍 Validation checks:', {
      isOrgTypeValid,
      isMarketplaceFeeValid,
      isAggregatorFeeValid,
      isMarketplacePlusAggregatorFeeValid,
      isMembershipStatusValid,
      isDiscountValid
    });

    if (!isOrgTypeValid || !isMarketplaceFeeValid || !isAggregatorFeeValid || !isMarketplacePlusAggregatorFeeValid || !isMembershipStatusValid || !isDiscountValid) {
      let errorMessage = "Please fill in all required fields with valid values.";
      if (currentConfig.membershipStatus === 'active' && !isDiscountValid) {
        errorMessage = "Discount percentage is required when membership status is Active and must be between 0-100%.";
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const checkForDuplicates = (currentConfig: Partial<PricingConfig>, configs: PricingConfig[]) => {
    const existingConfig = configs.find(config => 
      config.organizationType === currentConfig.organizationType && 
      config.id !== currentConfig.id
    );

    if (existingConfig) {
      toast({
        title: "Error",
        description: "Configuration for this organization type already exists.",
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
