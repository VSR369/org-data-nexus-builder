
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Building2, FolderTree, Target } from 'lucide-react';
import { DomainGroupsData } from '@/types/domainGroups';
import RatingSlider from './components/RatingSlider';

interface CompetencyAssessmentTabProps {
  selectedIndustrySegment: string;
  competencyData: any;
  updateCompetencyData: (domainGroup: string, category: string, subCategory: string, rating: number) => void;
}

const CompetencyAssessmentTab: React.FC<CompetencyAssessmentTabProps> = ({
  selectedIndustrySegment,
  competencyData,
  updateCompetencyData
}) => {
  const [domainGroupsData, setDomainGroupsData] = useState<DomainGroupsData>({
    domainGroups: [],
    categories: [],
    subCategories: []
  });

  // Load domain groups from master data
  useEffect(() => {
    const loadDomainGroups = () => {
      try {
        const savedData = localStorage.getItem('master_data_domain_groups');
        if (savedData) {
          const data = JSON.parse(savedData);
          console.log('CompetencyAssessmentTab - Loaded domain groups data:', data);
          setDomainGroupsData(data);
        } else {
          console.log('CompetencyAssessmentTab - No domain groups found in master data');
          setDomainGroupsData({
            domainGroups: [],
            categories: [],
            subCategories: []
          });
        }
      } catch (error) {
        console.error('CompetencyAssessmentTab - Error loading domain groups:', error);
        setDomainGroupsData({
          domainGroups: [],
          categories: [],
          subCategories: []
        });
      }
    };

    loadDomainGroups();
  }, []);

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

  if (hierarchicalData.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center gap-4">
            <FolderTree className="w-12 h-12 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground font-medium">
                No domain groups found for this industry segment
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Please configure domain groups in Master Data first.
              </p>
            </div>
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
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Competency Assessment
          </CardTitle>
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

      {/* Domain Groups Hierarchy with Rating Sliders */}
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
                <Accordion type="multiple" defaultValue={domainGroup.categories.map(cat => `category-${cat.id}`)} className="w-full">
                  {domainGroup.categories.map((category, categoryIndex) => (
                    <AccordionItem key={category.id} value={`category-${category.id}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                            {categoryIndex + 1}
                          </span>
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {category.subCategories.length} sub-categories
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        {category.description && (
                          <p className="text-muted-foreground mb-6 italic">{category.description}</p>
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
                                subCategoryName={subCategory.name}
                                description={subCategory.description}
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
                  ))}
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
