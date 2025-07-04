
import { useState, useEffect, useRef } from 'react';
import { MasterDataPersistenceManager } from '@/utils/masterDataPersistenceManager';
import { countriesDataManager } from '@/utils/sharedDataManagers';
import { MasterDataSeeder } from '@/utils/masterDataSeeder';
import { MembershipFeeEntry, Currency, Country, membershipFeeConfig } from './types';

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

  // Function to check data health
  const checkDataHealth = () => {
    const currencyHealth = MasterDataPersistenceManager.validateDataIntegrity(
      { key: 'master_data_currencies', version: 2, preserveUserData: true }
    );
    const membershipHealth = MasterDataPersistenceManager.validateDataIntegrity<MembershipFeeEntry[]>(membershipFeeConfig);
    
    return {
      currencies: currencyHealth,
      membershipFees: membershipHealth
    };
  };

  // FIXED: Enhanced data loading - force raw format only
  const loadDataSafely = () => {
    console.log('🔄 Starting safe data load...');
    setIsLoading(true);
    
    try {
      const loadedCurrencies = MasterDataSeeder.getCurrencies();
      const loadedCountries = countriesDataManager.loadData();
      const loadedEntityTypes = MasterDataSeeder.getEntityTypes();
      
      // CRITICAL FIX: Load membership fees with immediate unwrapping
      let loadedFees: MembershipFeeEntry[] = [];
      
      const rawData = localStorage.getItem('master_data_seeker_membership_fees');
      if (rawData) {
        try {
          const parsed = JSON.parse(rawData);
          
          // Handle wrapped format (convert to raw immediately)
          if (parsed && typeof parsed === 'object' && parsed.data && Array.isArray(parsed.data)) {
            console.log('🔧 FIXING: Found wrapped membership fee data, converting to raw...');
            loadedFees = parsed.data;
            // IMMEDIATELY fix the structure in localStorage
            localStorage.setItem('master_data_seeker_membership_fees', JSON.stringify(loadedFees));
            // Clean up wrapped format artifacts
            localStorage.removeItem('user_created_master_data_seeker_membership_fees');
            localStorage.removeItem('backup_master_data_seeker_membership_fees');
            console.log('✅ FIXED: Converted wrapped to raw format permanently');
          } else if (Array.isArray(parsed)) {
            // Already in raw format - good!
            loadedFees = parsed;
            console.log('✅ Found raw format membership fees:', loadedFees.length);
          } else {
            console.log('⚠️ Invalid data structure, will use empty array');
          }
        } catch (error) {
          console.error('❌ Failed to parse membership fee data:', error);
        }
      }
      
      // If still no data, try persistence manager as last resort but convert immediately
      if (loadedFees.length === 0) {
        const legacyData = MasterDataPersistenceManager.loadUserData<MembershipFeeEntry[]>(membershipFeeConfig);
        if (legacyData && legacyData.length > 0) {
          console.log('🔧 Converting legacy data to raw format...');
          loadedFees = legacyData;
          // IMMEDIATELY save as raw format
          localStorage.setItem('master_data_seeker_membership_fees', JSON.stringify(loadedFees));
          console.log('✅ Legacy data converted to raw format');
        }
      }
      
      console.log('🔍 Safe Load Results:');
      console.log('  - Currencies:', loadedCurrencies.length);
      console.log('  - Countries:', loadedCountries.length);
      console.log('  - Entity types:', loadedEntityTypes.length);
      console.log('  - Membership fees:', loadedFees.length, loadedFees);
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setCurrencies(loadedCurrencies);
        setCountries(loadedCountries);
        setEntityTypes(loadedEntityTypes);
        
        // Critical: Set membership fees with validation
        if (Array.isArray(loadedFees)) {
          setMembershipFees(loadedFees);
          console.log('✅ Successfully set membershipFees state:', loadedFees.length);
        } else {
          console.warn('⚠️ Invalid membership fees data, using empty array');
          setMembershipFees([]);
        }
        
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
    
    // Check if we have data in storage but empty state
    const hasStorageData = MasterDataPersistenceManager.hasUserData(membershipFeeConfig);
    const hasStateData = membershipFees.length > 0;
    
    if (hasStorageData && !hasStateData) {
      console.log('🚨 Data loss detected! Storage has data but state is empty. Recovering...');
      
      const recoveredFees = MasterDataPersistenceManager.loadUserData<MembershipFeeEntry[]>(membershipFeeConfig) || [];
      if (recoveredFees.length > 0) {
        console.log('🔄 Auto-recovering', recoveredFees.length, 'membership fees');
        setMembershipFees(recoveredFees);
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

  // FIXED: Save ONLY in raw format to prevent diagnostic issues
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
    
    console.log(`💾 Saving ${membershipFees.length} membership fees in RAW FORMAT ONLY`);
    
    try {
      // CRITICAL: Save in raw format only - no wrapped format
      localStorage.setItem('master_data_seeker_membership_fees', JSON.stringify(membershipFees));
      console.log("✅ Successfully saved membership fees in raw format");
      
      // Remove any wrapped format data to prevent conflicts
      localStorage.removeItem('user_created_master_data_seeker_membership_fees');
      localStorage.removeItem('backup_master_data_seeker_membership_fees');
      
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
