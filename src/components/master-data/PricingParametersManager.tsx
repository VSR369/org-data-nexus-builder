
import React from 'react';
import { DollarSign } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const PricingParametersManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }: any) => (
        <div className="text-sm font-mono">
          {row.getValue('amount')}
        </div>
      ),
    },
    {
      accessorKey: 'rate_type',
      header: 'Rate Type',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('rate_type')}
        </div>
      ),
    },
    {
      accessorKey: 'complexity_applicable',
      header: 'Complexity Applicable',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('complexity_applicable') ? 'Yes' : 'No'}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_pricing_parameters"
      title="Pricing Parameters Manager"
      description="Manage pricing parameters and rate configurations"
      icon={DollarSign}
      additionalColumns={additionalColumns}
    />
  );
};

export default PricingParametersManager;
