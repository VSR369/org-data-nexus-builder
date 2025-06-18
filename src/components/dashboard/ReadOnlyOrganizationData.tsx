
import React from 'react';
import OrganizationInfoCard from './OrganizationInfoCard';
import MembershipDetailsCard from './MembershipDetailsCard';
import EngagementModelStatusCard from './EngagementModelStatusCard';

const ReadOnlyOrganizationData: React.FC = () => {
  return (
    <div className="space-y-6">
      <OrganizationInfoCard />
      <MembershipDetailsCard />
      <EngagementModelStatusCard />
    </div>
  );
};

export default ReadOnlyOrganizationData;
