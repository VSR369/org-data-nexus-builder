import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { industrySegmentsDataManager } from '@/utils/sharedDataManagers';

interface IndustrySegment {
  id: string;
  name: string;
  code: string;
  description?: string;
}

interface DomainGroup {
  id: string;
  name: string;
  description?: string;
  industrySegmentId: string;
  isActive: boolean;
  createdAt: string;
  categories: Category[];
}

interface Category {
  id: string;
  name: string;
  description?: string;
  domainGroupId: string;
  isActive: boolean;
  createdAt: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
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
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load industry segments from shared DataManager
    const loadIndustrySegments = () => {
      console.log('📥 CompetencyAssessmentTab: Loading segments from shared DataManager...');
      
      const segments = industrySegmentsDataManager.loadData();
      console.log('📋 CompetencyAssessmentTab: Loaded segments:', segments);

      // Convert to IndustrySegment format
      const segmentObjects: IndustrySegment[] = segments.map((segment, index) => ({
        id: (index + 1).toString(),
        name: segment,
        code: segment.split(' ')[0].substring(0, 4).toUpperCase(),
        description: `Industry segment: ${segment}`
      }));

      setIndustrySegments(segmentObjects);
    };

    // Load domain groups from master data
    const loadDomainGroups = () => {
      const savedDomainGroups = localStorage.getItem('domainGroupsData');
      if (savedDomainGroups) {
        try {
          const domainGroupsData: DomainGroup[] = JSON.parse(savedDomainGroups);
          console.log('Loaded domain groups from master data:', domainGroupsData);
          setDomainGroups(domainGroupsData);
        } catch (error) {
          console.error('Error parsing domain groups data:', error);
          setDomainGroups([]);
        }
      } else {
        console.log('No domain groups data found in localStorage');
        setDomainGroups([]);
      }
    };

    loadIndustrySegments();
    loadDomainGroups();

    // Listen for industry segments updates
    const handleIndustrySegmentsUpdated = () => {
      console.log('🔄 CompetencyAssessmentTab: Received industry segments update');
      loadIndustrySegments();
    };

    window.addEventListener('industrySegmentsUpdated', handleIndustrySegmentsUpdated);

    return () => {
      window.removeEventListener('industrySegmentsUpdated', handleIndustrySegmentsUpdated);
    };
  }, []);

  console.log('CompetencyAssessmentTab - selectedIndustrySegment:', selectedIndustrySegment);
  console.log('CompetencyAssessmentTab - domainGroups:', domainGroups);

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
  const relevantDomainGroups = domainGroups.filter(group => {
    const matches = group.industrySegmentId === selectedIndustrySegment;
    console.log(`Checking domain group ${group.name} with industrySegmentId ${group.industrySegmentId} against ${selectedIndustrySegment}: ${matches}`);
    return matches;
  });

  console.log('Relevant domain groups found:', relevantDomainGroups.length);
  console.log('Domain groups details:', relevantDomainGroups);

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

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
              Looking for industry segment ID: {selectedIndustrySegment}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {relevantDomainGroups.map((domainGroup) => (
            <Card key={domainGroup.id}>
              <CardHeader>
                <Collapsible
                  open={expandedGroups.has(domainGroup.id)}
                  onOpenChange={() => toggleGroupExpansion(domainGroup.id)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                    <div>
                      <CardTitle className="text-lg">{domainGroup.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {domainGroup.categories.length} categories
                      </p>
                    </div>
                    {expandedGroups.has(domainGroup.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="space-y-3">
                      {domainGroup.categories.map((category) => (
                        <div key={category.id} className="border rounded-lg">
                          <Collapsible
                            open={expandedCategories.has(category.id)}
                            onOpenChange={() => toggleCategoryExpansion(category.id)}
                          >
                            <CollapsibleTrigger className="flex items-center justify-between w-full text-left p-4 hover:bg-muted/30">
                              <div>
                                <div className="font-medium">{category.name}</div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {category.subCategories.length} sub-categories
                                </p>
                              </div>
                              {expandedCategories.has(category.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-4 pb-4">
                              <div className="space-y-4">
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
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompetencyAssessmentTab;
