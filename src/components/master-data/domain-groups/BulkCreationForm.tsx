
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Upload, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DomainGroupsData } from '@/types/domainGroups';
import { domainGroupsDataManager } from './domainGroupsDataManager';
import { createLifeSciencesHierarchyData } from './lifeSciencesHierarchyData';

interface BulkCreationFormProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
  onCreationComplete?: (newData: DomainGroupsData) => void;
}

const BulkCreationForm: React.FC<BulkCreationFormProps> = ({ 
  data, 
  onDataUpdate, 
  onCreationComplete 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const { toast } = useToast();

  const createLifeSciencesHierarchy = async () => {
    console.log('🚀 Enhanced Life Sciences hierarchy creation starting...');
    setIsCreating(true);
    
    try {
      const { newDomainGroups, newCategories, newSubCategories } = createLifeSciencesHierarchyData();

      console.log('📦 Created enhanced hierarchy data:', {
        domainGroups: newDomainGroups.length,
        categories: newCategories.length,
        subCategories: newSubCategories.length,
        details: {
          domainGroups: newDomainGroups.map(dg => ({ id: dg.id, name: dg.name })),
          categoriesCount: newCategories.length,
          subCategoriesCount: newSubCategories.length
        }
      });

      // Merge with existing data (in case there are other industry segments)
      const updatedData = {
        domainGroups: [...data.domainGroups, ...newDomainGroups],
        categories: [...data.categories, ...newCategories],
        subCategories: [...data.subCategories, ...newSubCategories]
      };
      
      console.log('💾 Saving enhanced data to storage...');
      console.log('📊 Final data structure:', {
        totalDomainGroups: updatedData.domainGroups.length,
        totalCategories: updatedData.categories.length,
        totalSubCategories: updatedData.subCategories.length
      });

      // Save to storage
      domainGroupsDataManager.saveData(updatedData);
      
      console.log('🔄 Updating parent component state...');
      onDataUpdate(updatedData);
      
      // Mark as successful
      setCreationSuccess(true);
      
      // Call completion callback with the new data
      if (onCreationComplete) {
        console.log('✅ Calling onCreationComplete with new data...');
        onCreationComplete(updatedData);
      }
      
      toast({
        title: "Success! 🎉",
        description: `Life Sciences hierarchy created successfully: ${newDomainGroups.length} domain groups, ${newCategories.length} categories, and ${newSubCategories.length} sub-categories`,
      });

      console.log('✅ Enhanced Life Sciences hierarchy creation completed successfully');
      
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

  // If creation was successful, show a success state briefly before hiding
  if (creationSuccess) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-green-900">Life Sciences Hierarchy Created Successfully!</h3>
              <p className="text-sm text-green-700 mt-1">
                The complete hierarchy has been created and saved. You can now view it in the expandable sections below.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
