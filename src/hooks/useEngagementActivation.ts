import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EngagementActivation {
  id: string;
  engagement_model: string;
  membership_status: string;
  activation_status: string;
  created_at: string;
}

export const useEngagementActivation = () => {
  const [hasActivation, setHasActivation] = useState<boolean>(false);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkActivation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // No user logged in, check localStorage for any activations
        const savedActivation = localStorage.getItem('engagementActivation');
        if (savedActivation) {
          const activation = JSON.parse(savedActivation);
          setHasActivation(true);
          setActiveModel(activation.engagement_model);
        } else {
          setHasActivation(false);
          setActiveModel(null);
        }
        setLoading(false);
        return;
      }

      // User is authenticated, check database
      const { data, error: dbError } = await supabase
        .from('engagement_activations')
        .select('*')
        .eq('user_id', user.id)
        .eq('activation_status', 'Activated')
        .order('created_at', { ascending: false })
        .limit(1);

      if (dbError) {
        console.error('Error checking engagement activation:', dbError);
        setError('Failed to check activation status');
        setHasActivation(false);
        setActiveModel(null);
      } else {
        if (data && data.length > 0) {
          setHasActivation(true);
          setActiveModel(data[0].engagement_model);
        } else {
          setHasActivation(false);
          setActiveModel(null);
        }
      }
    } catch (err) {
      console.error('Error in checkActivation:', err);
      setError('Failed to check activation status');
      setHasActivation(false);
      setActiveModel(null);
    } finally {
      setLoading(false);
    }
  };

  const recordActivation = async (engagementModel: string, membershipStatus: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // No user logged in, save to localStorage
        const activation = {
          engagement_model: engagementModel,
          membership_status: membershipStatus,
          activation_status: 'Activated',
          created_at: new Date().toISOString()
        };
        localStorage.setItem('engagementActivation', JSON.stringify(activation));
        setHasActivation(true);
        setActiveModel(engagementModel);
        return;
      }

      // User is authenticated, save to database
      const { error: insertError } = await supabase
        .from('engagement_activations')
        .insert({
          user_id: user.id,
          engagement_model: engagementModel,
          membership_status: membershipStatus,
          activation_status: 'Activated'
        });

      if (insertError) {
        console.error('Error recording activation:', insertError);
        throw new Error('Failed to record activation');
      }

      setHasActivation(true);
      setActiveModel(engagementModel);
    } catch (err) {
      console.error('Error in recordActivation:', err);
      throw err;
    }
  };

  useEffect(() => {
    checkActivation();
  }, []);

  return {
    hasActivation,
    activeModel,
    loading,
    error,
    recordActivation,
    refetch: checkActivation
  };
};