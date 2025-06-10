
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domainGroupsDataManager';
import { createLifeSciencesHierarchyData } from './lifeSciencesHierarchyData';

interface BulkCreationFormProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
}

const BulkCreationForm: React.FC<BulkCreationFormProps> = ({ data, onDataUpdate }) => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createLifeSciencesHierarchy = () => {
    setIsCreating(true);
    
    const { newDomainGroups, newCategories, newSubCategories } = createLifeSciencesHierarchyData();

    // Update data
    const updatedData = {
      domainGroups: [...data.domainGroups, ...newDomainGroups],
      categories: [...data.categories, ...newCategories],
      subCategories: [...data.subCategories, ...newSubCategories]
    };
    
    onDataUpdate(updatedData);
    domainGroupsDataManager.saveData(updatedData);
    
    setIsCreating(false);
    
    toast({
      title: "Success",
      description: `Created complete Life Sciences hierarchy: 4 domain groups, 12 categories, and 48 sub-categories`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Bulk Create Life Sciences Hierarchy
        </CardTitle>
        <CardDescription>
          Create the complete Life Sciences domain group hierarchy with all groups, categories, and sub-categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            This will create:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>4 Domain Groups (Strategy, Operations, People & Culture, Technology)</li>
              <li>12 Categories across all groups</li>
              <li>48 Sub-categories with detailed descriptions</li>
            </ul>
          </div>
          
          <Button 
            onClick={createLifeSciencesHierarchy} 
            disabled={isCreating}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isCreating ? 'Creating Hierarchy...' : 'Create Life Sciences Hierarchy'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkCreationForm;
