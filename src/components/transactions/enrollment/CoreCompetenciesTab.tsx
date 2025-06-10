
import React, { useState, useEffect } from 'react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CompetencyAssessmentTab from './CompetencyAssessmentTab';
import { industrySegmentsDataManager } from '@/utils/sharedDataManagers';

interface CoreCompetenciesTabProps {
  competencyData: any;
  updateCompetencyData: (industrySegment: string, domainGroup: string, category: string, subCategory: string, rating: number) => void;
}

const CoreCompetenciesTab: React.FC<CoreCompetenciesTabProps> = ({
  competencyData,
  updateCompetencyData
}) => {
  const [activeSegmentTab, setActiveSegmentTab] = useState('');
  const [industrySegments, setIndustrySegments] = useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [availableSegments, setAvailableSegments] = useState<{id: string, name: string}[]>([]);
  
  // Independent form fields for Core Competencies only
  const [providerName, setProviderName] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  // Load industry segments
  useEffect(() => {
    const loadSegments = () => {
      try {
        const segments = industrySegmentsDataManager.loadData();
        setIndustrySegments(segments);
        
        // Create available segments with IDs for selection
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
  }, []);

  // Update active tab when selected industry segments change
  useEffect(() => {
    if (selectedSegments.length > 0 && !selectedSegments.includes(activeSegmentTab)) {
      setActiveSegmentTab(selectedSegments[0]);
    }
  }, [selectedSegments, activeSegmentTab]);

  // Helper function to get industry segment name from ID
  const getIndustrySegmentName = (segmentId: string) => {
    try {
      const segmentIndex = parseInt(segmentId) - 1;
      
      if (segmentIndex >= 0 && segmentIndex < industrySegments.length) {
        const name = industrySegments[segmentIndex];
        return name;
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

  const handleAddSegment = (segmentId: string) => {
    if (!selectedSegments.includes(segmentId)) {
      const newSegments = [...selectedSegments, segmentId];
      setSelectedSegments(newSegments);
      if (!activeSegmentTab) {
        setActiveSegmentTab(segmentId);
      }
    }
  };

  const handleRemoveSegment = (segmentId: string) => {
    const newSegments = selectedSegments.filter(id => id !== segmentId);
    setSelectedSegments(newSegments);
    if (activeSegmentTab === segmentId && newSegments.length > 0) {
      setActiveSegmentTab(newSegments[0]);
    } else if (newSegments.length === 0) {
      setActiveSegmentTab('');
    }
  };

  return (
    <TabsContent value="core-competencies" className="space-y-6">
      {/* Independent Core Competencies Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Solution Provider Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="provider-name">Solution Provider Name</Label>
              <Input
                id="provider-name"
                placeholder="Enter provider name"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="organization-name">Organization Name</Label>
              <Input
                id="organization-name"
                placeholder="Enter organization name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Core Competencies Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="segment-select">Select Industry Segment for Assessment</Label>
            <div className="flex gap-2 mt-2">
              <Select onValueChange={handleAddSegment}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select industry segment" />
                </SelectTrigger>
                <SelectContent>
                  {availableSegments
                    .filter(segment => !selectedSegments.includes(segment.id))
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

          {selectedSegments.length > 0 && (
            <div>
              <Label>Selected Segments:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSegments.map((segmentId) => (
                  <Badge key={segmentId} variant="secondary" className="flex items-center gap-1">
                    {getIndustrySegmentName(segmentId)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveSegment(segmentId)}
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

      {selectedSegments.length > 0 && (
        <div>
          {selectedSegments.length === 1 ? (
            <CompetencyAssessmentTab
              selectedIndustrySegment={selectedSegments[0]}
              competencyData={competencyData[selectedSegments[0]] || {}}
              updateCompetencyData={(domainGroup, category, subCategory, rating) => 
                updateCompetencyData(selectedSegments[0], domainGroup, category, subCategory, rating)
              }
            />
          ) : (
            <Tabs value={activeSegmentTab} onValueChange={setActiveSegmentTab} className="w-full">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${selectedSegments.length}, 1fr)` }}>
                {selectedSegments.map((segmentId) => {
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

              {selectedSegments.map((segmentId) => (
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
};

export default CoreCompetenciesTab;
