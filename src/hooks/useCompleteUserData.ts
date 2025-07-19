import { useState, useEffect } from 'react';
import { userDataManager } from '@/utils/storage/UserDataManager';

// Helper function to get industry segment name from ID
const getIndustrySegmentDisplayName = (industrySegmentValue: any): string => {
  if (!industrySegmentValue) return '';
  
  // If it's already a string name, return it directly
  if (typeof industrySegmentValue === 'string' && !industrySegmentValue.startsWith('is_')) {
    return industrySegmentValue;
  }
  
  // Try to get from registration data first (most accurate)
  try {
    const orgData = JSON.parse(localStorage.getItem('solution_seeker_registration_data') || '{}');
    if (orgData.industrySegment && typeof orgData.industrySegment === 'string') {
      return orgData.industrySegment;
    }
  } catch (error) {
    console.error('Error loading registration data for industry segment:', error);
  }
  
  // Try to load industry segments from master data as fallback
  try {
    const savedData = localStorage.getItem('master_data_industry_segments');
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data && data.industrySegments && Array.isArray(data.industrySegments)) {
        const segment = data.industrySegments.find((seg: any) => 
          seg.id === industrySegmentValue || seg.industrySegment === industrySegmentValue
        );
        if (segment) {
          return segment.industrySegment;
        }
      }
    }
  } catch (error) {
    console.error('Error loading industry segments for display:', error);
  }
  
  // Fallback: return the original value
  return String(industrySegmentValue);
};

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
          const resolvedIndustrySegment = getIndustrySegmentDisplayName(foundUser.industrySegment);
          
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