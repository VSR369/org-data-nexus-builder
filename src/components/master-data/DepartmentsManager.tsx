
import React from 'react';
import { Users } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const DepartmentsManager: React.FC = () => {
  return (
    <StandardDataManager
      tableName="master_departments"
      title="Departments Manager"
      description="Manage organizational departments and functional units"
      icon={Users}
    />
  );
};

export default DepartmentsManager;
