
import React from 'react';
import { Globe } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const CountriesManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }: any) => (
        <div className="font-mono text-sm">
          {row.getValue('code') || 'N/A'}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_countries"
      title="Countries Manager"
      description="Manage country master data and regional configurations"
      icon={Globe}
      additionalColumns={additionalColumns}
    />
  );
};

export default CountriesManager;
