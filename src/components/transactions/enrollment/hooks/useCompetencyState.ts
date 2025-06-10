
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
  // Load saved competency data synchronously during initialization
  const savedCompetencyData = loadSavedCompetencyData();
  const [competencyData, setCompetencyData] = useState<CompetencyData>(savedCompetencyData);

  // Auto-save competency data
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
    return hasRatingsInData(competencyData);
  };

  const clearCompetencyData = () => {
    setCompetencyData({});
    clearStoredCompetencyData();
  };

  const getRatedSubcategoriesCount = () => {
    return countRatedSubcategories(competencyData);
  };

  // Get competency data for a specific industry segment
  const getCompetencyDataForSegment = (industrySegment: string) => {
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
