
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useDomainGroupsData } from '../../master-data/domain-groups/hooks/useDomainGroupsData';

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

// Industry segment mapping to match the domain groups data
const getIndustrySegmentName = (value: string) => {
  const names: { [key: string]: string } = {
    bfsi: "Banking, Financial Services & Insurance (BFSI)",
    retail: "Retail & E-Commerce",
    healthcare: "Healthcare & Life Sciences",
    it: "Information Technology & Software Services",
    telecom: "Telecommunications",
    education: "Education & EdTech",
    manufacturing: "Manufacturing",
    logistics: "Logistics & Supply Chain"
  };
  return names[value] || value;
};

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
  const { industrySegments } = useDomainGroupsData();

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

  // Find the selected industry segment
  const selectedSegment = industrySegments.find(segment => segment.id === selectedIndustrySegment);
  
  if (!selectedSegment) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Core Competencies Assessment</h3>
        <p className="text-muted-foreground">
          Industry segment not found. Please select a valid industry segment.
        </p>
      </div>
    );
  }

  // Get domain groups for the selected industry segment
  const { domainGroups: allDomainGroups } = useDomainGroupsData();
  const relevantDomainGroups = allDomainGroups.filter(group => 
    group.industrySegmentId === selectedIndustrySegment
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Selected Industry Segment</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {getIndustrySegmentName(selectedIndustrySegment)}
          </Badge>
        </CardContent>
      </Card>

      {relevantDomainGroups.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Competency Structure</h3>
            <p className="text-muted-foreground">
              No domain groups found for this industry segment. Please configure domain groups in the master data.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {relevantDomainGroups.map((domainGroup) => (
            <Card key={domainGroup.id}>
              <CardHeader>
                <CardTitle className="text-lg">{domainGroup.name}</CardTitle>
                {domainGroup.description && (
                  <p className="text-sm text-muted-foreground">{domainGroup.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {domainGroup.categories.map((category) => (
                    <AccordionItem key={category.id} value={category.id}>
                      <AccordionTrigger className="text-left">
                        <div>
                          <div className="font-medium">{category.name}</div>
                          {category.description && (
                            <div className="text-sm text-muted-foreground mt-1">{category.description}</div>
                          )}
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
