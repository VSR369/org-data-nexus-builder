
import React from 'react';

interface MembershipFeeEntry {
  id: string;
  country: string;
  entityType: string;
  quarterlyAmount: number;
  quarterlyCurrency: string;
  halfYearlyAmount: number;
  halfYearlyCurrency: string;
  annualAmount: number;
  annualCurrency: string;
}

interface DebugInfoPanelProps {
  entityTypes: string[];
  membershipFees: MembershipFeeEntry[];
}

const DebugInfoPanel = ({ entityTypes, membershipFees }: DebugInfoPanelProps) => {
  return (
    <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="font-medium text-blue-800">Debug Information:</h4>
      <p className="text-sm text-blue-700">Entity Types Available: {entityTypes.length} ({entityTypes.join(', ')})</p>
      <p className="text-sm text-blue-700">Membership Fees Loaded: {membershipFees.length}</p>
      {membershipFees.length > 0 && (
        <div className="text-sm text-blue-700">
          <p>Available Fee Configurations:</p>
          <ul className="list-disc list-inside ml-4">
            {membershipFees.map(fee => (
              <li key={fee.id}>
                {fee.country} - {fee.entityType}: Q{fee.quarterlyAmount} {fee.quarterlyCurrency}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DebugInfoPanel;
