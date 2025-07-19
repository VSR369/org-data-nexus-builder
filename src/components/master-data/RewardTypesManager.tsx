
import React from 'react';
import { Gift } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const RewardTypesManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'type',
      header: 'Reward Type',
      cell: ({ row }: any) => (
        <div className="text-sm font-medium">
          {row.getValue('type') || 'N/A'}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_reward_types"
      title="Reward Types Manager"
      description="Manage reward types for incentive programs"
      icon={Gift}
      additionalColumns={additionalColumns}
    />
  );
};

export default RewardTypesManager;
