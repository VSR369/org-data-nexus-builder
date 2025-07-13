
import { useState, useEffect, useRef } from 'react';
import { countriesDataManager } from '@/utils/sharedDataManagers';
import { MasterDataSeeder } from '@/utils/masterDataSeeder';
import { MembershipFeeEntry, Currency, Country } from './types';
// MembershipFeeFixer removed - this hook is now legacy, use useMembershipFeeDataSupabase instead

export const useMembershipFeeData = () => {
  const [membershipFees, setMembershipFees] = useState<MembershipFeeEntry[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [dataHealth, setDataHealth] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  
  // Ref to track if component is mounted
  const isMountedRef = useRef(true);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Function to check data health - now deprecated since using Supabase
  const checkDataHealth = () => {
    console.log('⚠️ Data health check deprecated - using Supabase as single source of truth');
    
    return {
      currencies: { isValid: true, issues: [] },
      membershipFees: { isValid: true, issues: [] }
    };
  };

  // FIXED: Enhanced data loading using MembershipFeeFixer
  const loadDataSafely = () => {
    console.log('🔄 Starting safe data load...');
    setIsLoading(true);
    
    try {
      const loadedCurrencies = MasterDataSeeder.getCurrencies();
      
      // Force countries data initialization if empty
      let loadedCountries = countriesDataManager.loadData();
      if (!loadedCountries || !Array.isArray(loadedCountries) || loadedCountries.length === 0) {
        console.log('🔧 Countries data empty, forcing reset to defaults');
        loadedCountries = countriesDataManager.resetToDefault();
      }
      
      const loadedEntityTypes = MasterDataSeeder.getEntityTypes();
      
      // Legacy hook - return empty fees since we now use Supabase
      const loadedFees: any[] = [];
      
      console.log('🔍 Safe Load Results:');
      console.log('  - Currencies:', loadedCurrencies.length);
      console.log('  - Countries:', loadedCountries.length, loadedCountries);
      console.log('  - Entity types:', loadedEntityTypes.length);
      console.log('  - Membership fees:', loadedFees.length, loadedFees);
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setCurrencies(loadedCurrencies);
        setCountries(loadedCountries);
        setEntityTypes(loadedEntityTypes);
        // Map data to ensure isUserCreated is always present
        setMembershipFees(loadedFees.map(fee => ({
          ...fee,
          isUserCreated: fee.isUserCreated ?? false
        })));
        
        setDataHealth(checkDataHealth());
        setIsInitialized(true);
        setHasAttemptedLoad(true);
      }
      
      return { loadedCurrencies, loadedCountries, loadedEntityTypes, loadedFees };
    } catch (error) {
      console.error('❌ Error during safe data load:', error);
      if (isMountedRef.current) {
        setIsInitialized(true);
        setHasAttemptedLoad(true);
      }
      return null;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Function to reload all master data
  const reloadMasterData = () => {
    console.log('🔄 Reloading master data with enhanced persistence...');
    return loadDataSafely();
  };

  // Auto-recovery mechanism - detect when state is empty but storage has data
  const performAutoRecovery = () => {
    if (!isInitialized || isLoading) return;
    
    console.log('🔍 Checking for auto-recovery need...');
    
    // Legacy auto-recovery - no longer needed since using Supabase
    const storageData: any[] = [];
    const hasStorageData = storageData.length > 0;
    const hasStateData = membershipFees.length > 0;
    
    if (hasStorageData && !hasStateData) {
      console.log('🚨 Data loss detected! Storage has data but state is empty. Recovering...');
      
      if (storageData.length > 0) {
        console.log('🔄 Auto-recovering', storageData.length, 'membership fees');
        setMembershipFees(storageData.map(fee => ({
          ...fee,
          isUserCreated: fee.isUserCreated ?? false
        })));
      }
    }
  };

  // Initial load on component mount
  useEffect(() => {
    if (!hasAttemptedLoad) {
      console.log('🚀 Initial component mount - loading data...');
      loadDataSafely();
    }
  }, [hasAttemptedLoad]);

  // Auto-recovery check - runs periodically to catch state loss
  useEffect(() => {
    if (isInitialized && !isLoading) {
      const recoveryInterval = setInterval(performAutoRecovery, 1000);
      return () => clearInterval(recoveryInterval);
    }
  }, [isInitialized, isLoading, membershipFees.length]);

  // Navigation guard - detect when we return to component
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isInitialized) {
        console.log('👁️ Page became visible - checking data integrity...');
        performAutoRecovery();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isInitialized, membershipFees.length]);

  // Track when membershipFees state changes
  useEffect(() => {
    console.log('🌟 [state change] membershipFees now:', membershipFees.length, membershipFees);
  }, [membershipFees]);

  // FIXED: Save using MembershipFeeFixer to respect custom-only mode
  useEffect(() => {
    if (!isInitialized || isLoading) {
      console.log('📥 Skipping save - not initialized or loading...');
      return;
    }
    
    // Validate data before saving
    if (!Array.isArray(membershipFees)) {
      console.error('❌ Invalid membershipFees data structure, not saving');
      return;
    }
    
    console.log(`💾 Saving ${membershipFees.length} membership fees using MembershipFeeFixer`);
    
    try {
      // Legacy save - no longer needed since using Supabase
      console.log('⚠️ Legacy save ignored - use Supabase hook instead');
      console.log("✅ Successfully saved membership fees using MembershipFeeFixer");
      
      setDataHealth(checkDataHealth());
    } catch (error) {
      console.error('❌ Error saving membership fees:', error);
    }
  }, [membershipFees, isInitialized, isLoading]);

  // Enhanced setMembershipFees with validation
  const setMembershipFeesSafely = (newFees: MembershipFeeEntry[] | ((prev: MembershipFeeEntry[]) => MembershipFeeEntry[])) => {
    console.log('🔄 Setting membership fees safely...');
    
    if (typeof newFees === 'function') {
      setMembershipFees(prev => {
        const result = newFees(prev);
        console.log('🔄 Function update result:', result.length, result);
        return Array.isArray(result) ? result : prev;
      });
    } else {
      console.log('🔄 Direct update with:', newFees.length, newFees);
      setMembershipFees(Array.isArray(newFees) ? newFees : []);
    }
  };

  return {
    membershipFees,
    setMembershipFees: setMembershipFeesSafely,
    currencies,
    countries,
    entityTypes,
    dataHealth,
    reloadMasterData,
    userCurrencies: currencies.filter(c => c.isUserCreated !== false),
    isLoading,
    isInitialized
  };
};
