
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CompetencyAssessmentTab from './CompetencyAssessmentTab';

interface CoreCompetenciesTabProps {
  selectedIndustrySegments: string[];
  competencyData: any;
  updateCompetencyData: (industrySegment: string, domainGroup: string, category: string, subCategory: string, rating: number) => void;
}

const CoreCompetenciesTab: React.FC<CoreCompetenciesTabProps> = ({
  selectedIndustrySegments,
  competencyData,
  updateCompetencyData
}) => {
  if (selectedIndustrySegments.length === 0) {
    return (
      <TabsContent value="core-competencies" className="space-y-6">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Core Competencies Assessment</h3>
            <p className="text-muted-foreground">
              Please select at least one Industry Segment in Basic Information to enable competency ratings.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="core-competencies" className="space-y-6">
      {selectedIndustrySegments.map((segmentId, index) => (
        <div key={segmentId} className="space-y-4">
          {index > 0 && <Separator className="my-8" />}
          <CompetencyAssessmentTab
            selectedIndustrySegment={segmentId}
            competencyData={competencyData[segmentId] || {}}
            updateCompetencyData={(domainGroup, category, subCategory, rating) => 
              updateCompetencyData(segmentId, domainGroup, category, subCategory, rating)
            }
          />
        </div>
      ))}
    </TabsContent>
  );
};

export default CoreCompetenciesTab;
