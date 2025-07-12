import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ActivationStatus {
  isActivated: boolean;
  activatedModel?: string;
  activationData?: any;
  loading: boolean;
  error?: string;
}

export const useEngagementActivationStatus = (organizationId?: string) => {
  const [status, setStatus] = useState<ActivationStatus>({
    isActivated: false,
    loading: true
  });

  useEffect(() => {
    const checkActivationStatus = async () => {
      if (!organizationId) {
        setStatus({
          isActivated: false,
          loading: false
        });
        return;
      }

      try {
        setStatus(prev => ({ ...prev, loading: true }));

        // Query engagement_activations table for any locked engagements for this organization
        const { data, error } = await supabase
          .from('engagement_activations')
          .select('*')
          .eq('user_id', organizationId)
          .eq('engagement_locked', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error checking activation status:', error);
          setStatus({
            isActivated: false,
            loading: false,
            error: error.message
          });
          return;
        }

        if (data && data.length > 0) {
          setStatus({
            isActivated: true,
            activatedModel: data[0].engagement_model,
            activationData: data[0],
            loading: false
          });
        } else {
          setStatus({
            isActivated: false,
            loading: false
          });
        }
      } catch (err) {
        console.error('Unexpected error checking activation status:', err);
        setStatus({
          isActivated: false,
          loading: false,
          error: 'Failed to check activation status'
        });
      }
    };

    checkActivationStatus();
  }, [organizationId]);

  return status;
};