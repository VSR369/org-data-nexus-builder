
import { CompetencyData, CompetencySummary } from '../types/competencyTypes';
import { COMPETENCY_STORAGE_KEY, RATING_THRESHOLDS } from '../constants/competencyConstants';

// Function to validate if a key looks like an industry segment ID (should be numeric)
const isValidIndustrySegmentId = (key: string): boolean => {
  // Industry segment IDs should be numeric strings (like "1", "2", etc.)
  return /^\d+$/.test(key);
};

// Function to validate and clean competency data structure
const validateAndCleanCompetencyData = (data: any): CompetencyData => {
  console.log('🔍 Validating and cleaning competency data:', data);
  
  if (!data || typeof data !== 'object') {
    console.log('❌ Invalid data structure, returning empty object');
    return {};
  }

  const cleanedData: CompetencyData = {};
  
  // Only keep entries that have valid industry segment IDs as keys
  Object.keys(data).forEach(key => {
    if (isValidIndustrySegmentId(key)) {
      const segmentData = data[key];
      
      // Validate that the segment data has the correct nested structure
      if (segmentData && typeof segmentData === 'object') {
        let hasValidStructure = true;
        
        // Check if this segment data follows the expected structure:
        // industrySegment -> domainGroup -> category -> subCategory -> rating
        try {
          Object.values(segmentData).forEach((domainGroup: any) => {
            if (!domainGroup || typeof domainGroup !== 'object') {
              hasValidStructure = false;
              return;
            }
            
            Object.values(domainGroup).forEach((category: any) => {
              if (!category || typeof category !== 'object') {
                hasValidStructure = false;
                return;
              }
              
              Object.values(category).forEach((rating: any) => {
                if (typeof rating !== 'number') {
                  hasValidStructure = false;
                  return;
                }
              });
            });
          });
        } catch (error) {
          console.warn(`⚠️ Invalid structure in segment ${key}:`, error);
          hasValidStructure = false;
        }
        
        if (hasValidStructure) {
          cleanedData[key] = segmentData;
          console.log(`✅ Keeping valid segment data for ID: ${key}`);
        } else {
          console.log(`❌ Removing invalid segment data for ID: ${key}`);
        }
      } else {
        console.log(`❌ Invalid segment data structure for ID: ${key}`);
      }
    } else {
      console.log(`❌ Removing invalid key (not a valid industry segment ID): ${key}`);
    }
  });
  
  console.log('✅ Cleaned competency data:', cleanedData);
  return cleanedData;
};

// Function to load saved competency data with validation and cleanup
export const loadSavedCompetencyData = (): CompetencyData => {
  try {
    const savedData = localStorage.getItem(COMPETENCY_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log('📦 Raw competency data from localStorage:', parsedData);
      
      // Validate and clean the data
      const cleanedData = validateAndCleanCompetencyData(parsedData);
      
      // If the cleaned data is different from the original, save the cleaned version
      const originalKeys = Object.keys(parsedData || {});
      const cleanedKeys = Object.keys(cleanedData);
      
      if (originalKeys.length !== cleanedKeys.length || 
          !originalKeys.every(key => cleanedKeys.includes(key))) {
        console.log('🔧 Data was cleaned, saving the cleaned version...');
        saveCompetencyData(cleanedData);
      }
      
      return cleanedData;
    }
  } catch (error) {
    console.error('❌ Error loading saved competency data:', error);
    // Clear corrupted data
    clearStoredCompetencyData();
  }
  return {};
};

// Function to save competency data to localStorage
export const saveCompetencyData = (data: CompetencyData): void => {
  // Validate data before saving
  const validatedData = validateAndCleanCompetencyData(data);
  
  const hasData = Object.keys(validatedData).length > 0;
  
  if (hasData) {
    localStorage.setItem(COMPETENCY_STORAGE_KEY, JSON.stringify(validatedData));
    console.log('💾 Auto-saved validated competency data:', validatedData);
  }
};

// Function to clear competency data from localStorage
export const clearStoredCompetencyData = (): void => {
  localStorage.removeItem(COMPETENCY_STORAGE_KEY);
  console.log('🗑️ Cleared competency data from localStorage');
};

// Check if there are any ratings in the competency data (with validation)
export const hasRatingsInData = (data: CompetencyData): boolean => {
  // First validate the data structure
  const validatedData = validateAndCleanCompetencyData(data);
  
  const hasRatings = Object.values(validatedData).some(industrySegmentData =>
    Object.values(industrySegmentData).some(domainGroup =>
      Object.values(domainGroup).some(category =>
        Object.values(category).some(rating => rating > 0)
      )
    )
  );
  console.log('🔍 Checking competency ratings in validated data:', hasRatings, validatedData);
  return hasRatings;
};

// Count total number of subcategories that have been rated (with validation)
export const countRatedSubcategories = (data: CompetencyData): number => {
  // First validate the data structure
  const validatedData = validateAndCleanCompetencyData(data);
  
  let count = 0;
  Object.values(validatedData).forEach(industrySegmentData =>
    Object.values(industrySegmentData).forEach(domainGroup =>
      Object.values(domainGroup).forEach(category =>
        Object.values(category).forEach(rating => {
          if (rating > 0) count++;
        })
      )
    )
  );
  console.log('📊 Counted rated subcategories in validated data:', count);
  return count;
};

// Get competency summary by rating levels for all segments (with validation)
export const getCompetencySummaryFromData = (data: CompetencyData): CompetencySummary => {
  // First validate the data structure
  const validatedData = validateAndCleanCompetencyData(data);
  
  const summary: CompetencySummary = {
    noCompetency: 0,
    basic: 0,
    advanced: 0,
    guru: 0
  };

  Object.values(validatedData).forEach(industrySegmentData =>
    Object.values(industrySegmentData).forEach(domainGroup =>
      Object.values(domainGroup).forEach(category =>
        Object.values(category).forEach(rating => {
          if (rating === 0 || rating <= RATING_THRESHOLDS.NO_COMPETENCY_MAX) {
            summary.noCompetency++;
          } else if (rating >= RATING_THRESHOLDS.BASIC_MIN && rating <= RATING_THRESHOLDS.BASIC_MAX) {
            summary.basic++;
          } else if (rating >= RATING_THRESHOLDS.ADVANCED_MIN && rating <= RATING_THRESHOLDS.ADVANCED_MAX) {
            summary.advanced++;
          } else if (rating >= RATING_THRESHOLDS.GURU_MIN && rating <= RATING_THRESHOLDS.GURU_MAX) {
            summary.guru++;
          }
        })
      )
    )
  );

  console.log('📈 Generated competency summary from validated data:', summary);
  return summary;
};
