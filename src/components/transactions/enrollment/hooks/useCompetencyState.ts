
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
    return Object.values(competencyData).some(domainGroup =>
      Object.values(domainGroup).some(category =>
        Object.values(category).some(rating => rating > 0)
      )
    );
  };

  const clearCompetencyData = () => {
    setCompetencyData({});
  };

  return {
    competencyData,
    updateCompetencyData,
    hasCompetencyRatings,
    clearCompetencyData
  };
};
