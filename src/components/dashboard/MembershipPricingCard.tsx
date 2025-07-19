
import React from 'react';
import { MembershipFlowCard } from './membership/MembershipFlowCard';

interface MembershipPricingCardProps {
  profile: any;
}

export const MembershipPricingCard: React.FC<MembershipPricingCardProps> = ({ profile }) => {
  // Get user ID from profile (assuming it exists)
  const userId = profile?.id;

  if (!userId) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <div className="text-gray-500 mb-2">⚠️ User ID not found</div>
          <p className="text-sm text-gray-600">Please ensure you are properly logged in</p>
        </div>
      </div>
    );
  }

  return <MembershipFlowCard profile={profile} userId={userId} />;
};
