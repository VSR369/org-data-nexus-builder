
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building2, Target } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
  subCategories?: Array<{
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  }>;
}

interface DomainGroup {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  categories?: Category[];
}

interface DomainGroupCardProps {
  domainGroup: DomainGroup;
}

const DomainGroupCard: React.FC<DomainGroupCardProps> = ({ domainGroup }) => {
  const categories = domainGroup.categories || [];
  
  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm">
      {/* Domain Group Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">{domainGroup.name}</h3>
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
              {categories.length} Categories
            </span>
            <span>
              {categories.reduce((sum, cat) => sum + (cat.subCategories?.length || 0), 0)} Sub-Categories
            </span>
            <span className="text-xs">
              Created: {new Date(domainGroup.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Categories Accordion - Collapsed by default */}
      {categories.length > 0 && (
        <Accordion type="multiple" className="w-full">
          {categories.map((category, categoryIndex) => (
            <AccordionItem key={category.id} value={`category-${category.id}`}>
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {categoryIndex + 1}
                  </span>
                  <div className="text-left">
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {category.subCategories?.length || 0} sub-categories
                      {category.description && ` • ${category.description}`}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {/* Sub-Categories Grid */}
                <div className="grid gap-3 ml-6">
                  {(category.subCategories || []).map((subCategory, subIndex) => (
                    <div key={subCategory.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border-l-2 border-primary/30">
                      <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium mt-0.5 shrink-0">
                        {categoryIndex + 1}.{subIndex + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1">{subCategory.name}</h4>
                        {subCategory.description && (
                          <p className="text-muted-foreground text-xs leading-relaxed">{subCategory.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {subCategory.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Ready for Evaluation
                          </span>
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
  );
};

export default DomainGroupCard;
