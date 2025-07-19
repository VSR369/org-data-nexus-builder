
import React from 'react';
import { Calendar } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const BillingFrequenciesManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'months',
      header: 'Months',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('months') || 'N/A'} months
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_billing_frequencies"
      title="Billing Frequencies Manager"
      description="Manage billing frequency options and cycles"
      icon={Calendar}
      additionalColumns={additionalColumns}
    />
  );
};

export default BillingFrequenciesManager;
