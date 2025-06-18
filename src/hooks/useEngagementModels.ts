
import { useState, useEffect } from 'react';
import { engagementModelsDataManager } from '@/components/master-data/engagement-models/engagementModelsDataManager';
import { EngagementModel } from '@/components/master-data/engagement-models/types';

export const useEngagementModels = () => {
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEngagementModels = () => {
      console.log('🔄 useEngagementModels: Loading engagement models...');
      setLoading(true);
      setError(null);

      try {
        const models = engagementModelsDataManager.loadData();
        setEngagementModels(models || []);
        console.log('✅ useEngagementModels: Loaded models:', models?.length || 0);
      } catch (err) {
        console.error('❌ useEngagementModels: Error loading engagement models:', err);
        setError('Failed to load engagement models');
      } finally {
        setLoading(false);
      }
    };

    loadEngagementModels();
  }, []);

  return {
    engagementModels,
    loading,
    error,
    refetch: () => {
      const models = engagementModelsDataManager.loadData();
      setEngagementModels(models || []);
    }
  };
};
