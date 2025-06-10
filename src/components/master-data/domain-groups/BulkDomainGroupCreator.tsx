
import React from 'react';
import { DomainGroupsData } from '@/types/domainGroups';
import { checkLifeSciencesExists } from './lifeSciencesExistenceChecker';
import HierarchyExistsMessage from './HierarchyExistsMessage';
import BulkCreationForm from './BulkCreationForm';

interface BulkDomainGroupCreatorProps {
  data: DomainGroupsData;
  onDataUpdate: (newData: DomainGroupsData) => void;
}

const BulkDomainGroupCreator: React.FC<BulkDomainGroupCreatorProps> = ({ data, onDataUpdate }) => {
  const lifeSciencesExists = checkLifeSciencesExists(data);

  if (lifeSciencesExists) {
    return <HierarchyExistsMessage />;
  }

  return <BulkCreationForm data={data} onDataUpdate={onDataUpdate} />;
};

export default BulkDomainGroupCreator;
