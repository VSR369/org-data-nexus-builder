import React from 'react';
import { safeRender, getIndustrySegmentDisplayName } from '../utils/viewDetailsHelpers';
import type { SeekerDetails } from '../types';

interface OrganizationInfoSectionProps {
  seeker: SeekerDetails;
  isMobile?: boolean;
}

const OrganizationInfoSection: React.FC<OrganizationInfoSectionProps> = ({ seeker, isMobile }) => {
  return (
    <div className={`space-y-${isMobile ? "4" : "6"}`}>
      {/* Basic Information */}
      <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Organization Details</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Name:</span> {safeRender(seeker.organizationName)}</div>
            <div><span className="font-medium">Type:</span> {safeRender(seeker.organizationType)}</div>
            <div><span className="font-medium">Entity:</span> {safeRender(seeker.entityType)}</div>
            <div><span className="font-medium">Country:</span> {safeRender(seeker.country)}</div>
            <div><span className="font-medium">Industry:</span> {getIndustrySegmentDisplayName(seeker.industrySegment)}</div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Contact Information</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Contact Person:</span> {safeRender(seeker.contactPersonName)}</div>
            <div><span className="font-medium">Email:</span> {safeRender(seeker.email)}</div>
            <div><span className="font-medium">User ID:</span> {safeRender(seeker.userId)}</div>
            <div><span className="font-medium">Org ID:</span> {safeRender(seeker.organizationId)}</div>
          </div>
        </div>
      </div>

      {/* Registration Information */}
      <div>
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Registration Details</h4>
        <div className={`bg-gray-50 p-3 rounded text-sm space-y-1 ${isMobile ? "text-xs" : ""}`}>
          <div><span className="font-medium">Registered:</span> {new Date(seeker.registrationTimestamp).toLocaleString()}</div>
          <div><span className="font-medium">Last Login:</span> {seeker.lastLoginTimestamp ? new Date(seeker.lastLoginTimestamp).toLocaleString() : 'Never'}</div>
          <div><span className="font-medium">Version:</span> {seeker.version}</div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationInfoSection;