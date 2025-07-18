
import React from 'react';
import { MembershipWorkflow } from './MembershipWorkflow';

interface MembershipDashboardProps {
  userId: string;
}

export const MembershipDashboard: React.FC<MembershipDashboardProps> = ({ userId }) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <MembershipWorkflow userId={userId} />
    </div>
  );
};
