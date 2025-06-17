import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, FolderTree, Target, RefreshCw, ExternalLink } from 'lucide-react';
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from '../../master-data/domain-groups/domainGroupsDataManager';
import RatingSlider from './components/RatingSlider';
import { useToast } from "@/hooks/use-toast";

interface CompetencyAssessmentTabProps {
  selectedIndustrySegment: string;
  competencyData: any;
  updateCompetencyData: (domainGroup: string, category: string, subCategory: string, rating: number) => void;
  getCategoryAverage?: (segmentId: string, domainGroupName: string, categoryName: string) => number;
  getCompetencyLevel?: (rating: number) => { min: number; max: number; label: string; color: string };
}

const CompetencyAssessmentTab: React.FC<CompetencyAssessmentTabProps> = ({
  selectedIndustrySegment,
  competencyData,
  updateCompetencyData,
  getCategoryAverage,
  getCompetencyLevel
}) => {
  const [domainGroupsData, setDomainGroupsData] = useState<DomainGroupsData>({
    domainGroups: [],
    categories: [],
    subCategories: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Enhanced data loading with better persistence detection
  useEffect(() => {
    loadDomainGroupsData();
  }, []);

  const loadDomainGroupsData = () => {
    console.log('CompetencyAssessmentTab - Enhanced data loading...');
    setIsLoading(true);
    
    try {
      const data = domainGroupsDataManager.loadData();
      console.log('CompetencyAssessmentTab - Enhanced loaded data:', data);
      
      // Validate data structure
      const validData = {
        domainGroups: Array.isArray(data.domainGroups) ? data.domainGroups : [],
        categories: Array.isArray(data.categories) ? data.categories : [],
        subCategories: Array.isArray(data.subCategories) ? data.subCategories : []
      };
      
      setDomainGroupsData(validData);
      
      console.log('CompetencyAssessmentTab - Data loaded successfully:', {
        domainGroups: validData.domainGroups.length,
        categories: validData.categories.length,
        subCategories: validData.subCategories.length
      });
      
    } catch (error) {
      console.error('CompetencyAssessmentTab - Error loading data:', error);
      setDomainGroupsData({
        domainGroups: [],
        categories: [],
        subCategories: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = () => {
    console.log('CompetencyAssessmentTab - Manual refresh requested');
    loadDomainGroupsData();
    toast({
      title: "Refreshed",
      description: "Domain groups data refreshed from master data."
    });
  };

  // Filter domain groups by selected industry segment
  const relevantDomainGroups = domainGroupsData.domainGroups.filter(
    group => group.industrySegmentId === selectedIndustrySegment && group.isActive
  );

  console.log('CompetencyAssessmentTab - selectedIndustrySegment:', selectedIndustrySegment);
  console.log('CompetencyAssessmentTab - relevantDomainGroups:', relevantDomainGroups);
  console.log('CompetencyAssessmentTab - competencyData received:', competencyData);
  console.log('CompetencyAssessmentTab - domainGroupsData.domainGroups length:', domainGroupsData.domainGroups.length);

  // Get hierarchical data with categories and subcategories - ensuring no duplicates
  const getHierarchicalData = () => {
    return relevantDomainGroups.map(domainGroup => {
      const categories = domainGroupsData.categories.filter(
        cat => cat.domainGroupId === domainGroup.id && cat.isActive
      );
      
      return {
        ...domainGroup,
        categories: categories.map(category => {
          // Get subcategories and remove any duplicates by name
          const subCategories = domainGroupsData.subCategories.filter(
            sub => sub.categoryId === category.id && sub.isActive
          );
          
          // Remove duplicates by creating a Map with name as key
          const uniqueSubCategories = Array.from(
            new Map(subCategories.map(sub => [sub.name, sub])).values()
          );
          
          return {
            ...category,
            subCategories: uniqueSubCategories
          };
        })
      };
    });
  };

  const hierarchicalData = getHierarchicalData();
  console.log('CompetencyAssessmentTab - hierarchicalData:', hierarchicalData);

  // Get current rating for a subcategory
  const getCurrentRating = (domainGroupName: string, categoryName: string, subCategoryName: string) => {
    const rating = competencyData[domainGroupName]?.[categoryName]?.[subCategoryName] || 0;
    console.log('CompetencyAssessmentTab - getCurrentRating:', { domainGroupName, categoryName, subCategoryName, rating });
    return rating;
  };

  // Handle rating change
  const handleRatingChange = (domainGroupName: string, categoryName: string, subCategoryName: string, rating: number) => {
    console.log('CompetencyAssessmentTab - Rating changed:', { domainGroupName, categoryName, subCategoryName, rating });
    updateCompetencyData(domainGroupName, categoryName, subCategoryName, rating);
  };

  if (!selectedIndustrySegment) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Please select an industry segment to view competency evaluation.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading domain groups...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hierarchicalData.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <div className="flex flex-col items-center gap-4">
              <FolderTree className="w-12 h-12 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground font-medium">
                  No domain groups found for this industry segment
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Domain groups must be configured in Master Data first.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button 
                onClick={handleRefreshData}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </Button>
              
              <Button 
                onClick={() => window.open('/master-data?section=domain-groups', '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Configure Domain Groups
              </Button>
            </div>
            
            <Card className="bg-blue-50 border-blue-200 max-w-md mx-auto">
              <CardContent className="pt-4">
                <p className="text-sm text-blue-700">
                  <strong>Quick Setup:</strong> Go to Master Data → Domain Groups to create your 
                  industry-specific competency hierarchy. Once created, the data will be available 
                  here immediately.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Competency Assessment
              </CardTitle>
            </div>
            <Button 
              onClick={handleRefreshData}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Rate your competency levels across different domain groups, categories, and sub-categories using the interactive sliders below.
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {hierarchicalData.length} Domain Groups
            </Badge>
            <Badge variant="outline">
              {hierarchicalData.reduce((total, group) => total + group.categories.length, 0)} Categories
            </Badge>
            <Badge variant="outline">
              {hierarchicalData.reduce((total, group) => 
                total + group.categories.reduce((catTotal, cat) => catTotal + cat.subCategories.length, 0), 0
              )} Sub-Categories
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Domain Groups Hierarchy with Rating Sliders - Collapsed by default */}
      <div className="space-y-4">
        {hierarchicalData.map((domainGroup) => (
          <Card key={domainGroup.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">{domainGroup.name}</CardTitle>
                <Badge variant="default">Domain Group</Badge>
              </div>
              {domainGroup.description && (
                <p className="text-sm text-muted-foreground">{domainGroup.description}</p>
              )}
            </CardHeader>
            <CardContent>
              {domainGroup.categories.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                  {domainGroup.categories.map((category, categoryIndex) => {
                    // Calculate category average if function is provided
                    const categoryAverage = getCategoryAverage ? getCategoryAverage(selectedIndustrySegment, domainGroup.name, category.name) : 0;
                    const competencyLevel = getCompetencyLevel && categoryAverage > 0 ? getCompetencyLevel(categoryAverage) : null;
                    
                    return (
                      <AccordionItem key={category.id} value={`category-${category.id}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center gap-2 w-full">
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                              {categoryIndex + 1}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium">{category.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {category.subCategories.length} sub-categories
                              </div>
                            </div>
                            {/* Category Competency Level Display */}
                            {categoryAverage > 0 && competencyLevel && (
                              <div className="flex items-center gap-2 mr-4">
                                <Badge className={competencyLevel.color}>
                                  {competencyLevel.label}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          {category.description && (
                            <p className="text-muted-foreground mb-6 italic">{category.description}</p>
                          )}
                          
                          {/* Category Average Progress Bar */}
                          {categoryAverage > 0 && competencyLevel && (
                            <div className="mb-6 p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Category Level: {competencyLevel.label}</span>
                                <span className="text-sm text-muted-foreground">{categoryAverage.toFixed(1)}/5</span>
                              </div>
                              <Progress value={(categoryAverage / 5) * 100} className="h-2" />
                            </div>
                          )}
                          
                          {/* Sub-Categories with Rating Sliders */}
                          <div className="space-y-4 ml-4">
                            {category.subCategories.map((subCategory, subIndex) => (
                              <div key={`${subCategory.id}-${subCategory.name}`} className="border rounded-lg p-4 bg-muted/20">
                                <div className="flex items-start gap-3 mb-3">
                                  <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium mt-0.5">
                                    {categoryIndex + 1}.{subIndex + 1}
                                  </span>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm mb-1">{subCategory.name}</h4>
                                    {subCategory.description && (
                                      <p className="text-muted-foreground text-xs">{subCategory.description}</p>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Rating Slider - integrated into subcategory display */}
                                <RatingSlider
                                  currentRating={getCurrentRating(domainGroup.name, category.name, subCategory.name)}
                                  onRatingChange={(rating) => 
                                    handleRatingChange(domainGroup.name, category.name, subCategory.name, rating)
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No categories configured for this domain group.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompetencyAssessmentTab;
