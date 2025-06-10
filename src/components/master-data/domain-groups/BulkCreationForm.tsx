
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
  onCreationComplete?: () => void;
}

const BulkCreationForm: React.FC<BulkCreationFormProps> = ({ 
  data, 
  onDataUpdate, 
  onCreationComplete 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createLifeSciencesHierarchy = async () => {
    console.log('🚀 Starting Life Sciences hierarchy creation...');
    setIsCreating(true);
    
    try {
      const { newDomainGroups, newCategories, newSubCategories } = createLifeSciencesHierarchyData();

      console.log('📦 Created hierarchy data:', {
        domainGroups: newDomainGroups.length,
        categories: newCategories.length,
        subCategories: newSubCategories.length
      });

      // Update data with new hierarchy
      const updatedData = {
        domainGroups: [...data.domainGroups, ...newDomainGroups],
        categories: [...data.categories, ...newCategories],
        subCategories: [...data.subCategories, ...newSubCategories]
      };
      
      console.log('💾 Saving updated data to storage...');
      domainGroupsDataManager.saveData(updatedData);
      
      console.log('🔄 Updating parent component state...');
      onDataUpdate(updatedData);
      
      // Call completion callback to trigger immediate UI update
      if (onCreationComplete) {
        onCreationComplete();
      }
      
      toast({
        title: "Success",
        description: `Created complete Life Sciences hierarchy: ${newDomainGroups.length} domain groups, ${newCategories.length} categories, and ${newSubCategories.length} sub-categories`,
      });

      console.log('✅ Life Sciences hierarchy creation completed successfully');
      
    } catch (error) {
      console.error('❌ Error creating Life Sciences hierarchy:', error);
      toast({
        title: "Error",
        description: "Failed to create Life Sciences hierarchy. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
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
