
import React from 'react';
import { Users2 } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const TeamUnitsManager: React.FC = () => {
  return (
    <StandardDataManager
      tableName="master_team_units"
      title="Team Units Manager"
      description="Manage team units within sub-departments"
      icon={Users2}
    />
  );
};

export default TeamUnitsManager;
