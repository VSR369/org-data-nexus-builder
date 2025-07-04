import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Database,
  HardDrive,
  Settings
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { completeDataResetService } from '@/utils/completeDataReset';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ResetResults {
  indexedDBCleared: boolean;
  localStorageCleared: boolean;
  sessionStorageCleared: boolean;
  masterDataCleared: boolean;
  remainingKeys: string[];
}

export const CompleteDataResetButton: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resetResults, setResetResults] = useState<ResetResults | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const handleCompleteReset = async () => {
    setIsResetting(true);
    setResetResults(null);
    
    try {
      await completeDataResetService.performCompleteReset();
      
      toast({
        title: "Complete Reset Successful! 🎉",
        description: "All Solution Seeking Organization data has been cleared. The page will refresh automatically.",
      });
      
      // Auto-verify after reset
      setTimeout(async () => {
        await handleVerifyReset();
        
        // Refresh page after verification
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, 1000);
      
    } catch (error) {
      console.error('Reset failed:', error);
      toast({
        title: "Reset Failed",
        description: "There was an error during the complete reset. Please check the console for details.",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleVerifyReset = async () => {
    setIsVerifying(true);
    
    try {
      const results = await completeDataResetService.verifyCompleteReset();
      setResetResults(results);
      
      const allCleared = results.indexedDBCleared && 
                        results.localStorageCleared && 
                        results.sessionStorageCleared && 
                        results.masterDataCleared;
      
      if (allCleared) {
        toast({
          title: "Verification Passed ✅",
          description: "All data has been successfully cleared from the application.",
        });
      } else {
        toast({
          title: "Verification Warning ⚠️",
          description: `Some data may still remain. Check the results below.`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Verification failed:', error);
      toast({
        title: "Verification Failed",
        description: "Could not verify the reset. Please check the console for details.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = (cleared: boolean) => {
    return cleared ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  const getStatusBadge = (cleared: boolean) => {
    return (
      <Badge variant={cleared ? "default" : "destructive"}>
        {cleared ? "Cleared" : "Not Cleared"}
      </Badge>
    );
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <Trash2 className="w-5 h-5" />
          Complete Data Reset
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>WARNING:</strong> This will permanently delete ALL Solution Seeking Organization data including:
            <br />• User accounts, passwords, and login history
            <br />• Organization details and profiles
            <br />• Membership and engagement model selections
            <br />• Master data configurations
            <br />• All cached and stored application data
          </AlertDescription>
        </Alert>

        <div className="flex gap-2 flex-wrap">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                disabled={isResetting}
                className="flex items-center gap-2"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Complete Reset
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  Confirm Complete Data Reset
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>Are you absolutely sure you want to perform a complete data reset?</p>
                  <p className="font-semibold text-red-600">
                    This action will permanently delete ALL Solution Seeking Organization data 
                    and cannot be undone.
                  </p>
                  <p>This includes:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>All user accounts and authentication data</li>
                    <li>Organization profiles and details</li>
                    <li>Membership status and payment history</li>
                    <li>Engagement model selections</li>
                    <li>Master data configurations</li>
                    <li>Application caches and stored data</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleCompleteReset}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Yes, Reset Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button 
            variant="outline" 
            onClick={handleVerifyReset}
            disabled={isVerifying}
            className="flex items-center gap-2"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Verify Reset
              </>
            )}
          </Button>
        </div>

        {resetResults && (
          <div className="space-y-4 mt-6">
            <h4 className="font-semibold flex items-center gap-2">
              <Database className="w-4 h-4" />
              Reset Verification Results
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(resetResults.indexedDBCleared)}
                  <span className="text-sm">IndexedDB</span>
                </div>
                {getStatusBadge(resetResults.indexedDBCleared)}
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(resetResults.localStorageCleared)}
                  <span className="text-sm">localStorage</span>
                </div>
                {getStatusBadge(resetResults.localStorageCleared)}
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(resetResults.sessionStorageCleared)}
                  <span className="text-sm">sessionStorage</span>
                </div>
                {getStatusBadge(resetResults.sessionStorageCleared)}
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(resetResults.masterDataCleared)}
                  <span className="text-sm">Master Data</span>
                </div>
                {getStatusBadge(resetResults.masterDataCleared)}
              </div>
            </div>

            {resetResults.remainingKeys.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>Remaining Keys Found ({resetResults.remainingKeys.length}):</strong></p>
                    <div className="text-xs font-mono bg-gray-100 p-2 rounded max-h-32 overflow-y-auto">
                      {resetResults.remainingKeys.map((key, index) => (
                        <div key={index}>{key}</div>
                      ))}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {resetResults.remainingKeys.length === 0 && 
             resetResults.indexedDBCleared && 
             resetResults.localStorageCleared && 
             resetResults.sessionStorageCleared && 
             resetResults.masterDataCleared && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>✅ Complete Reset Successful!</strong> All Solution Seeking Organization 
                  data has been successfully cleared from the application.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};