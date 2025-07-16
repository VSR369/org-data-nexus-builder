import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const SupportTypesTest: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching support types...');
        const { data: result, error } = await supabase
          .from('master_support_types')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching support types:', error);
          setError(error.message);
        } else {
          console.log('Support types fetched successfully:', result);
          setData(result || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Support Types Test</h2>
      <div className="mb-4">
        <strong>Data count:</strong> {data.length}
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="p-2 border rounded">
            <div><strong>Name:</strong> {item.name}</div>
            <div><strong>Service Level:</strong> {item.service_level}</div>
            <div><strong>Active:</strong> {item.is_active ? 'Yes' : 'No'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};