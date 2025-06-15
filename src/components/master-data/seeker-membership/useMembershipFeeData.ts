
import { useState, useEffect } from 'react';
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

  // Function to reload all master data
  const reloadMasterData = () => {
    console.log('🔄 Reloading master data with persistence priority...');
    
    const loadedCurrencies = MasterDataSeeder.getCurrencies();
    const loadedCountries = countriesDataManager.loadData();
    const loadedEntityTypes = MasterDataSeeder.getEntityTypes();
    const loadedFees = MasterDataPersistenceManager.loadUserData<MembershipFeeEntry[]>(membershipFeeConfig) || [];
    
    console.log('🔍 SeekerMembershipFeeConfig - User currencies:', loadedCurrencies.length);
    console.log('🔍 SeekerMembershipFeeConfig - Countries:', loadedCountries.length);
    console.log('🔍 SeekerMembershipFeeConfig - Entity types:', loadedEntityTypes.length);
    console.log('🔍 SeekerMembershipFeeConfig - User membership fees:', loadedFees.length);
    
    setMembershipFees(loadedFees);
    setCurrencies(loadedCurrencies);
    setCountries(loadedCountries);
    setEntityTypes(loadedEntityTypes);
    setDataHealth(checkDataHealth());
    
    return { loadedCurrencies, loadedCountries, loadedEntityTypes, loadedFees };
  };

  // Save membership fees whenever they change
  useEffect(() => {
    if (membershipFees.length > 0) {
      console.log('💾 Saving membership fees as user data:', membershipFees.length);
      MasterDataPersistenceManager.saveUserData(membershipFeeConfig, membershipFees);
      setDataHealth(checkDataHealth());
    }
  }, [membershipFees]);

  return {
    membershipFees,
    setMembershipFees,
    currencies,
    countries,
    entityTypes,
    dataHealth,
    reloadMasterData,
    userCurrencies: currencies.filter(c => c.isUserCreated !== false)
  };
};
