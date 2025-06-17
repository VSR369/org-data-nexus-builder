import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

// Competency level thresholds
const RATING_THRESHOLDS = {
  NO_COMPETENCY: { min: 0, max: 0.9, label: 'No Competency', color: 'bg-gray-100 text-gray-800' },
  BASIC: { min: 1, max: 2.9, label: 'Basic', color: 'bg-blue-100 text-blue-800' },
  ADVANCED: { min: 3, max: 4.9, label: 'Advanced', color: 'bg-green-100 text-green-800' },
  GURU: { min: 5, max: 5, label: 'Guru', color: 'bg-purple-100 text-purple-800' }
};

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
    getCompetencySummary,
    getCompetencyDataForSegment
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
      console.log('Set active segment tab to:', selectedIndustrySegments[0]);
    }
  }, [selectedIndustrySegments, activeSegmentTab]);

  const handleCompetencyUpdate = (
    domainGroup: string,
    category: string,
    subCategory: string,
    rating: number
  ) => {
    if (activeSegmentTab) {
      console.log('CompetencyEvaluationTab - updating competency for segment:', activeSegmentTab);
      updateCompetencyData(activeSegmentTab, domainGroup, category, subCategory, rating);
    }
  };

  const getIndustrySegmentName = (segmentId: string) => {
    const segment = industrySegments.find(s => s.id === segmentId);
    return segment ? segment.industrySegment : segmentId;
  };

  // Calculate average rating for a category
  const getCategoryAverage = (segmentId: string, domainGroupName: string, categoryName: string) => {
    const segmentData = competencyData[segmentId];
    if (!segmentData || !segmentData[domainGroupName] || !segmentData[domainGroupName][categoryName]) {
      return 0;
    }

    const subCategoryRatings = Object.values(segmentData[domainGroupName][categoryName]);
    const validRatings = subCategoryRatings.filter(rating => rating > 0);
    
    if (validRatings.length === 0) return 0;
    
    const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
    return sum / validRatings.length;
  };

  // Calculate average rating for a domain group
  const getDomainGroupAverage = (segmentId: string, domainGroupName: string) => {
    const segmentData = competencyData[segmentId];
    if (!segmentData || !segmentData[domainGroupName]) {
      return 0;
    }

    const categories = Object.keys(segmentData[domainGroupName]);
    let totalSum = 0;
    let totalCount = 0;

    categories.forEach(categoryName => {
      const subCategoryRatings = Object.values(segmentData[domainGroupName][categoryName]);
      const validRatings = subCategoryRatings.filter(rating => rating > 0);
      
      if (validRatings.length > 0) {
        totalSum += validRatings.reduce((acc, rating) => acc + rating, 0);
        totalCount += validRatings.length;
      }
    });

    return totalCount > 0 ? totalSum / totalCount : 0;
  };

  // Get competency level from rating
  const getCompetencyLevel = (rating: number) => {
    if (rating === 0) {
      return RATING_THRESHOLDS.NO_COMPETENCY;
    } else if (rating >= RATING_THRESHOLDS.GURU.min && rating <= RATING_THRESHOLDS.GURU.max) {
      return RATING_THRESHOLDS.GURU;
    } else if (rating >= RATING_THRESHOLDS.ADVANCED.min && rating <= RATING_THRESHOLDS.ADVANCED.max) {
      return RATING_THRESHOLDS.ADVANCED;
    } else if (rating >= RATING_THRESHOLDS.BASIC.min && rating <= RATING_THRESHOLDS.BASIC.max) {
      return RATING_THRESHOLDS.BASIC;
    } else {
      return RATING_THRESHOLDS.NO_COMPETENCY;
    }
  };

  // Get category distribution for a domain group
  const getCategoryDistribution = (segmentId: string, domainGroupName: string) => {
    const segmentData = competencyData[segmentId];
    if (!segmentData || !segmentData[domainGroupName]) {
      return { noCompetency: 0, basic: 0, advanced: 0, guru: 0, total: 0 };
    }

    const categories = Object.keys(segmentData[domainGroupName]);
    const distribution = { noCompetency: 0, basic: 0, advanced: 0, guru: 0, total: 0 };

    categories.forEach(categoryName => {
      const average = getCategoryAverage(segmentId, domainGroupName, categoryName);
      if (average > 0) {
        const level = getCompetencyLevel(average);
        distribution.total++;
        
        if (level.label === 'No Competency') distribution.noCompetency++;
        else if (level.label === 'Basic') distribution.basic++;
        else if (level.label === 'Advanced') distribution.advanced++;
        else if (level.label === 'Guru') distribution.guru++;
      }
    });

    return distribution;
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

  console.log('CompetencyEvaluationTab - activeSegmentTab:', activeSegmentTab);
  console.log('CompetencyEvaluationTab - competencyData:', competencyData);
  console.log('CompetencyEvaluationTab - selectedIndustrySegments:', selectedIndustrySegments);

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
                
                {/* Domain Group Averages Summary */}
                {hasCompetencyRatings() && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-base">Domain Groups Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(getCompetencyDataForSegment(segmentId)).map((domainGroupName) => {
                        const average = getDomainGroupAverage(segmentId, domainGroupName);
                        const level = getCompetencyLevel(average);
                        const distribution = getCategoryDistribution(segmentId, domainGroupName);
                        
                        return (
                          <div key={domainGroupName} className="mb-4 p-4 border rounded-lg bg-muted/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{domainGroupName}</h4>
                              <div className="flex items-center gap-2">
                                <Badge className={level.color}>
                                  {level.label}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Progress bar for domain group average */}
                            <div className="mb-3">
                              <Progress value={(average / 5) * 100} className="h-2" />
                            </div>
                            
                            {/* Category distribution */}
                            {distribution.total > 0 && (
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                  No Comp: {distribution.noCompetency}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Basic: {distribution.basic}
                                </span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Advanced: {distribution.advanced}
                                </span>
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  Guru: {distribution.guru}
                                </span>
                                <span className="text-muted-foreground">
                                  Total Categories: {distribution.total}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}
                
                <CompetencyAssessmentTab
                  selectedIndustrySegment={segmentId}
                  competencyData={getCompetencyDataForSegment(segmentId)}
                  updateCompetencyData={handleCompetencyUpdate}
                  getCategoryAverage={getCategoryAverage}
                  getCompetencyLevel={getCompetencyLevel}
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
