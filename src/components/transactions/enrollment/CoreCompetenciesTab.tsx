
import React, { useState, useEffect } from 'react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import CompetencyAssessmentTab from './CompetencyAssessmentTab';
import { industrySegmentsDataManager } from '@/utils/sharedDataManagers';

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
  const [activeSegmentTab, setActiveSegmentTab] = useState('');
  const [industrySegments, setIndustrySegments] = useState<string[]>([]);
  const [independentSelectedSegments, setIndependentSelectedSegments] = useState<string[]>([]);
  const [availableSegments, setAvailableSegments] = useState<{id: string, name: string}[]>([]);

  // Load industry segments to ensure we have the latest data
  useEffect(() => {
    const loadSegments = () => {
      try {
        const segments = industrySegmentsDataManager.loadData();
        setIndustrySegments(segments);
        
        // Create available segments with IDs for independent selection
        const segmentsWithIds = segments.map((segment, index) => ({
          id: (index + 1).toString(),
          name: segment
        }));
        setAvailableSegments(segmentsWithIds);
        
        console.log('CoreCompetenciesTab - Loaded industry segments:', segments);
      } catch (error) {
        console.error('CoreCompetenciesTab - Error loading segments:', error);
      }
    };

    loadSegments();

    const handleIndustrySegmentsUpdated = () => {
      console.log('CoreCompetenciesTab - Received industry segments update');
      loadSegments();
    };

    window.addEventListener('industrySegmentsUpdated', handleIndustrySegmentsUpdated);

    return () => {
      window.removeEventListener('industrySegmentsUpdated', handleIndustrySegmentsUpdated);
    };
  }, []);

  // Use independent segments if Basic Information segments are not available
  const effectiveSelectedSegments = selectedIndustrySegments.length > 0 
    ? selectedIndustrySegments 
    : independentSelectedSegments;

  // Update active tab when selected industry segments change
  useEffect(() => {
    if (effectiveSelectedSegments.length > 0 && !effectiveSelectedSegments.includes(activeSegmentTab)) {
      setActiveSegmentTab(effectiveSelectedSegments[0]);
    }
  }, [effectiveSelectedSegments, activeSegmentTab]);

  console.log('CoreCompetenciesTab - selectedIndustrySegments from Basic Info:', selectedIndustrySegments);
  console.log('CoreCompetenciesTab - independentSelectedSegments:', independentSelectedSegments);
  console.log('CoreCompetenciesTab - effectiveSelectedSegments:', effectiveSelectedSegments);

  // Helper function to get industry segment name from ID
  const getIndustrySegmentName = (segmentId: string) => {
    try {
      const segmentIndex = parseInt(segmentId) - 1;
      
      if (segmentIndex >= 0 && segmentIndex < industrySegments.length) {
        const name = industrySegments[segmentIndex];
        console.log(`CoreCompetenciesTab - Mapping segment ID ${segmentId} (index ${segmentIndex}) to name: ${name}`);
        return name;
      } else {
        console.warn(`CoreCompetenciesTab - Segment ID ${segmentId} (index ${segmentIndex}) is out of range. Available segments:`, industrySegments);
      }
    } catch (error) {
      console.error('CoreCompetenciesTab - Error loading industry segments:', error);
    }
    
    return `Industry Segment ${segmentId}`;
  };

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

  const handleAddIndependentSegment = (segmentId: string) => {
    if (!independentSelectedSegments.includes(segmentId)) {
      const newSegments = [...independentSelectedSegments, segmentId];
      setIndependentSelectedSegments(newSegments);
      if (!activeSegmentTab) {
        setActiveSegmentTab(segmentId);
      }
    }
  };

  const handleRemoveIndependentSegment = (segmentId: string) => {
    const newSegments = independentSelectedSegments.filter(id => id !== segmentId);
    setIndependentSelectedSegments(newSegments);
    if (activeSegmentTab === segmentId && newSegments.length > 0) {
      setActiveSegmentTab(newSegments[0]);
    } else if (newSegments.length === 0) {
      setActiveSegmentTab('');
    }
  };

  // Show independent selection if no segments from Basic Information
  if (selectedIndustrySegments.length === 0) {
    return (
      <TabsContent value="core-competencies" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Core Competencies Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="independent-segment">Select Industry Segment for Assessment</Label>
              <div className="flex gap-2 mt-2">
                <Select onValueChange={handleAddIndependentSegment}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select industry segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSegments
                      .filter(segment => !independentSelectedSegments.includes(segment.id))
                      .map((segment) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          {segment.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>

            {independentSelectedSegments.length > 0 && (
              <div>
                <Label>Selected Segments:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {independentSelectedSegments.map((segmentId) => (
                    <Badge key={segmentId} variant="secondary" className="flex items-center gap-1">
                      {getIndustrySegmentName(segmentId)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveIndependentSegment(segmentId)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {effectiveSelectedSegments.length > 0 && (
          <div>
            {effectiveSelectedSegments.length === 1 ? (
              <CompetencyAssessmentTab
                selectedIndustrySegment={effectiveSelectedSegments[0]}
                competencyData={competencyData[effectiveSelectedSegments[0]] || {}}
                updateCompetencyData={(domainGroup, category, subCategory, rating) => 
                  updateCompetencyData(effectiveSelectedSegments[0], domainGroup, category, subCategory, rating)
                }
              />
            ) : (
              <Tabs value={activeSegmentTab} onValueChange={setActiveSegmentTab} className="w-full">
                <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${effectiveSelectedSegments.length}, 1fr)` }}>
                  {effectiveSelectedSegments.map((segmentId) => {
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

                {effectiveSelectedSegments.map((segmentId) => (
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
            )}
          </div>
        )}
      </TabsContent>
    );
  }

  // If only one segment from Basic Information, show it directly without sub-tabs
  if (effectiveSelectedSegments.length === 1) {
    return (
      <TabsContent value="core-competencies" className="space-y-6">
        <CompetencyAssessmentTab
          selectedIndustrySegment={effectiveSelectedSegments[0]}
          competencyData={competencyData[effectiveSelectedSegments[0]] || {}}
          updateCompetencyData={(domainGroup, category, subCategory, rating) => 
            updateCompetencyData(effectiveSelectedSegments[0], domainGroup, category, subCategory, rating)
          }
        />
      </TabsContent>
    );
  }

  // Multiple segments - show tabbed interface with progress indicators
  return (
    <TabsContent value="core-competencies" className="space-y-6">
      <Tabs value={activeSegmentTab} onValueChange={setActiveSegmentTab} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${effectiveSelectedSegments.length}, 1fr)` }}>
          {effectiveSelectedSegments.map((segmentId) => {
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

        {effectiveSelectedSegments.map((segmentId) => (
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
