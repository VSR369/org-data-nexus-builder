
import React, { useState, useEffect } from 'react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    return (
      <TabsContent value="core-competencies" className="space-y-6">
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
