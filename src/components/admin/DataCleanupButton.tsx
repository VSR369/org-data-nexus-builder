
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { dataCleanupService } from '@/utils/dataCleanup';

const DataCleanupButton: React.FC = () => {
  const [isClearing, setIsClearing] = useState(false);

  const handleDataCleanup = async () => {
    setIsClearing(true);
    
    try {
      console.log('🗑️ Starting data cleanup process...');
      
      // Clear all organization data
      await dataCleanupService.clearAllSolutionSeekingOrganizationData();
      
      // Verify cleanup
      const verification = await dataCleanupService.verifyDataCleanup();
      
      if (verification.userProfilesCleared && verification.localStorageCleared) {
        toast.success('All Solution Seeking Organization data has been cleared successfully!');
        console.log('✅ Data cleanup completed successfully');
        
        // Reload the page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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
          <AlertDialogDescription className="space-y-2">
            <p>This action will permanently delete:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>All registered Solution Seeking Organizations</li>
              <li>All user profiles and authentication data</li>
              <li>All membership information and selections</li>
              <li>All engagement model selections</li>
              <li>All session data</li>
            </ul>
            <p className="font-medium text-red-600 mt-3">
              This action cannot be undone. Master data configurations will be preserved.
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
