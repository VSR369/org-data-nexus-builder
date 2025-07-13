import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { masterDataMigrationService } from '@/services/MasterDataMigrationService';
import { supabase } from '@/integrations/supabase/client';

const MigrationTester = () => {
  const [migrationStatus, setMigrationStatus] = useState<string>('Ready');
  const [localStorageData, setLocalStorageData] = useState<Record<string, any>>({});
  const [supabaseData, setSupabaseData] = useState<Record<string, number>>({});

  const localStorageKeys = [
    'master_data_organization_types',
    'master_data_entity_types', 
    'master_data_departments',
    'master_data_industry_segments',
    'master_data_challenge_statuses',
    'master_data_solution_statuses',
    'master_data_reward_types',
    'master_data_communication_types'
  ];

  const checkLocalStorage = () => {
    const data: Record<string, any> = {};
    localStorageKeys.forEach(key => {
      const stored = localStorage.getItem(key);
      data[key] = stored ? JSON.parse(stored) : null;
    });
    setLocalStorageData(data);
    console.log('📊 LocalStorage Data:', data);
  };

  const checkSupabase = async () => {
    const tables = [
      'master_organization_types',
      'master_entity_types',
      'master_departments', 
      'master_industry_segments',
      'master_challenge_statuses',
      'master_solution_statuses',
      'master_reward_types',
      'master_communication_types'
    ];

    const counts: Record<string, number> = {};
    for (const table of tables) {
      try {
        const { count } = await supabase
          .from(table as any)
          .select('*', { count: 'exact', head: true });
        counts[table] = count || 0;
      } catch (error) {
        console.error(`Error checking ${table}:`, error);
        counts[table] = -1;
      }
    }
    setSupabaseData(counts);
    console.log('🗄️ Supabase Data:', counts);
  };

  const runMigration = async () => {
    try {
      setMigrationStatus('Running migration...');
      
      // Remove completion flag to force migration
      localStorage.removeItem('supabase_master_data_migration_complete');
      
      // Run migration
      await masterDataMigrationService.migrateAllMasterData();
      
      setMigrationStatus('Migration completed!');
      
      // Recheck both sources
      checkLocalStorage();
      await checkSupabase();
      
    } catch (error) {
      console.error('Migration failed:', error);
      setMigrationStatus(`Migration failed: ${error}`);
    }
  };

  useEffect(() => {
    checkLocalStorage();
    checkSupabase();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Master Data Migration Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={checkLocalStorage}>Check LocalStorage</Button>
          <Button onClick={checkSupabase}>Check Supabase</Button>
          <Button onClick={runMigration} variant="outline">Run Migration</Button>
        </div>
        
        <div className="text-sm font-medium">Status: {migrationStatus}</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">LocalStorage Data:</h3>
            <div className="text-sm space-y-1">
              {Object.entries(localStorageData).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span>{key.replace('master_data_', '')}:</span>
                  <span className={value ? 'text-green-600' : 'text-red-600'}>
                    {value ? (Array.isArray(value) ? `${value.length} items` : 'Has data') : 'No data'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Supabase Data:</h3>
            <div className="text-sm space-y-1">
              {Object.entries(supabaseData).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span>{key.replace('master_', '')}:</span>
                  <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
                    {value >= 0 ? `${value} items` : 'Error'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MigrationTester;