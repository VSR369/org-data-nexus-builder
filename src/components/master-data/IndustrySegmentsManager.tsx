
import React from 'react';
import { Factory } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const IndustrySegmentsManager: React.FC = () => {
  return (
    <StandardDataManager
      tableName="master_industry_segments"
      title="Industry Segments Manager"
      description="Manage industry segments for business categorization"
      icon={Factory}
    />  
  );
};

export default IndustrySegmentsManager;
