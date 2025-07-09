import React from 'react';
import { PricingConfig } from '@/types/pricing';
import { getEngagementModelName } from '@/utils/membershipPricingUtils';

interface LoadingStateProps {
  selectedEngagementModel: string;
  membershipStatus: string;
  pricingConfigs: PricingConfig[];
  organizationType: string;
  country: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  selectedEngagementModel,
  membershipStatus,
  pricingConfigs,
  organizationType,
  country
}) => {
  return (
    <div className="text-center py-8 space-y-3">
      <p className="text-sm text-muted-foreground">
        Loading pricing for {getEngagementModelName(selectedEngagementModel)}...
      </p>
      <div className="text-xs text-gray-400 space-y-1">
        <div>Selected Model ID: {selectedEngagementModel}</div>
        <div>Mapped Name: {getEngagementModelName(selectedEngagementModel)}</div>
        <div>Membership Status: {membershipStatus === 'member_paid' ? 'member' : 'not-a-member'}</div>
        <div>Pricing Configs Available: {pricingConfigs.length}</div>
        <div>Organization Type: {organizationType}</div>
        <div>Country: {country}</div>
      </div>
    </div>
  );
};