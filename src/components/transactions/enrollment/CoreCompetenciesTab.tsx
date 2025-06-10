
import React, { useState, useEffect } from 'react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CompetencyAssessmentTab from './CompetencyAssessmentTab';
import { industrySegmentsDataManager } from '@/utils/sharedDataManagers';

interface CoreCompetenciesTabProps {
  selectedIndustrySegments: string[];
  competencyData: any;
  updateCompetencyData: (industrySegment: string, domainGroup: string, category: string, subCategory: string, rating: number) => void;
}

// Helper function to get industry segment name from ID using the same data source as BasicInformationTab
const getIndustrySegmentName = (segmentId: string) => {
  try {
    // Load industry segments from the same shared data manager used in BasicInformationTab
    const segments = industrySegmentsDataManager.loadData();
    console.log('CoreCompetenciesTab - Available segments from shared manager:', segments);
    
    // Convert segment array index to ID (index + 1)
    const segmentIndex = parseInt(segmentId) - 1;
    
    if (segmentIndex >= 0 && segmentIndex < segments.length) {
      const name = segments[segmentIndex];
      console.log(`CoreCompetenciesTab - Mapping segment ID ${segmentId} (index ${segmentIndex}) to name: ${name}`);
      return name;
    } else {
      console.warn(`CoreCompetenciesTab - Segment ID ${segmentId} (index ${segmentIndex}) is out of range. Available segments:`, segments);
    }
  } catch (error) {
    console.error('CoreCompetenciesTab - Error loading industry segments:', error);
  }
  
  // If we can't find the segment, return a descriptive fallback
  console.warn(`CoreCompetenciesTab - Could not find segment name for ID: ${segmentId}`);
  return `Industry Segment ${segmentId}`;
};

const CoreCompetenciesTab: React.FC<CoreCompetenciesTabProps> = ({
  selectedIndustrySegments,
  competencyData,
  updateCompetencyData
}) => {
  const [activeSegmentTab, setActiveSegmentTab] = useState(selectedIndustrySegments[0] || '');
  const [industrySegments, setIndustrySegments] = useState<string[]>([]);

  // Load industry segments to ensure we have the latest data
  useEffect(() => {
    const loadSegments = () => {
      try {
        const segments = industrySegmentsDataManager.loadData();
        setIndustrySegments(segments);
        console.log('CoreCompetenciesTab - Loaded industry segments:', segments);
      } catch (error) {
        console.error('CoreCompetenciesTab - Error loading segments:', error);
      }
    };

    loadSegments();

    // Listen for industry segments updates
    const handleIndustrySegmentsUpdated = () => {
      console.log('CoreCompetenciesTab - Received industry segments update');
      loadSegments();
    };

    window.addEventListener('industrySegmentsUpdated', handleIndustrySegmentsUpdated);

    return () => {
      window.removeEventListener('industrySegmentsUpdated', handleIndustrySegmentsUpdated);
    };
  }, []);

  // Update active tab when selected industry segments change
  useEffect(() => {
    if (selectedIndustrySegments.length > 0 && !selectedIndustrySegments.includes(activeSegmentTab)) {
      setActiveSegmentTab(selectedIndustrySegments[0]);
    }
  }, [selectedIndustrySegments, activeSegmentTab]);

  console.log('CoreCompetenciesTab - selectedIndustrySegments:', selectedIndustrySegments);
  console.log('CoreCompetenciesTab - selected segment names:', selectedIndustrySegments.map(id => getIndustrySegmentName(id)));

  // Get competency progress for each segment
  const getSegmentProgress = (segmentId: string) => {
    const segmentData = competencyData[segmentId];
    if (!segmentData) return { completed: 0, total: 0 };

    let completed = 0;
    let total = 0;

    Object.values(segmentData).forEach((domainGroup: any) => {
      Object.values(domainGroup).forEach((category: any) => {
        Object.values(category).forEach((rating: any) => {
          total++;
          if (rating > 0) completed++;
        });
      });
    });

    return { completed, total };
  };

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

  // If only one segment, show it directly without sub-tabs
  if (selectedIndustrySegments.length === 1) {
    const progress = getSegmentProgress(selectedIndustrySegments[0]);
    
    return (
      <TabsContent value="core-competencies" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Selected Industry Segment</CardTitle>
            <p className="text-sm text-muted-foreground">
              Rate your competencies for the selected industry segment. You can edit and modify ratings at any time.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-base px-4 py-2">
                {getIndustrySegmentName(selectedIndustrySegments[0])}
              </Badge>
              {progress.total > 0 && (
                <Badge variant="outline" className="text-sm">
                  {progress.completed}/{progress.total} Competencies Rated
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        <CompetencyAssessmentTab
          selectedIndustrySegment={selectedIndustrySegments[0]}
          competencyData={competencyData[selectedIndustrySegments[0]] || {}}
          updateCompetencyData={(domainGroup, category, subCategory, rating) => 
            updateCompetencyData(selectedIndustrySegments[0], domainGroup, category, subCategory, rating)
          }
        />
      </TabsContent>
    );
  }

  // Multiple segments - show tabbed interface with progress indicators
  return (
    <TabsContent value="core-competencies" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Selected Industry Segments</CardTitle>
          <p className="text-sm text-muted-foreground">
            Rate your competencies for each selected industry segment. Click on the tabs below to switch between segments. 
            You can edit and modify ratings at any time for any segment.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {selectedIndustrySegments.map((segmentId) => {
              const progress = getSegmentProgress(segmentId);
              return (
                <div key={segmentId} className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {getIndustrySegmentName(segmentId)}
                  </Badge>
                  {progress.total > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {progress.completed}/{progress.total}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeSegmentTab} onValueChange={setActiveSegmentTab} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${selectedIndustrySegments.length}, 1fr)` }}>
          {selectedIndustrySegments.map((segmentId) => {
            const progress = getSegmentProgress(segmentId);
            const progressPercentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
            
            return (
              <TabsTrigger key={segmentId} value={segmentId} className="text-sm relative">
                <div className="flex flex-col items-center gap-1">
                  <span>{getIndustrySegmentName(segmentId)}</span>
                  {progress.total > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {progressPercentage}% Complete
                    </span>
                  )}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {selectedIndustrySegments.map((segmentId) => (
          <TabsContent key={segmentId} value={segmentId} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Competency Assessment: {getIndustrySegmentName(segmentId)}</span>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const progress = getSegmentProgress(segmentId);
                      return progress.total > 0 ? (
                        <Badge variant="outline">
                          {progress.completed}/{progress.total} Rated ({Math.round((progress.completed / progress.total) * 100)}%)
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Not Started</Badge>
                      );
                    })()}
                  </div>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Rate your competency level for each domain area. You can modify these ratings at any time.
                </p>
              </CardHeader>
            </Card>
            
            <CompetencyAssessmentTab
              selectedIndustrySegment={segmentId}
              competencyData={competencyData[segmentId] || {}}
              updateCompetencyData={(domainGroup, category, subCategory, rating) => 
                updateCompetencyData(segmentId, domainGroup, category, subCategory, rating)
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </TabsContent>
  );
};

export default CoreCompetenciesTab;
