import React from 'react';
import OrganizationDashboard from '@/components/dashboard/OrganizationDashboard';
import RouteGuard from '@/components/auth/RouteGuard';

const SeekingOrgAdminDashboard = () => {
  return (
    <RouteGuard requireAuth={true} redirectTo="/general-signin">
      <OrganizationDashboard />
    </RouteGuard>
  );
};

export default SeekingOrgAdminDashboard;