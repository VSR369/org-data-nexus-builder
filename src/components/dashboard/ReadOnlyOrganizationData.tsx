
import React from 'react';
import OrganizationInfoCard from './OrganizationInfoCard';
import MembershipDetailsCard from './MembershipDetailsCard';

interface ReadOnlyOrganizationDataProps {
  onJoinAsMember?: () => void;
}

const ReadOnlyOrganizationData: React.FC<ReadOnlyOrganizationDataProps> = ({
  onJoinAsMember
}) => {
  return (
    <div className="space-y-6">
      <OrganizationInfoCard />
      <MembershipDetailsCard 
        onJoinAsMember={onJoinAsMember}
      />
    </div>
  );
};

export default ReadOnlyOrganizationData;
