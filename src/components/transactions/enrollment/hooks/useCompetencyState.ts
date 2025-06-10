
import { useState, useEffect } from 'react';
import { CompetencyData } from '../types/competencyTypes';
import { 
  loadSavedCompetencyData, 
  saveCompetencyData, 
  clearStoredCompetencyData,
  hasRatingsInData,
  countRatedSubcategories,
  getCompetencySummaryFromData
} from '../utils/competencyUtils';

export const useCompetencyState = () => {
  // Load saved competency data with automatic validation and cleanup
  const savedCompetencyData = loadSavedCompetencyData();
  const [competencyData, setCompetencyData] = useState<CompetencyData>(savedCompetencyData);

  // Auto-save competency data with validation
  useEffect(() => {
    saveCompetencyData(competencyData);
  }, [competencyData]);

  const updateCompetencyData = (
    industrySegment: string,
    domainGroup: string, 
    category: string, 
    subCategory: string, 
    rating: number
  ) => {
    console.log('🔄 Updating competency data:', { industrySegment, domainGroup, category, subCategory, rating });
    
    // Validate that industrySegment is a valid ID (numeric string)
    if (!/^\d+$/.test(industrySegment)) {
      console.error('❌ Invalid industry segment ID:', industrySegment);
      return;
    }
    
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
    return hasRatingsInData(competencyData);
  };

  const clearCompetencyData = () => {
    console.log('🗑️ Clearing all competency data...');
    setCompetencyData({});
    clearStoredCompetencyData();
  };

  const getRatedSubcategoriesCount = () => {
    return countRatedSubcategories(competencyData);
  };

  // Get competency data for a specific industry segment with validation
  const getCompetencyDataForSegment = (industrySegment: string) => {
    // Validate that industrySegment is a valid ID
    if (!/^\d+$/.test(industrySegment)) {
      console.warn('⚠️ Invalid industry segment ID requested:', industrySegment);
      return {};
    }
    
    return competencyData[industrySegment] || {};
  };

  const getCompetencySummary = () => {
    return getCompetencySummaryFromData(competencyData);
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
