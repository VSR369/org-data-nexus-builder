
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import CompetencyAssessmentTab from './CompetencyAssessmentTab';

interface CoreCompetenciesTabProps {
  selectedIndustrySegment: string;
  competencyData: any;
  updateCompetencyData: (domainGroup: string, category: string, subCategory: string, rating: number) => void;
}

const CoreCompetenciesTab: React.FC<CoreCompetenciesTabProps> = ({
  selectedIndustrySegment,
  competencyData,
  updateCompetencyData
}) => {
  return (
    <TabsContent value="core-competencies" className="space-y-6">
      <CompetencyAssessmentTab
        selectedIndustrySegment={selectedIndustrySegment}
        competencyData={competencyData}
        updateCompetencyData={updateCompetencyData}
      />
    </TabsContent>
  );
};

export default CoreCompetenciesTab;
