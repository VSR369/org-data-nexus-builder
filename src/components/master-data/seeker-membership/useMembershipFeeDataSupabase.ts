import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MembershipFeeEntry {
  id: string;
  country: string;
  organizationType: string;
  entityType: string;
  monthlyAmount?: number;
  monthlyCurrency?: string;
  quarterlyAmount?: number;
  quarterlyCurrency?: string;
  halfYearlyAmount?: number;
  halfYearlyCurrency?: string;
  annualAmount?: number;
  annualCurrency?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isUserCreated: boolean;
}

export interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  country: string;
  countryCode: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
}

export const useMembershipFeeDataSupabase = () => {
  const [membershipFees, setMembershipFees] = useState<MembershipFeeEntry[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const isMountedRef = useRef(true);

  const loadAllData = async () => {
    console.log('✅ CRUD TEST - Loading all membership fee data from Supabase');
    setIsLoading(true);
    
    try {
      // Load all data in parallel
      const [feesResult, currenciesResult, countriesResult, entityTypesResult] = await Promise.all([
        supabase.from('master_seeker_membership_fees').select('*').order('country, organization_type, entity_type'),
        supabase.from('master_currencies').select('*').order('name'),
        supabase.from('master_countries').select('*').order('name'),
        supabase.from('master_entity_types').select('*').order('name')
      ]);

      if (feesResult.error) throw feesResult.error;
      if (currenciesResult.error) throw currenciesResult.error;
      if (countriesResult.error) throw countriesResult.error;
      if (entityTypesResult.error) throw entityTypesResult.error;

      // Transform Supabase data to expected format
      const loadedFees: MembershipFeeEntry[] = feesResult.data?.map(fee => ({
        id: fee.id,
        country: fee.country,
        organizationType: fee.organization_type,
        entityType: fee.entity_type,
        monthlyAmount: fee.monthly_amount,
        monthlyCurrency: fee.monthly_currency,
        quarterlyAmount: fee.quarterly_amount,
        quarterlyCurrency: fee.quarterly_currency,
        halfYearlyAmount: fee.half_yearly_amount,
        halfYearlyCurrency: fee.half_yearly_currency,
        annualAmount: fee.annual_amount,
        annualCurrency: fee.annual_currency,
        description: fee.description,
        createdAt: fee.created_at || new Date().toISOString(),
        updatedAt: fee.updated_at || new Date().toISOString(),
        isUserCreated: fee.is_user_created || false
      })) || [];

      const loadedCurrencies: Currency[] = currenciesResult.data?.map(curr => ({
        id: curr.id,
        name: curr.name,
        code: curr.code || '',
        symbol: curr.symbol || '',
        country: curr.country || '',
        countryCode: curr.country_code || ''
      })) || [];

      const loadedCountries: Country[] = countriesResult.data?.map(country => ({
        id: country.id,
        name: country.name,
        code: country.code || ''
      })) || [];

      const loadedEntityTypes = entityTypesResult.data?.map(et => et.name) || [];

      if (isMountedRef.current) {
        setMembershipFees(loadedFees);
        setCurrencies(loadedCurrencies);
        setCountries(loadedCountries);
        setEntityTypes(loadedEntityTypes);
        setIsInitialized(true);
      }

      console.log('✅ CRUD TEST - Membership fee data loaded:', {
        fees: loadedFees.length,
        currencies: loadedCurrencies.length,
        countries: loadedCountries.length,
        entityTypes: loadedEntityTypes.length
      });

    } catch (error) {
      console.error('❌ Error loading membership fee data from Supabase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMembershipFee = async (fee: MembershipFeeEntry) => {
    try {
      // Get foreign key IDs first
      const [countryResult, orgTypeResult, entityTypeResult] = await Promise.all([
        supabase.from('master_countries').select('id').eq('name', fee.country).single(),
        supabase.from('master_organization_types').select('id').eq('name', fee.organizationType).single(),
        supabase.from('master_entity_types').select('id').eq('name', fee.entityType).single()
      ]);

      if (countryResult.error || orgTypeResult.error || entityTypeResult.error) {
        throw new Error('Failed to lookup foreign key IDs');
      }

      const { error } = await supabase
        .from('master_seeker_membership_fees')
        .upsert({
          id: fee.id,
          country: fee.country,
          country_id: countryResult.data.id,
          organization_type: fee.organizationType,
          organization_type_id: orgTypeResult.data.id,
          entity_type: fee.entityType,
          entity_type_id: entityTypeResult.data.id,
          monthly_amount: fee.monthlyAmount,
          monthly_currency: fee.monthlyCurrency,
          quarterly_amount: fee.quarterlyAmount,
          quarterly_currency: fee.quarterlyCurrency,
          half_yearly_amount: fee.halfYearlyAmount,
          half_yearly_currency: fee.halfYearlyCurrency,
          annual_amount: fee.annualAmount,
          annual_currency: fee.annualCurrency,
          description: fee.description,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      console.log('✅ CRUD TEST - Membership fee saved to Supabase:', fee.id);
      await loadAllData(); // Refresh data
      return true;
    } catch (error) {
      console.error('❌ Error saving membership fee to Supabase:', error);
      return false;
    }
  };

  const deleteMembershipFee = async (id: string) => {
    try {
      const { error } = await supabase
        .from('master_seeker_membership_fees')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      console.log('✅ CRUD TEST - Membership fee deleted from Supabase:', id);
      await loadAllData(); // Refresh data
      return true;
    } catch (error) {
      console.error('❌ Error deleting membership fee from Supabase:', error);
      return false;
    }
  };

  const setMembershipFeesSafely = (newFees: MembershipFeeEntry[] | ((prev: MembershipFeeEntry[]) => MembershipFeeEntry[])) => {
    if (typeof newFees === 'function') {
      setMembershipFees(prev => {
        const result = newFees(prev);
        return Array.isArray(result) ? result : prev;
      });
    } else {
      setMembershipFees(Array.isArray(newFees) ? newFees : []);
    }
  };

  useEffect(() => {
    loadAllData();
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const userCurrencies = currencies.filter(currency => 
    countries.some(country => country.name === currency.country)
  );

  const dataHealth = {
    currencies: {
      hasUserData: currencies.length > 0,
      count: currencies.length
    },
    membershipFees: {
      hasUserData: membershipFees.length > 0,
      count: membershipFees.length
    }
  };

  return {
    membershipFees,
    currencies,
    countries,
    entityTypes,
    userCurrencies,
    isLoading,
    isInitialized,
    setMembershipFeesSafely,
    saveMembershipFee,
    deleteMembershipFee,
    reloadMasterData: loadAllData,
    dataHealth
  };
};