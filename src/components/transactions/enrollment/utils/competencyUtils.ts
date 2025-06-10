
import { CompetencyData, CompetencySummary } from '../types/competencyTypes';
import { COMPETENCY_STORAGE_KEY, RATING_THRESHOLDS } from '../constants/competencyConstants';

// Function to load saved competency data synchronously
export const loadSavedCompetencyData = (): CompetencyData => {
  try {
    const savedData = localStorage.getItem(COMPETENCY_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log('Loading saved competency data synchronously:', parsedData);
      return parsedData;
    }
  } catch (error) {
    console.error('Error loading saved competency data:', error);
  }
  return {};
};

// Function to save competency data to localStorage
export const saveCompetencyData = (data: CompetencyData): void => {
  const hasData = Object.keys(data).length > 0;
  
  if (hasData) {
    localStorage.setItem(COMPETENCY_STORAGE_KEY, JSON.stringify(data));
    console.log('Auto-saved competency data:', data);
  }
};

// Function to clear competency data from localStorage
export const clearStoredCompetencyData = (): void => {
  localStorage.removeItem(COMPETENCY_STORAGE_KEY);
};

// Check if there are any ratings in the competency data
export const hasRatingsInData = (data: CompetencyData): boolean => {
  const hasRatings = Object.values(data).some(industrySegmentData =>
    Object.values(industrySegmentData).some(domainGroup =>
      Object.values(domainGroup).some(category =>
        Object.values(category).some(rating => rating > 0)
      )
    )
  );
  console.log('Checking competency ratings:', hasRatings, data);
  return hasRatings;
};

// Count total number of subcategories that have been rated
export const countRatedSubcategories = (data: CompetencyData): number => {
  let count = 0;
  Object.values(data).forEach(industrySegmentData =>
    Object.values(industrySegmentData).forEach(domainGroup =>
      Object.values(domainGroup).forEach(category =>
        Object.values(category).forEach(rating => {
          if (rating > 0) count++;
        })
      )
    )
  );
  return count;
};

// Get competency summary by rating levels for all segments
export const getCompetencySummaryFromData = (data: CompetencyData): CompetencySummary => {
  const summary: CompetencySummary = {
    noCompetency: 0,
    basic: 0,
    advanced: 0,
    guru: 0
  };

  Object.values(data).forEach(industrySegmentData =>
    Object.values(industrySegmentData).forEach(domainGroup =>
      Object.values(domainGroup).forEach(category =>
        Object.values(category).forEach(rating => {
          if (rating >= 0 && rating < RATING_THRESHOLDS.NO_COMPETENCY_MAX) {
            summary.noCompetency++;
          } else if (rating >= RATING_THRESHOLDS.BASIC_MIN && rating < RATING_THRESHOLDS.BASIC_MAX) {
            summary.basic++;
          } else if (rating >= RATING_THRESHOLDS.ADVANCED_MIN && rating < RATING_THRESHOLDS.ADVANCED_MAX) {
            summary.advanced++;
          } else if (rating >= RATING_THRESHOLDS.GURU_MIN && rating <= RATING_THRESHOLDS.GURU_MAX) {
            summary.guru++;
          }
        })
      )
    )
  );

  return summary;
};
