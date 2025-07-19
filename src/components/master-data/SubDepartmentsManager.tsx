
import React from 'react';
import { UserPlus } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const SubDepartmentsManager: React.FC = () => {
  return (
    <StandardDataManager
      tableName="master_sub_departments"
      title="Sub-Departments Manager"
      description="Manage sub-departments within organizational departments"
      icon={UserPlus}
    />
  );
};

export default SubDepartmentsManager;
