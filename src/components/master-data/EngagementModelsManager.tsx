
import React from 'react';
import { Handshake } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const EngagementModelsManager: React.FC = () => {
  return (
    <StandardDataManager
      tableName="master_engagement_models"
      title="Engagement Models Manager"
      description="Manage engagement models for solution provider interactions"
      icon={Handshake}
    />
  );
};

export default EngagementModelsManager;
