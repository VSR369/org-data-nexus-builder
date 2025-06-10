
import React, { useState, useEffect } from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { checkLifeSciencesExists } from './lifeSciencesExistenceChecker';
import HierarchyExistsMessage from './HierarchyExistsMessage';
import BulkCreationForm from './BulkCreationForm';

interface BulkDomainGroupCreatorProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
}

const BulkDomainGroupCreator: React.FC<BulkDomainGroupCreatorProps> = ({ 
  data, 
  onDataUpdate 
}) => {
  const [forceRefresh, setForceRefresh] = useState(0);
  const [lifeSciencesExists, setLifeSciencesExists] = useState(false);
  const [hierarchyCreated, setHierarchyCreated] = useState(false);

  // Enhanced existence checking with better logging
  useEffect(() => {
    console.log('🔄 BulkDomainGroupCreator: Enhanced existence check triggered...');
    console.log('📊 Current data state:', {
      domainGroups: data.domainGroups?.length || 0,
      categories: data.categories?.length || 0,
      subCategories: data.subCategories?.length || 0,
      forceRefresh,
      hierarchyCreated
    });

    const exists = checkLifeSciencesExists(data);
    setLifeSciencesExists(exists);
    
    console.log('📊 Life Sciences existence result:', {
      exists,
      previousState: lifeSciencesExists,
      hierarchyCreated,
      forceRefresh
    });

    // If hierarchy was just created, ensure we show the exists message
    if (hierarchyCreated && exists) {
      console.log('✅ Hierarchy was created and exists - showing exists message');
    }
  }, [data, forceRefresh, hierarchyCreated]);

  const handleCreationComplete = (newData: DomainGroupsData) => {
    console.log('✅ Enhanced creation completed - updating state...');
    
    // Immediately update the hierarchyCreated flag
    setHierarchyCreated(true);
    
    // Update parent data
    onDataUpdate(newData);
    
    // Force immediate UI update
    setLifeSciencesExists(true);
    
    // Force refresh to re-check existence
    setForceRefresh(prev => prev + 1);
    
    console.log('🎯 All states updated - hierarchy should now show as existing');
  };

  const handleDataUpdate = (newData: DomainGroupsData) => {
    console.log('🔄 BulkDomainGroupCreator: Enhanced data update...');
    onDataUpdate(newData);
    setForceRefresh(prev => prev + 1);
  };

  console.log('🎯 BulkDomainGroupCreator render decision:', {
    lifeSciencesExists,
    hierarchyCreated,
    forceRefresh,
    dataHasDomainGroups: data.domainGroups?.length > 0,
    showExistsMessage: lifeSciencesExists || hierarchyCreated
  });

  // Show exists message if hierarchy exists OR was just created
  if (lifeSciencesExists || hierarchyCreated) {
    return <HierarchyExistsMessage data={data} />;
  }

  return (
    <BulkCreationForm 
      data={data} 
      onDataUpdate={handleDataUpdate}
      onCreationComplete={handleCreationComplete}
    />
  );
};

export default BulkDomainGroupCreator;
