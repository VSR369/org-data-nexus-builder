
import React from 'react';
import { Building } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const EntityTypesManager: React.FC = () => {
  return (
    <StandardDataManager
      tableName="master_entity_types"
      title="Entity Types Manager"
      description="Manage legal entity types for organization classification"
      icon={Building}
    />
  );
};

export default EntityTypesManager;
