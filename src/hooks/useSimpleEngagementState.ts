import { useState, useEffect } from 'react';

interface SimpleEngagementState {
  membership_status: 'inactive' | 'active' | 'member_paid';
  membership_type: 'not-a-member' | 'annual' | null;
  selected_engagement_model: string | null;
  selected_frequency: 'quarterly' | 'half-yearly' | 'annual' | null;
  engagement_payment_status: 'idle' | 'loading' | 'success' | 'error';
  engagement_activation_status: 'idle' | 'loading' | 'success' | 'error';
}

const DEFAULT_STATE: SimpleEngagementState = {
  membership_status: 'inactive',
  membership_type: null,
  selected_engagement_model: null,
  selected_frequency: null,
  engagement_payment_status: 'idle',
  engagement_activation_status: 'idle'
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
    setState(prev => {
      // Auto-select default frequency for PaaS models
      const isPaaS = model === 'Platform as a Service';
      const defaultFrequency = isPaaS ? 'quarterly' : null;
      
      return { 
        ...prev, 
        selected_engagement_model: model,
        selected_frequency: isPaaS ? defaultFrequency : prev.selected_frequency
      };
    });
  };

  const updateFrequency = (frequency: SimpleEngagementState['selected_frequency']) => {
    setState(prev => ({ ...prev, selected_frequency: frequency }));
  };

  const updateEngagementPaymentStatus = (status: SimpleEngagementState['engagement_payment_status']) => {
    setState(prev => ({ ...prev, engagement_payment_status: status }));
  };

  const updateEngagementActivationStatus = (status: SimpleEngagementState['engagement_activation_status']) => {
    setState(prev => ({ ...prev, engagement_activation_status: status }));
  };

  return {
    state,
    updateMembershipStatus,
    updateMembershipType,
    updateEngagementModel,
    updateFrequency,
    updateEngagementPaymentStatus,
    updateEngagementActivationStatus
  };
};