
import React, { useState, useEffect } from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { checkLifeSciencesExists } from './lifeSciencesExistenceChecker';
import HierarchyExistsMessage from './HierarchyExistsMessage';
import DomainGroupForm from './DomainGroupForm';

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
    console.log('🔄 Checking for existing hierarchies...');
    console.log('📊 Current data state:', {
      domainGroups: data.domainGroups?.length || 0,
      categories: data.categories?.length || 0,
      subCategories: data.subCategories?.length || 0
    });

    const exists = data.domainGroups && data.domainGroups.length > 0;
    setHierarchyExists(exists);
    
    console.log('📊 Hierarchy existence result:', exists);
  }, [data, forceRefresh]);

  const handleDataUpdate = (newData: DomainGroupsData) => {
    console.log('🔄 Data update received');
    onDataUpdate(newData);
    setForceRefresh(prev => prev + 1);
  };

  console.log('🎯 Render decision:', {
    hierarchyExists,
    dataHasDomainGroups: data.domainGroups?.length > 0
  });

  // Show exists message if hierarchy exists
  if (hierarchyExists) {
    return <HierarchyExistsMessage data={data} />;
  }

  // Show simple domain group creation form
  return (
    <DomainGroupForm 
      data={data} 
      onDataUpdate={handleDataUpdate}
    />
  );
};

export default BulkDomainGroupCreator;
