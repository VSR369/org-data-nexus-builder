
import React from 'react';

const MembershipBenefitsSection: React.FC = () => {
  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-2">Membership Benefits:</h4>
      <ul className="text-sm text-blue-800 space-y-1">
        <li>• 20% discount on all engagement models</li>
        <li>• Priority support</li>
        <li>• Exclusive member features</li>
        <li>• Access to premium resources</li>
      </ul>
    </div>
  );
};

export default MembershipBenefitsSection;
