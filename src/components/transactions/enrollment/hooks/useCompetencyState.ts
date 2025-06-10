
import { useState, useEffect } from 'react';

interface CompetencyData {
  [industrySegment: string]: {
    [domainGroup: string]: {
      [category: string]: {
        [subCategory: string]: number;
      };
    };
  };
}

const COMPETENCY_STORAGE_KEY = 'solution-provider-competency-draft';

// Function to load saved competency data synchronously
const loadSavedCompetencyData = () => {
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

export const useCompetencyState = () => {
  // Load saved competency data synchronously during initialization
  const savedCompetencyData = loadSavedCompetencyData();
  const [competencyData, setCompetencyData] = useState<CompetencyData>(savedCompetencyData);

  // Auto-save competency data
  useEffect(() => {
    const hasData = Object.keys(competencyData).length > 0;
    
    if (hasData) {
      localStorage.setItem(COMPETENCY_STORAGE_KEY, JSON.stringify(competencyData));
      console.log('Auto-saved competency data:', competencyData);
    }
  }, [competencyData]);

  const updateCompetencyData = (
    industrySegment: string,
    domainGroup: string, 
    category: string, 
    subCategory: string, 
    rating: number
  ) => {
    console.log('Updating competency data:', { industrySegment, domainGroup, category, subCategory, rating });
    setCompetencyData(prev => ({
      ...prev,
      [industrySegment]: {
        ...prev[industrySegment],
        [domainGroup]: {
          ...prev[industrySegment]?.[domainGroup],
          [category]: {
            ...prev[industrySegment]?.[domainGroup]?.[category],
            [subCategory]: rating
          }
        }
      }
    }));
  };

  const hasCompetencyRatings = () => {
    const hasRatings = Object.values(competencyData).some(industrySegmentData =>
      Object.values(industrySegmentData).some(domainGroup =>
        Object.values(domainGroup).some(category =>
          Object.values(category).some(rating => rating > 0)
        )
      )
    );
    console.log('Checking competency ratings:', hasRatings, competencyData);
    return hasRatings;
  };

  const clearCompetencyData = () => {
    setCompetencyData({});
    localStorage.removeItem(COMPETENCY_STORAGE_KEY);
  };

  // Get total number of subcategories that have been rated
  const getRatedSubcategoriesCount = () => {
    let count = 0;
    Object.values(competencyData).forEach(industrySegmentData =>
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

  // Get competency data for a specific industry segment
  const getCompetencyDataForSegment = (industrySegment: string) => {
    return competencyData[industrySegment] || {};
  };

  // Get competency summary by rating levels for all segments
  const getCompetencySummary = () => {
    const summary = {
      noCompetency: 0,
      basic: 0,
      advanced: 0,
      guru: 0
    };

    Object.values(competencyData).forEach(industrySegmentData =>
      Object.values(industrySegmentData).forEach(domainGroup =>
        Object.values(domainGroup).forEach(category =>
          Object.values(category).forEach(rating => {
            if (rating >= 0 && rating < 2.5) summary.noCompetency++;
            else if (rating >= 2.5 && rating < 5) summary.basic++;
            else if (rating >= 5 && rating < 7.5) summary.advanced++;
            else if (rating >= 7.5 && rating <= 10) summary.guru++;
          })
        )
      )
    );

    return summary;
  };

  return {
    competencyData,
    updateCompetencyData,
    hasCompetencyRatings,
    clearCompetencyData,
    getRatedSubcategoriesCount,
    getCompetencySummary,
    getCompetencyDataForSegment
  };
};
