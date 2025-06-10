
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, Building2, FolderTree, Target } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domainGroupsDataManager';

interface DomainGroupDisplayProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
}

const DomainGroupDisplay: React.FC<DomainGroupDisplayProps> = ({ data, onDataUpdate }) => {
  const { toast } = useToast();

  // Handle delete
  const handleDelete = (domainGroupId: string) => {
    const updatedData = {
      domainGroups: data.domainGroups.filter(dg => dg.id !== domainGroupId),
      categories: data.categories.filter(cat => cat.domainGroupId !== domainGroupId),
      subCategories: data.subCategories.filter(sub => {
        const category = data.categories.find(cat => cat.id === sub.categoryId);
        return category?.domainGroupId !== domainGroupId;
      })
    };
    
    onDataUpdate(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    
    toast({
      title: "Deleted",
      description: "Domain group hierarchy deleted successfully",
    });
  };

  // Get hierarchical data for display
  const hierarchicalData = data.domainGroups.map(domainGroup => {
    const categories = data.categories.filter(cat => cat.domainGroupId === domainGroup.id);
    return {
      ...domainGroup,
      categories: categories.map(category => ({
        ...category,
        subCategories: data.subCategories.filter(sub => sub.categoryId === category.id)
      }))
    };
  });

  if (hierarchicalData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderTree className="w-5 h-5" />
          Domain Group Hierarchies
        </CardTitle>
        <CardDescription>
          View all created domain group hierarchies in an organized structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {hierarchicalData.map((domainGroup) => (
            <div key={domainGroup.id} className="border rounded-lg p-6 bg-muted/20">
              {/* Domain Group Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">{domainGroup.name}</h2>
                    <Badge variant={domainGroup.isActive ? "default" : "secondary"}>
                      {domainGroup.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {domainGroup.description && (
                    <p className="text-muted-foreground mb-2">{domainGroup.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Industry: {domainGroup.industrySegmentName || 'Not Specified'}
                    </span>
                    <span>{domainGroup.categories.length} Categories</span>
                    <span>
                      {domainGroup.categories.reduce((sum, cat) => sum + cat.subCategories.length, 0)} Sub-Categories
                    </span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(domainGroup.id)}
                  className="ml-4"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>

              {/* Categories Accordion */}
              {domainGroup.categories.length > 0 && (
                <Accordion type="multiple" className="w-full">
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
                          <p className="text-muted-foreground mb-4 italic">{category.description}</p>
                        )}
                        
                        {/* Sub-Categories */}
                        <div className="space-y-3 ml-4">
                          {category.subCategories.map((subCategory, subIndex) => (
                            <div key={subCategory.id} className="border-l-2 border-primary/30 pl-4 py-2">
                              <div className="flex items-start gap-2">
                                <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium mt-0.5">
                                  {categoryIndex + 1}.{subIndex + 1}
                                </span>
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{subCategory.name}</h4>
                                  {subCategory.description && (
                                    <p className="text-muted-foreground text-sm mt-1">{subCategory.description}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainGroupDisplay;
