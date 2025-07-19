
import React from 'react';
import { FolderTree } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const DomainGroupsManager: React.FC = () => {
  return (
    <StandardDataManager
      tableName="master_domain_groups"
      title="Domain Groups Manager"
      description="Manage domain groups for categorizing business areas and expertise"
      icon={FolderTree}
    />
  );
};

export default DomainGroupsManager;
