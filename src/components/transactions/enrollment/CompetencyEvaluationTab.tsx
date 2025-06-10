
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CompetencyAssessmentTab from './CompetencyAssessmentTab';
import { FormData } from './types';
import { useCompetencyState } from './hooks/useCompetencyState';

interface CompetencyEvaluationTabProps {
  selectedIndustrySegments: string[];
  formData: FormData;
  onFormDataUpdate: (field: string, value: string | string[]) => void;
}

const CompetencyEvaluationTab: React.FC<CompetencyEvaluationTabProps> = ({
  selectedIndustrySegments,
  formData,
  onFormDataUpdate
}) => {
  const {
    competencyData,
    updateCompetencyData,
    hasCompetencyRatings,
    getRatedSubcategoriesCount,
    getCompetencySummary
  } = useCompetencyState();

  const handleCompetencyUpdate = (
    domainGroup: string,
    category: string,
    subCategory: string,
    rating: number
  ) => {
    // Use the first selected industry segment for competency assessment
    const primaryIndustrySegment = selectedIndustrySegments[0];
    if (primaryIndustrySegment) {
      updateCompetencyData(primaryIndustrySegment, domainGroup, category, subCategory, rating);
    }
  };

  if (selectedIndustrySegments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Please select at least one industry segment in the Basic Information tab to access competency evaluation.
          </p>
        </CardContent>
      </Card>
    );
  }

  const primaryIndustrySegment = selectedIndustrySegments[0];
  const competencySummary = getCompetencySummary();
  const ratedCount = getRatedSubcategoriesCount();

  return (
    <div className="space-y-6">
      {/* Header with selected industry segments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Competency Evaluation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Evaluate your competency levels for the selected industry segment(s):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedIndustrySegments.map((segmentId, index) => (
                <Badge 
                  key={segmentId} 
                  variant={index === 0 ? "default" : "secondary"}
                  className="text-xs"
                >
                  {segmentId}
                  {index === 0 && " (Primary)"}
                </Badge>
              ))}
            </div>
            {selectedIndustrySegments.length > 1 && (
              <p className="text-xs text-muted-foreground mt-2">
                Competency evaluation will be based on your primary industry segment.
              </p>
            )}
          </div>

          {/* Competency Summary */}
          {hasCompetencyRatings() && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Assessment Progress</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                <span>Total Rated: <strong>{ratedCount}</strong></span>
                <span>No Competency: <strong>{competencySummary.noCompetency}</strong></span>
                <span>Basic: <strong>{competencySummary.basic}</strong></span>
                <span>Advanced: <strong>{competencySummary.advanced}</strong></span>
                <span>Guru: <strong>{competencySummary.guru}</strong></span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competency Assessment Component */}
      <CompetencyAssessmentTab
        selectedIndustrySegment={primaryIndustrySegment}
        competencyData={competencyData[primaryIndustrySegment] || {}}
        updateCompetencyData={handleCompetencyUpdate}
      />
    </div>
  );
};

export default CompetencyEvaluationTab;
