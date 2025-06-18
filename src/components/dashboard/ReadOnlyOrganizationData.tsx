
import React from 'react';
import OrganizationInfoCard from './OrganizationInfoCard';
import MembershipDetailsCard from './MembershipDetailsCard';
import EngagementModelStatusCard from './EngagementModelStatusCard';

interface ReadOnlyOrganizationDataProps {
  onJoinAsMember?: () => void;
  onSelectEngagementModel?: () => void;
}

const ReadOnlyOrganizationData: React.FC<ReadOnlyOrganizationDataProps> = ({
  onJoinAsMember,
  onSelectEngagementModel
}) => {
  return (
    <div className="space-y-6">
      <OrganizationInfoCard />
      <MembershipDetailsCard 
        onJoinAsMember={onJoinAsMember}
      />
      <EngagementModelStatusCard 
        onSelectEngagementModel={onSelectEngagementModel}
      />
    </div>
  );
};

export default ReadOnlyOrganizationData;
