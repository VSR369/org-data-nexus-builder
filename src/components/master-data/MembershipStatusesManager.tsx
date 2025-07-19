
import React from 'react';
import { UserCheck } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const MembershipStatusesManager: React.FC = () => {
  return (
    <StandardDataManager
      tableName="master_membership_statuses"
      title="Membership Statuses Manager"
      description="Manage membership status types and user classifications"
      icon={UserCheck}
    />
  );
};

export default MembershipStatusesManager;
