
import React from 'react';
import OrganizationInfoCard from './OrganizationInfoCard';

interface ReadOnlyOrganizationDataProps {
  onJoinAsMember?: () => void;
}

const ReadOnlyOrganizationData: React.FC<ReadOnlyOrganizationDataProps> = ({
  onJoinAsMember
}) => {
  return (
    <div className="space-y-6">
      <OrganizationInfoCard />
    </div>
  );
};

export default ReadOnlyOrganizationData;
