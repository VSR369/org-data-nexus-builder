
import React from 'react';
import { Building2 } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const OrganizationTypesManager: React.FC = () => {
  return (
    <StandardDataManager
      tableName="master_organization_types"
      title="Organization Types Manager"
      description="Manage organization types and business classifications"
      icon={Building2}
    />
  );
};

export default OrganizationTypesManager;
