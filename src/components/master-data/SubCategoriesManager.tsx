
import React from 'react';
import { Tags } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const SubCategoriesManager: React.FC = () => {
  return (
    <StandardDataManager
      tableName="master_sub_categories"
      title="Sub-Categories Manager"
      description="Manage sub-categories within categories for detailed classification"
      icon={Tags}
    />
  );
};

export default SubCategoriesManager;
