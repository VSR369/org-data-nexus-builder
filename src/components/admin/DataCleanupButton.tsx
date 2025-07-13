
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { dataCleanupService } from '@/utils/dataCleanup';

const DataCleanupButton: React.FC = () => {
  const [isClearing, setIsClearing] = useState(false);
  const [dataCounts, setDataCounts] = useState({ profiles: 0, activations: 0, authUsers: 0, configs: 0 });

  useEffect(() => {
    const loadDataCounts = async () => {
      try {
        const counts = await dataCleanupService.getDataCounts();
        setDataCounts(counts);
      } catch (error) {
        console.error('Error loading data counts:', error);
      }
    };
    
    loadDataCounts();
  }, []);

  const handleDataCleanup = async () => {
    setIsClearing(true);
    
    try {
      console.log('🗑️ Starting data cleanup process...');
      
      // Clear all organization data
      await dataCleanupService.clearAllSolutionSeekingOrganizationData();
      
      // Verify cleanup
      const verification = await dataCleanupService.verifyDataCleanup();
      
      if (verification.userProfilesCleared && verification.localStorageCleared && verification.databaseCleared) {
        toast.success(`✅ Complete cleanup successful! Database: ${verification.databaseCounts.profiles} profiles, ${verification.databaseCounts.activations} activations, ${verification.databaseCounts.authUsers} auth users remaining. Master data preserved: ${verification.databaseCounts.configs} configs.`);
        console.log('✅ Data cleanup completed successfully');
        
        // Reload the page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.warning('Data cleanup completed with some remaining items. Check console for details.');
        console.log('⚠️ Cleanup completed but some data may remain:', verification);
      }
      
    } catch (error) {
      console.error('❌ Data cleanup failed:', error);
      toast.error('Failed to clear data. Please check console for details.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="flex items-center gap-2"
          disabled={isClearing}
        >
          {isClearing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {isClearing ? 'Clearing Data...' : 'Clear All Organization Data'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear All Solution Seeking Organization Data</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-md border">
              <p className="font-medium text-blue-900 mb-2">Current Data Counts:</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                <div>• Profiles: {dataCounts.profiles}</div>
                <div>• Auth Users: {dataCounts.authUsers}</div>
                <div>• Activations: {dataCounts.activations}</div>
                <div>• Configs: {dataCounts.configs} (preserved)</div>
              </div>
            </div>
            
            <p>This action will permanently delete:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>All Supabase profiles and engagement activations</li>
              <li>All authentication users (enables email reuse)</li>
              <li>All IndexedDB and localStorage data</li>
              <li>All browser form cache</li>
            </ul>
            <p className="font-medium text-red-600 mt-3">
              This action cannot be undone. Master data (pricing configs) will be preserved.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDataCleanup}
            className="bg-red-600 hover:bg-red-700"
            disabled={isClearing}
          >
            {isClearing ? 'Clearing...' : 'Clear All Data'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DataCleanupButton;
