
import React from 'react';
import { Ruler } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const UnitsOfMeasureManager: React.FC = () => {
  const additionalColumns = [
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
      accessorKey: 'is_percentage',
      header: 'Percentage',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('is_percentage') ? 'Yes' : 'No'}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_units_of_measure"
      title="Units of Measure Manager"
      description="Manage units of measure for pricing and calculations"
      icon={Ruler}
      additionalColumns={additionalColumns}
    />
  );
};

export default UnitsOfMeasureManager;
