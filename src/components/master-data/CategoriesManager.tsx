
import React from 'react';
import { Tag } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const CategoriesManager: React.FC = () => {
  return (
    <StandardDataManager
      tableName="master_categories"
      title="Categories Manager"
      description="Manage categories within domain groups for solution classification"
      icon={Tag}
    />
  );
};

export default CategoriesManager;
