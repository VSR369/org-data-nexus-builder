
import React from 'react';
import { Lock } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const TierEngagementModelAccessManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'pricing_tier_name',
      header: 'Pricing Tier',
      cell: ({ row }: any) => (
        <div className="text-sm font-medium">
          {row.getValue('pricing_tier_name') || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'engagement_model_name',
      header: 'Engagement Model',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('engagement_model_name') || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'is_allowed',
      header: 'Allowed',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('is_allowed') ? 'Yes' : 'No'}
        </div>
      ),
    },
    {
      accessorKey: 'is_default',
      header: 'Default',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('is_default') ? 'Yes' : 'No'}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_tier_engagement_model_access"
      title="Tier Engagement Model Access Manager"
      description="Manage engagement model access controls for pricing tiers"
      icon={Lock}
      additionalColumns={additionalColumns}
    />
  );
};

export default TierEngagementModelAccessManager;
