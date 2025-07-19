
import React from 'react';
import { Calculator } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const FeeComponentsManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'component_type',
      header: 'Component Type',
      cell: ({ row }: any) => (
        <div className="text-sm font-medium">
          {row.getValue('component_type') || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'default_rate_type',
      header: 'Rate Type',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('default_rate_type') || 'currency'}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_fee_components"
      title="Fee Components Manager"
      description="Manage fee components for pricing calculations"
      icon={Calculator}
      additionalColumns={additionalColumns}
    />
  );
};

export default FeeComponentsManager;
