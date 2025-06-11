
import React, { useState, useEffect } from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { checkLifeSciencesExists } from './lifeSciencesExistenceChecker';
import HierarchyExistsMessage from './HierarchyExistsMessage';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createLifeSciencesHierarchyData } from './lifeSciencesHierarchyData';
import { Zap, Building2 } from 'lucide-react';

interface BulkDomainGroupCreatorProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
}

const BulkDomainGroupCreator: React.FC<BulkDomainGroupCreatorProps> = ({ 
  data, 
  onDataUpdate 
}) => {
  const [forceRefresh, setForceRefresh] = useState(0);
  const [hierarchyExists, setHierarchyExists] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Check if any domain groups exist
  useEffect(() => {
    console.log('🔄 BulkDomainGroupCreator: Checking for existing hierarchies...');
    console.log('📊 BulkDomainGroupCreator: Current data state:', {
      domainGroups: data.domainGroups?.length || 0,
      categories: data.categories?.length || 0,
      subCategories: data.subCategories?.length || 0
    });

    const exists = data.domainGroups && data.domainGroups.length > 0;
    setHierarchyExists(exists);
    
    console.log('📊 BulkDomainGroupCreator: Hierarchy existence result:', exists);
  }, [data, forceRefresh]);

  const handleCreateLifeSciencesHierarchy = async () => {
    setIsCreating(true);
    console.log('🚀 Creating Life Sciences hierarchy...');
    
    try {
      const { newDomainGroups, newCategories, newSubCategories } = createLifeSciencesHierarchyData();
      
      const updatedData: DomainGroupsData = {
        domainGroups: [...data.domainGroups, ...newDomainGroups],
        categories: [...data.categories, ...newCategories],
        subCategories: [...data.subCategories, ...newSubCategories]
      };
      
      console.log('✅ Life Sciences hierarchy created:', {
        newDomainGroups: newDomainGroups.length,
        newCategories: newCategories.length,
        newSubCategories: newSubCategories.length,
        totalDomainGroups: updatedData.domainGroups.length,
        totalCategories: updatedData.categories.length,
        totalSubCategories: updatedData.subCategories.length
      });
      
      onDataUpdate(updatedData);
      setForceRefresh(prev => prev + 1);
    } catch (error) {
      console.error('❌ Error creating Life Sciences hierarchy:', error);
    } finally {
      setIsCreating(false);
    }
  };

  console.log('🎯 BulkDomainGroupCreator: Render decision:', {
    hierarchyExists,
    dataHasDomainGroups: data.domainGroups?.length > 0
  });

  // Only show the hierarchy exists message if hierarchy exists
  if (hierarchyExists) {
    return <HierarchyExistsMessage data={data} />;
  }

  // Show Life Sciences quick creation option when no hierarchies exist
  return (
    <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Quick Setup: Life Sciences Hierarchy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Get started quickly with a comprehensive Life Sciences & Pharma competency hierarchy. This includes:
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="font-medium">4 Domain Groups</span>
            </div>
            <ul className="text-xs text-muted-foreground ml-6 space-y-1">
              <li>• Strategy, Innovation & Growth</li>
              <li>• Operations, Delivery, Risk & Sustainability</li>
              <li>• People, Culture & Change</li>
              <li>• Technology & Digital Transformation</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">13 Categories</Badge>
              <Badge variant="outline" className="text-xs">52 Sub-categories</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Comprehensive competency areas covering R&D, clinical trials, manufacturing, 
              regulatory affairs, digital health, and more.
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleCreateLifeSciencesHierarchy}
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? 'Creating Life Sciences Hierarchy...' : 'Create Life Sciences Hierarchy'}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          This will automatically create a complete hierarchy for Life Sciences industry segment. 
          You can modify or add more later.
        </p>
      </CardContent>
    </Card>
  );
};

export default BulkDomainGroupCreator;
