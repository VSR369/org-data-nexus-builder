
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import CompetencyAssessmentTab from './CompetencyAssessmentTab';
import { FormData } from './types';
import { useCompetencyState } from './hooks/useCompetencyState';

interface IndustrySegment {
  id: string;
  industrySegment: string;
  description: string;
}

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
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [activeSegmentTab, setActiveSegmentTab] = useState<string>('');

  const {
    competencyData,
    updateCompetencyData,
    hasCompetencyRatings,
    getRatedSubcategoriesCount,
    getCompetencySummary
  } = useCompetencyState();

  // Load industry segments from master data
  useEffect(() => {
    const loadIndustrySegments = () => {
      try {
        const savedData = localStorage.getItem('master_data_industry_segments');
        if (savedData) {
          const data = JSON.parse(savedData);
          
          if (data && data.industrySegments && Array.isArray(data.industrySegments)) {
            console.log('Loaded industry segments from master data:', data.industrySegments);
            setIndustrySegments(data.industrySegments);
          } else {
            console.log('Invalid industry segments data structure');
            setIndustrySegments([]);
          }
        } else {
          console.log('No industry segments found in master data');
          setIndustrySegments([]);
        }
      } catch (error) {
        console.error('Error loading industry segments:', error);
        setIndustrySegments([]);
      }
    };

    loadIndustrySegments();
  }, []);

  // Set default active tab when segments are available
  useEffect(() => {
    if (selectedIndustrySegments.length > 0 && !activeSegmentTab) {
      setActiveSegmentTab(selectedIndustrySegments[0]);
    }
  }, [selectedIndustrySegments, activeSegmentTab]);

  const handleCompetencyUpdate = (
    domainGroup: string,
    category: string,
    subCategory: string,
    rating: number
  ) => {
    if (activeSegmentTab) {
      updateCompetencyData(activeSegmentTab, domainGroup, category, subCategory, rating);
    }
  };

  const getIndustrySegmentName = (segmentId: string) => {
    const segment = industrySegments.find(s => s.id === segmentId);
    return segment ? segment.industrySegment : segmentId;
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

  const competencySummary = getCompetencySummary();
  const ratedCount = getRatedSubcategoriesCount();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Competency Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Evaluate your competency levels for each selected industry segment.
          </p>

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

      {/* Industry Segment Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeSegmentTab} onValueChange={setActiveSegmentTab} className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${selectedIndustrySegments.length}, 1fr)` }}>
              {selectedIndustrySegments.map((segmentId) => (
                <TabsTrigger key={segmentId} value={segmentId} className="text-sm">
                  {getIndustrySegmentName(segmentId)}
                </TabsTrigger>
              ))}
            </TabsList>

            {selectedIndustrySegments.map((segmentId) => (
              <TabsContent key={segmentId} value={segmentId} className="mt-6">
                <div className="mb-4">
                  <Badge variant="outline" className="text-xs">
                    Industry Segment: {getIndustrySegmentName(segmentId)}
                  </Badge>
                </div>
                
                <CompetencyAssessmentTab
                  selectedIndustrySegment={segmentId}
                  competencyData={competencyData[segmentId] || {}}
                  updateCompetencyData={handleCompetencyUpdate}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetencyEvaluationTab;
