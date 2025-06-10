
import { useState } from 'react';

interface CompetencyData {
  [domainGroup: string]: {
    [category: string]: {
      [subCategory: string]: number;
    };
  };
}

export const useCompetencyState = () => {
  const [competencyData, setCompetencyData] = useState<CompetencyData>({});

  const updateCompetencyData = (
    domainGroup: string, 
    category: string, 
    subCategory: string, 
    rating: number
  ) => {
    console.log('Updating competency data:', { domainGroup, category, subCategory, rating });
    setCompetencyData(prev => ({
      ...prev,
      [domainGroup]: {
        ...prev[domainGroup],
        [category]: {
          ...prev[domainGroup]?.[category],
          [subCategory]: rating
        }
      }
    }));
  };

  const hasCompetencyRatings = () => {
    const hasRatings = Object.values(competencyData).some(domainGroup =>
      Object.values(domainGroup).some(category =>
        Object.values(category).some(rating => rating > 0)
      )
    );
    console.log('Checking competency ratings:', hasRatings, competencyData);
    return hasRatings;
  };

  const clearCompetencyData = () => {
    setCompetencyData({});
  };

  // Get total number of subcategories that have been rated
  const getRatedSubcategoriesCount = () => {
    let count = 0;
    Object.values(competencyData).forEach(domainGroup =>
      Object.values(domainGroup).forEach(category =>
        Object.values(category).forEach(rating => {
          if (rating > 0) count++;
        })
      )
    );
    return count;
  };

  // Get competency summary by rating levels
  const getCompetencySummary = () => {
    const summary = {
      noCompetency: 0,
      basic: 0,
      advanced: 0,
      guru: 0
    };

    Object.values(competencyData).forEach(domainGroup =>
      Object.values(domainGroup).forEach(category =>
        Object.values(category).forEach(rating => {
          if (rating >= 0 && rating < 2.5) summary.noCompetency++;
          else if (rating >= 2.5 && rating < 5) summary.basic++;
          else if (rating >= 5 && rating < 7.5) summary.advanced++;
          else if (rating >= 7.5 && rating <= 10) summary.guru++;
        })
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
    getCompetencySummary
  };
};
