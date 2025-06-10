
import React from 'react';
import DomainGroupCard from './components/DomainGroupCard';
import EmptyCompetencyState from './components/EmptyCompetencyState';
import { useCompetencyAssessment } from './hooks/useCompetencyAssessment';

interface CompetencyData {
  [domainGroup: string]: {
    [category: string]: {
      [subCategory: string]: number;
    };
  };
}

interface CompetencyAssessmentTabProps {
  selectedIndustrySegment: string;
  competencyData: CompetencyData;
  updateCompetencyData: (domainGroup: string, category: string, subCategory: string, rating: number) => void;
}

const CompetencyAssessmentTab: React.FC<CompetencyAssessmentTabProps> = ({
  selectedIndustrySegment,
  competencyData,
  updateCompetencyData
}) => {
  const {
    relevantDomainGroups,
    expandedGroups,
    expandedCategories,
    toggleGroupExpansion,
    toggleCategoryExpansion
  } = useCompetencyAssessment(selectedIndustrySegment);

  console.log('CompetencyAssessmentTab - selectedIndustrySegment:', selectedIndustrySegment);
  console.log('CompetencyAssessmentTab - relevantDomainGroups:', relevantDomainGroups);

  const hasSelectedSegment = !!selectedIndustrySegment;
  const hasDomainGroups = relevantDomainGroups.length > 0;

  // Show empty state if no segment selected or no domain groups
  if (!hasSelectedSegment || !hasDomainGroups) {
    return (
      <EmptyCompetencyState 
        hasSelectedSegment={hasSelectedSegment}
        hasDomainGroups={hasDomainGroups}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {relevantDomainGroups.map((domainGroup) => (
          <DomainGroupCard
            key={domainGroup.id}
            domainGroup={domainGroup}
            isExpanded={expandedGroups.has(domainGroup.id)}
            onToggleExpansion={() => toggleGroupExpansion(domainGroup.id)}
            expandedCategories={expandedCategories}
            onToggleCategoryExpansion={toggleCategoryExpansion}
            competencyData={competencyData}
            updateCompetencyData={updateCompetencyData}
          />
        ))}
      </div>
    </div>
  );
};

export default CompetencyAssessmentTab;
