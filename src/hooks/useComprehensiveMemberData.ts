
import { useState, useEffect } from 'react';
import { MemberDetailsService, ComprehensiveMemberData } from '@/services/MemberDetailsService';

export const useComprehensiveMemberData = (userId: string | null) => {
  const [memberData, setMemberData] = useState<ComprehensiveMemberData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setMemberData(null);
      return;
    }

    const fetchMemberData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await MemberDetailsService.getComprehensiveMemberData(userId);
        setMemberData(data);
      } catch (err) {
        console.error('Error fetching comprehensive member data:', err);
        setError('Failed to load member data');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [userId]);

  return {
    memberData,
    loading,
    error,
    refetch: () => {
      if (userId) {
        const fetchData = async () => {
          setLoading(true);
          try {
            const data = await MemberDetailsService.getComprehensiveMemberData(userId);
            setMemberData(data);
          } catch (err) {
            setError('Failed to load member data');
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }
    }
  };
};
