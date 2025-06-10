import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { masterDomainGroups, industrySegmentMapping } from '../competency/data';

interface IndustrySegment {
  id: string;
  name: string;
  code: string;
  description?: string;
}

interface CompetencyData {
  [domainGroup: string]: {
    [category: string]: {
      [subCategory: string]: number;
    };
  };
}

interface CompetencyAssessmentTabProps {
  selectedIndustrySegment: string;
  competencyData: CompetencyData;
  updateCompetencyData: (domainGroup: string, category: string, subCategory: string, rating: number) => void;
}

// Helper function to get rating description based on value
const getRatingDescription = (rating: number) => {
  if (rating >= 0 && rating < 2.5) return "No Competency";
  if (rating >= 2.5 && rating < 5) return "Basic";
  if (rating >= 5 && rating < 7.5) return "Advanced";
  if (rating >= 7.5 && rating <= 10) return "Guru";
  return "";
};

// Helper function to get rating color based on value
const getRatingColor = (rating: number) => {
  if (rating >= 0 && rating < 2.5) return "text-red-600";
  if (rating >= 2.5 && rating < 5) return "text-yellow-600";
  if (rating >= 5 && rating < 7.5) return "text-blue-600";
  if (rating >= 7.5 && rating <= 10) return "text-green-600";
  return "text-gray-600";
};

const CompetencyAssessmentTab: React.FC<CompetencyAssessmentTabProps> = ({
  selectedIndustrySegment,
  competencyData,
  updateCompetencyData
}) => {
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);

  useEffect(() => {
    // Load industry segments from master data
    const loadIndustrySegments = () => {
      const savedSegments = localStorage.getItem('industrySegments');
      let segments: string[] = [];
      
      if (savedSegments) {
        try {
          segments = JSON.parse(savedSegments);
        } catch (error) {
          console.error('Error parsing saved segments:', error);
          // Default segments if parsing fails
          segments = [
            'Banking, Financial Services & Insurance (BFSI)',
            'Retail & E-Commerce',
            'Healthcare & Life Sciences',
            'Information Technology & Software Services',
            'Telecommunications',
            'Education & EdTech',
            'Manufacturing (Smart / Discrete / Process)',
            'Logistics & Supply Chain'
          ];
        }
      } else {
        // Default segments if none saved
        segments = [
          'Banking, Financial Services & Insurance (BFSI)',
          'Retail & E-Commerce',
          'Healthcare & Life Sciences',
          'Information Technology & Software Services',
          'Telecommunications',
          'Education & EdTech',
          'Manufacturing (Smart / Discrete / Process)',
          'Logistics & Supply Chain'
        ];
      }

      // Convert to IndustrySegment format
      const segmentObjects: IndustrySegment[] = segments.map((segment, index) => ({
        id: (index + 1).toString(),
        name: segment,
        code: segment.split(' ')[0].substring(0, 4).toUpperCase(),
        description: `Industry segment: ${segment}`
      }));

      setIndustrySegments(segmentObjects);
    };

    loadIndustrySegments();
  }, []);

  console.log('CompetencyAssessmentTab - selectedIndustrySegment:', selectedIndustrySegment);
  console.log('CompetencyAssessmentTab - masterDomainGroups:', masterDomainGroups);

  if (!selectedIndustrySegment) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Core Competencies Assessment</h3>
        <p className="text-muted-foreground">
          Please select an Industry Segment in Basic Information to enable competency ratings.
        </p>
      </div>
    );
  }

  // Get the industry segment name from the loaded segments
  const selectedSegment = industrySegments.find(segment => segment.id === selectedIndustrySegment);
  const industrySegmentName = selectedSegment ? selectedSegment.name : selectedIndustrySegment;

  console.log('Industry segment name:', industrySegmentName);

  // Get domain groups for the selected industry segment
  const relevantDomainGroups = masterDomainGroups.filter(group => {
    const matches = group.industrySegment === industrySegmentName;
    console.log(`Checking domain group ${group.name} with industrySegment ${group.industrySegment} against ${industrySegmentName}: ${matches}`);
    return matches;
  });

  console.log('Relevant domain groups found:', relevantDomainGroups.length);
  console.log('Domain groups details:', relevantDomainGroups);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Selected Industry Segment</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {industrySegmentName}
          </Badge>
        </CardContent>
      </Card>

      {relevantDomainGroups.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Competency Structure</h3>
            <p className="text-muted-foreground">
              No domain groups found for industry segment: {industrySegmentName}. 
              Please configure domain groups for this industry segment in the master data.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Looking for industry segment: {industrySegmentName}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {relevantDomainGroups.map((domainGroup) => (
            <Card key={domainGroup.id}>
              <CardHeader>
                <CardTitle className="text-lg">{domainGroup.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {domainGroup.categories.map((category) => (
                    <AccordionItem key={category.id} value={category.id}>
                      <AccordionTrigger className="text-left">
                        <div>
                          <div className="font-medium">{category.name}</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        {category.subCategories.map((subCategory) => {
                          const currentRating = competencyData[domainGroup.name]?.[category.name]?.[subCategory.name] || 0;
                          const ratingDescription = getRatingDescription(currentRating);
                          const ratingColor = getRatingColor(currentRating);
                          
                          return (
                            <div key={subCategory.id} className="space-y-3 p-4 border rounded-lg bg-muted/30">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <Label className="text-sm font-medium">{subCategory.name}</Label>
                                  {subCategory.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{subCategory.description}</p>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-lg font-bold">{currentRating}/10</div>
                                  <div className={`text-xs font-medium ${ratingColor}`}>
                                    {ratingDescription}
                                  </div>
                                </div>
                              </div>
                              <Slider
                                value={[currentRating]}
                                onValueChange={([value]) => 
                                  updateCompetencyData(domainGroup.name, category.name, subCategory.name, value)
                                }
                                max={10}
                                min={0}
                                step={0.5}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>0 - No Competency</span>
                                <span>2.5 - Basic</span>
                                <span>5 - Advanced</span>
                                <span>7.5+ - Guru</span>
                              </div>
                            </div>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompetencyAssessmentTab;
