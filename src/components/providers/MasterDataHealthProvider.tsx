import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { masterDataHealthService } from '@/services/MasterDataHealthService';
import { toast } from 'sonner';

interface HealthCheckResult {
  isHealthy: boolean;
  fixedIssues: string[];
  checkedKeys: string[];
  errors: string[];
  timestamp: string;
}

interface MasterDataHealthContextType {
  isHealthy: boolean;
  isChecking: boolean;
  lastCheckResult: HealthCheckResult | null;
  runHealthCheck: () => Promise<void>;
}

const MasterDataHealthContext = createContext<MasterDataHealthContextType | undefined>(undefined);

interface MasterDataHealthProviderProps {
  children: ReactNode;
  enableAutoFix?: boolean;
  showToastNotifications?: boolean;
}

export const MasterDataHealthProvider: React.FC<MasterDataHealthProviderProps> = ({
  children,
  enableAutoFix = true,
  showToastNotifications = true
}) => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckResult, setLastCheckResult] = useState<HealthCheckResult | null>(null);

  const runHealthCheck = async () => {
    if (isChecking) return;

    console.log('🏥 Running master data health check...');
    setIsChecking(true);

    try {
      // First run the initialization service to fix any issues
      const { MasterDataInitializationService } = await import('@/services/MasterDataInitializationService');
      const fixResults = await MasterDataInitializationService.initializeAllMasterData();
      
      // Then run the standard health check
      const result = await masterDataHealthService.runHealthCheck();
      
      // Combine results
      const combinedResult = {
        ...result,
        fixedIssues: [...result.fixedIssues, ...fixResults.fixed],
        errors: [...result.errors, ...fixResults.errors]
      };
      
      setLastCheckResult(combinedResult);
      setIsHealthy(combinedResult.isHealthy && fixResults.errors.length === 0);

      // Show notifications if enabled
      if (showToastNotifications) {
        const totalFixed = combinedResult.fixedIssues.length;
        if (totalFixed > 0) {
          toast.success('Master Data Auto-Fixed', {
            description: `Fixed ${totalFixed} issue(s): ${combinedResult.fixedIssues.slice(0, 2).join(', ')}${totalFixed > 2 ? '...' : ''}`
          });
        } else if (combinedResult.isHealthy) {
          console.log('✅ Master data is healthy');
        } else if (combinedResult.errors.length > 0) {
          toast.error('Master Data Issues', {
            description: `${combinedResult.errors.length} issue(s) detected. Check console for details.`
          });
        }
      }

    } catch (error) {
      console.error('❌ Health check failed:', error);
      setIsHealthy(false);
      
      if (showToastNotifications) {
        toast.error('Health Check Failed', {
          description: 'Master data health check encountered an error'
        });
      }
    } finally {
      setIsChecking(false);
    }
  };

  // Run health check on mount and when enableAutoFix changes
  useEffect(() => {
    if (enableAutoFix) {
      // Quick check first
      const quickCheckPassed = masterDataHealthService.quickHealthCheck();
      
      if (!quickCheckPassed) {
        console.log('⚠️ Quick check failed, running full health check...');
        runHealthCheck();
      } else {
        console.log('✅ Quick health check passed');
        setIsHealthy(true);
      }
    }
  }, [enableAutoFix]);

  // Periodic health check every 5 minutes (optional)
  useEffect(() => {
    if (!enableAutoFix) return;

    const interval = setInterval(() => {
      const quickCheckPassed = masterDataHealthService.quickHealthCheck();
      if (!quickCheckPassed) {
        console.log('⚠️ Periodic check detected issues, running full health check...');
        runHealthCheck();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [enableAutoFix]);

  const contextValue: MasterDataHealthContextType = {
    isHealthy,
    isChecking,
    lastCheckResult,
    runHealthCheck
  };

  return (
    <MasterDataHealthContext.Provider value={contextValue}>
      {children}
    </MasterDataHealthContext.Provider>
  );
};

export const useMasterDataHealth = (): MasterDataHealthContextType => {
  const context = useContext(MasterDataHealthContext);
  if (context === undefined) {
    throw new Error('useMasterDataHealth must be used within a MasterDataHealthProvider');
  }
  return context;
};

// Health status indicator component
export const MasterDataHealthIndicator: React.FC = () => {
  const { isHealthy, isChecking, lastCheckResult } = useMasterDataHealth();

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span>Checking master data...</span>
      </div>
    );
  }

  if (!isHealthy) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span>Master data issues detected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span>Master data healthy</span>
      {lastCheckResult?.fixedIssues.length ? (
        <span className="text-xs text-muted-foreground">
          (auto-fixed {lastCheckResult.fixedIssues.length} issues)
        </span>
      ) : null}
    </div>
  );
};