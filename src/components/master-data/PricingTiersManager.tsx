
import React from 'react';
import { Crown } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const PricingTiersManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'level_order',
      header: 'Level Order',
      cell: ({ row }: any) => (
        <div className="text-sm font-mono">
          {row.getValue('level_order')}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_pricing_tiers"
      title="Pricing Tiers Manager"
      description="Manage pricing tiers and subscription levels"
      icon={Crown}
      additionalColumns={additionalColumns}
    />
  );
};

export default PricingTiersManager;
