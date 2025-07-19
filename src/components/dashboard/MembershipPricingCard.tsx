import React from 'react';
import { EnhancedMembershipFlowCard } from './membership/EnhancedMembershipFlowCard';

interface MembershipPricingCardProps {
  profile: any;
}

export const MembershipPricingCard: React.FC<MembershipPricingCardProps> = ({ profile }) => {
  // Get user ID from profile (assuming it exists)
  const userId = profile?.id;

  if (!userId) {
    return <div>User ID not found</div>;
  }

  return <EnhancedMembershipFlowCard profile={profile} userId={userId} />;
};