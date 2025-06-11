
import React, { useState, useEffect } from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { checkLifeSciencesExists } from './lifeSciencesExistenceChecker';
import HierarchyExistsMessage from './HierarchyExistsMessage';

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

  const handleDataUpdate = (newData: DomainGroupsData) => {
    console.log('🔄 BulkDomainGroupCreator: Data update received');
    onDataUpdate(newData);
    setForceRefresh(prev => prev + 1);
  };

  console.log('🎯 BulkDomainGroupCreator: Render decision:', {
    hierarchyExists,
    dataHasDomainGroups: data.domainGroups?.length > 0
  });

  // Only show the hierarchy exists message if hierarchy exists
  // Don't render anything if no hierarchy exists - let DomainGroupsConfig handle the creation form
  if (hierarchyExists) {
    return <HierarchyExistsMessage data={data} />;
  }

  // Return null when no hierarchies exist - DomainGroupsConfig will handle showing the creation form
  return null;
};

export default BulkDomainGroupCreator;
