
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, Building2, Target, Sparkles } from 'lucide-react';
import { DomainGroup } from '@/types/domainGroups';
import CategoryAccordionItem from './CategoryAccordionItem';

interface DomainGroupCardProps {
  domainGroup: DomainGroup & {
    categories: Array<{
      id: string;
      name: string;
      description?: string;
      subCategories: Array<{
        id: string;
        name: string;
        description?: string;
        is_active: boolean;
      }>;
    }>;
  };
  isNew: boolean;
  onDelete: (domainGroupId: string) => void;
}

const DomainGroupCard: React.FC<DomainGroupCardProps> = ({
  domainGroup,
  isNew,
  onDelete
}) => {
  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm relative">
      {/* New indicator */}
      {isNew && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-green-500 text-white animate-pulse flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            NEW
          </Badge>
        </div>
      )}
      
      {/* Domain Group Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">{domainGroup.name}</h3>
            <Badge variant={domainGroup.is_active ? "default" : "secondary"}>
              {domainGroup.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {domainGroup.description && (
            <p className="text-muted-foreground mb-2">{domainGroup.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              {domainGroup.categories.length} Categories
            </span>
            <span>
              {domainGroup.categories.reduce((sum, cat) => sum + cat.subCategories.length, 0)} Sub-Categories
            </span>
            <span className="text-xs">
              Created: {new Date(domainGroup.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(domainGroup.id)}
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
            <CategoryAccordionItem
              key={category.id}
              category={category}
              categoryIndex={categoryIndex}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default DomainGroupCard;
