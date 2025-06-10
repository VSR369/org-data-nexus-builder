
import React, { useState } from 'react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CompetencyAssessmentTab from './CompetencyAssessmentTab';

interface CoreCompetenciesTabProps {
  selectedIndustrySegments: string[];
  competencyData: any;
  updateCompetencyData: (industrySegment: string, domainGroup: string, category: string, subCategory: string, rating: number) => void;
}

// Helper function to get industry segment name from ID
const getIndustrySegmentName = (segmentId: string) => {
  const segmentNames: { [key: string]: string } = {
    '1': 'Manufacturing',
    '2': 'Healthcare & Life Sciences', 
    '3': 'Logistics & Supply Chain',
    '4': 'Banking, Financial Services & Insurance',
    '5': 'Information Technology',
    '6': 'Retail & E-commerce'
  };
  return segmentNames[segmentId] || `Segment ${segmentId}`;
};

const CoreCompetenciesTab: React.FC<CoreCompetenciesTabProps> = ({
  selectedIndustrySegments,
  competencyData,
  updateCompetencyData
}) => {
  const [activeSegmentTab, setActiveSegmentTab] = useState(selectedIndustrySegments[0] || '');

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
        <Card>
          <CardHeader>
            <CardTitle>Industry Segments</CardTitle>
            <p className="text-sm text-muted-foreground">
              Rate your competencies for the selected industry segment
            </p>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {getIndustrySegmentName(selectedIndustrySegments[0])}
            </Badge>
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

  // Multiple segments - show tabbed interface
  return (
    <TabsContent value="core-competencies" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Industry Segments</CardTitle>
          <p className="text-sm text-muted-foreground">
            Rate your competencies for each selected industry segment. Click on the tabs below to switch between segments.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {selectedIndustrySegments.map((segmentId) => (
              <Badge key={segmentId} variant="secondary" className="text-base px-4 py-2">
                {getIndustrySegmentName(segmentId)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeSegmentTab} onValueChange={setActiveSegmentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-auto" style={{ gridTemplateColumns: `repeat(${selectedIndustrySegments.length}, 1fr)` }}>
          {selectedIndustrySegments.map((segmentId) => (
            <TabsTrigger key={segmentId} value={segmentId} className="text-sm">
              {getIndustrySegmentName(segmentId)}
            </TabsTrigger>
          ))}
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
