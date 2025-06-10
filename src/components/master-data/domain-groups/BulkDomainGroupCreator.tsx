
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

  // Check existence whenever data changes or force refresh is triggered
  useEffect(() => {
    console.log('🔄 BulkDomainGroupCreator: Checking Life Sciences existence...');
    const exists = checkLifeSciencesExists(data);
    setLifeSciencesExists(exists);
    console.log('📊 Life Sciences exists result:', exists);
  }, [data, forceRefresh]);

  const handleCreationComplete = () => {
    console.log('✅ Creation completed - forcing refresh...');
    // Force a refresh to re-check existence
    setForceRefresh(prev => prev + 1);
    // Immediately set exists to true to hide the form
    setLifeSciencesExists(true);
  };

  const handleDataUpdate = (newData: DomainGroupsData) => {
    console.log('🔄 BulkDomainGroupCreator: Data updated, propagating...');
    onDataUpdate(newData);
    // Force refresh after data update
    setForceRefresh(prev => prev + 1);
  };

  console.log('🎯 BulkDomainGroupCreator render:', {
    lifeSciencesExists,
    forceRefresh,
    dataHasDomainGroups: data.domainGroups?.length > 0
  });

  if (lifeSciencesExists) {
    return <HierarchyExistsMessage />;
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
