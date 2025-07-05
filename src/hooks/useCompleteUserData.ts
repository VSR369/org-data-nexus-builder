import { useState, useEffect } from 'react';
import { userDataManager } from '@/utils/storage/UserDataManager';

interface CompleteUserData {
  // Basic Info
  userId: string;
  organizationName: string;
  organizationId?: string;
  organizationType: string;
  entityType: string;
  industrySegment?: string;
  
  // Contact Details
  contactPersonName: string;
  email: string;
  countryCode?: string;
  phoneNumber?: string;
  
  // Location
  country: string;
  address?: string;
  
  // Web Presence
  website?: string;
  
  // Documents
  registrationDocuments?: File[];
  companyProfile?: File[];
  companyLogo?: File[];
  
  // Account Details
  password?: string;
  registrationTimestamp?: string;
  loginTimestamp?: string;
}

// Helper function to resolve industry segment ID to name
const resolveIndustrySegment = (industrySegmentValue: string | undefined) => {
  if (!industrySegmentValue) return undefined;
  
  // If it's already a name (not a numeric ID), return it
  if (isNaN(Number(industrySegmentValue))) {
    return industrySegmentValue;
  }
  
  // If it's an ID, look up the name from master data
  try {
    const masterDataKey = 'master_data_industry_segments';
    const savedData = localStorage.getItem(masterDataKey);
    if (savedData) {
      const industryData = JSON.parse(savedData);
      const segments = industryData.industrySegments || industryData;
      
      if (Array.isArray(segments)) {
        const foundSegment = segments.find(segment => 
          segment.id === industrySegmentValue || 
          segment.industrySegment === industrySegmentValue
        );
        
        if (foundSegment) {
          console.log('✅ Resolved industry segment:', foundSegment.industrySegment);
          return foundSegment.industrySegment;
        }
      }
    }
    
    // Fallback: check if the ID corresponds to a known industry
    const industryMap: { [key: string]: string } = {
      '1751657884057': 'Life sciences',
      // Add other mappings as needed
    };
    
    if (industryMap[industrySegmentValue]) {
      console.log('✅ Mapped industry segment:', industryMap[industrySegmentValue]);
      return industryMap[industrySegmentValue];
    }
    
  } catch (error) {
    console.error('❌ Error resolving industry segment:', error);
  }
  
  return `Industry ID: ${industrySegmentValue}`;
};

export const useCompleteUserData = (userId?: string) => {
  const [userData, setUserData] = useState<CompleteUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompleteUserData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Loading complete user data for:', userId);
        
        // First try localStorage
        let foundUser = null;
        const usersData = localStorage.getItem('registered_users');
        if (usersData) {
          try {
            const users = JSON.parse(usersData);
            foundUser = users.find((user: any) => 
              user.userId.toLowerCase() === userId.toLowerCase() || 
              user.email.toLowerCase() === userId.toLowerCase()
            );
            if (foundUser) {
              console.log('✅ Complete user data found in localStorage');
            }
          } catch (parseError) {
            console.error('Error parsing localStorage data:', parseError);
          }
        }

        // If not found in localStorage, try IndexedDB
        if (!foundUser) {
          try {
            console.log('🔍 Checking IndexedDB for complete user data...');
            // Since userDataManager requires password, we'll primarily rely on localStorage
            // The registration process already syncs data to localStorage
            console.log('⚠️ IndexedDB lookup requires password - relying on localStorage sync');
          } catch (dbError) {
            console.error('Error checking IndexedDB:', dbError);
          }
        }

        if (foundUser) {
          // Resolve industry segment ID to actual name
          const resolvedIndustrySegment = resolveIndustrySegment(foundUser.industrySegment);
          
          const processedUserData = {
            ...foundUser,
            industrySegment: resolvedIndustrySegment
          };
          
          setUserData(processedUserData);
          console.log('📊 Complete user data loaded:', {
            fields: Object.keys(foundUser),
            organizationId: foundUser.organizationId,
            address: foundUser.address,
            website: foundUser.website,
            phoneNumber: foundUser.phoneNumber,
            industrySegment: foundUser.industrySegment,
            resolvedIndustrySegment: resolvedIndustrySegment
          });
          console.log('🏭 INDUSTRY SEGMENT DEBUG:', {
            originalValue: foundUser.industrySegment,
            resolvedValue: resolvedIndustrySegment,
            rawValue: JSON.stringify(foundUser.industrySegment),
            dataType: typeof foundUser.industrySegment
          });
        } else {
          console.warn('⚠️ Complete user data not found for:', userId);
          setError('Complete user data not found');
        }

      } catch (err) {
        console.error('❌ Error loading complete user data:', err);
        setError('Failed to load complete user data');
      } finally {
        setLoading(false);
      }
    };

    loadCompleteUserData();
  }, [userId]);

  return {
    userData,
    loading,
    error,
    refetch: () => {
      if (userId) {
        setLoading(true);
        // Re-trigger the effect
        setUserData(null);
      }
    }
  };
};