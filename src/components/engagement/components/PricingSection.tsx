
import React from 'react';
import { formatCurrency, getBothMemberAndNonMemberPricing, getDisplayAmount } from '@/utils/membershipPricingUtils';
import { PricingConfig } from '@/types/pricing';

interface PricingSectionProps {
  selectedEngagementModel: string;
  selectedFrequency: string | null;
  membershipStatus: string;
  pricingConfigs: PricingConfig[];
  country: string;
  organizationType: string;
  isMarketplace: boolean;
  isPaaS: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  selectedEngagementModel,
  selectedFrequency,
  membershipStatus,
  pricingConfigs,
  country,
  organizationType,
  isMarketplace,
  isPaaS
}) => {
  console.log('🚀 PricingSection props:', {
    selectedEngagementModel,
    selectedFrequency,
    membershipStatus,
    country,
    organizationType,
    isMarketplace,
    isPaaS,
    pricingConfigsCount: pricingConfigs.length
  });

  const { memberConfig, nonMemberConfig } = getBothMemberAndNonMemberPricing(
    selectedEngagementModel,
    pricingConfigs,
    country,
    organizationType
  );

  console.log('💰 Pricing configs retrieved:', {
    memberConfig: memberConfig ? {
      id: memberConfig.id,
      engagementModel: memberConfig.engagementModel,
      membershipStatus: memberConfig.membershipStatus,
      quarterlyFee: memberConfig.quarterlyFee,
      halfYearlyFee: memberConfig.halfYearlyFee,
      annualFee: memberConfig.annualFee,
      currency: memberConfig.currency
    } : null,
    nonMemberConfig: nonMemberConfig ? {
      id: nonMemberConfig.id,
      engagementModel: nonMemberConfig.engagementModel,
      membershipStatus: nonMemberConfig.membershipStatus,
      quarterlyFee: nonMemberConfig.quarterlyFee,
      halfYearlyFee: nonMemberConfig.halfYearlyFee,
      annualFee: nonMemberConfig.annualFee,
      currency: nonMemberConfig.currency
    } : null
  });

  const isMembershipPaid = membershipStatus === 'member_paid';
  const currentPricing = isMembershipPaid && memberConfig ? memberConfig : nonMemberConfig;

  console.log('🎯 Current pricing selection:', {
    isMembershipPaid,
    selectedPricing: currentPricing ? 'memberConfig' : 'nonMemberConfig',
    currentPricingId: currentPricing?.id
  });

  let currentAmount = null;
  let nonMemberAmount = null;
  let memberAmount = null;

  if (isMarketplace) {
    if (currentPricing && currentPricing.platformFeePercentage) {
      currentAmount = { amount: currentPricing.platformFeePercentage, isPercentage: true };
    }
    if (nonMemberConfig && nonMemberConfig.platformFeePercentage) {
      nonMemberAmount = { amount: nonMemberConfig.platformFeePercentage, isPercentage: true };
    }
    if (memberConfig && memberConfig.platformFeePercentage) {
      memberAmount = { amount: memberConfig.platformFeePercentage, isPercentage: true };
    }
  } else if (isPaaS && selectedFrequency) {
    console.log('💳 Processing PaaS pricing with frequency:', selectedFrequency);
    
    if (currentPricing) {
      console.log('🔄 Getting current pricing amount...');
      const amount = getDisplayAmount(selectedFrequency, currentPricing, membershipStatus);
      console.log('📊 Current pricing result:', amount);
      currentAmount = amount ? { amount: amount.amount, isPercentage: false } : null;
    }
    if (nonMemberConfig) {
      console.log('🔄 Getting non-member pricing amount...');
      const amount = getDisplayAmount(selectedFrequency, nonMemberConfig, 'inactive');
      console.log('📊 Non-member pricing result:', amount);
      nonMemberAmount = amount ? { amount: amount.amount, isPercentage: false } : null;
    }
    if (memberConfig) {
      console.log('🔄 Getting member pricing amount...');
      const amount = getDisplayAmount(selectedFrequency, memberConfig, 'member_paid');
      console.log('📊 Member pricing result:', amount);
      memberAmount = amount ? { amount: amount.amount, isPercentage: false } : null;
    }
    
    console.log('🎯 Final amount calculations:', {
      currentAmount,
      nonMemberAmount,
      memberAmount
    });
  } else if (isPaaS && !selectedFrequency) {
    console.log('⚠️ PaaS selected but no frequency provided');
  }

  if (!currentPricing) {
    return (
      <div className="bg-muted/30 rounded-lg p-3 text-center">
        <div className="text-sm text-muted-foreground">
          No pricing configuration found for {selectedEngagementModel}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-lg p-3 text-center">
      {isMarketplace && currentAmount ? (
        <>
          <div className="text-xl font-bold text-primary">
            Platform fee = {currentAmount.amount}% of Solution Fee
          </div>
        </>
      ) : isPaaS && selectedFrequency && currentAmount ? (
        <>
          <div className="text-xl font-bold text-primary">
            {formatCurrency(currentAmount.amount, currentPricing?.currency || 'USD')}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            per {selectedFrequency === 'half-yearly' ? 'half year' : selectedFrequency.replace('ly', '')}
          </p>
        </>
      ) : isPaaS && !selectedFrequency ? (
        <div className="text-sm text-muted-foreground">
          Select frequency to view pricing
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          Loading pricing configuration...
        </div>
      )}
      
      {/* Show discount info for members when applicable */}
      {isMembershipPaid && memberAmount && nonMemberAmount && (
        isMarketplace ? (
          // Show percentage discount for marketplace
          memberAmount.amount < nonMemberAmount.amount && (
            <div className="bg-green-50 border border-green-200 rounded-md p-2 mt-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground line-through">
                  Platform fee = {nonMemberAmount.amount}% of Solution Fee
                </span>
                <span className="text-green-700 font-medium">
                  Save {(nonMemberAmount.amount - memberAmount.amount).toFixed(1)}%
                </span>
              </div>
            </div>
          )
        ) : (
          // Show currency discount for PaaS
          memberAmount.amount < nonMemberAmount.amount && (
            <div className="bg-green-50 border border-green-200 rounded-md p-2 mt-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground line-through">
                  {formatCurrency(nonMemberAmount.amount, currentPricing?.currency || 'USD')}
                </span>
                <span className="text-green-700 font-medium">
                  Save {formatCurrency(nonMemberAmount.amount - memberAmount.amount, currentPricing?.currency || 'USD')}
                </span>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};
