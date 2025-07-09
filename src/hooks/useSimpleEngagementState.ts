import { useState, useEffect } from 'react';

interface SimpleEngagementState {
  membership_status: 'inactive' | 'active' | 'member_paid';
  membership_type: 'not-a-member' | 'annual' | null;
  selected_engagement_model: string | null;
  selected_frequency: 'quarterly' | 'half-yearly' | 'annual' | null;
}

const DEFAULT_STATE: SimpleEngagementState = {
  membership_status: 'inactive',
  membership_type: null,
  selected_engagement_model: null,
  selected_frequency: null
};

export const useSimpleEngagementState = () => {
  const [state, setState] = useState<SimpleEngagementState>(DEFAULT_STATE);

  const updateMembershipStatus = (status: SimpleEngagementState['membership_status']) => {
    setState(prev => ({ ...prev, membership_status: status }));
  };

  const updateMembershipType = (type: SimpleEngagementState['membership_type']) => {
    setState(prev => ({ ...prev, membership_type: type }));
  };

  const updateEngagementModel = (model: string | null) => {
    setState(prev => ({ ...prev, selected_engagement_model: model }));
  };

  const updateFrequency = (frequency: SimpleEngagementState['selected_frequency']) => {
    setState(prev => ({ ...prev, selected_frequency: frequency }));
  };

  return {
    state,
    updateMembershipStatus,
    updateMembershipType,
    updateEngagementModel,
    updateFrequency
  };
};