
import React from 'react';
import { DollarSign } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const CurrenciesManager: React.FC = () => {
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
    {
      accessorKey: 'symbol',
      header: 'Symbol',
      cell: ({ row }: any) => (
        <div className="font-mono text-sm">
          {row.getValue('symbol') || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('country') || 'N/A'}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_currencies"
      title="Currencies Manager"
      description="Manage currency master data and exchange rate configurations"
      icon={DollarSign}
      additionalColumns={additionalColumns}
    />
  );
};

export default CurrenciesManager;
