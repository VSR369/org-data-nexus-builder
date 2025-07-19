
import React from 'react';
import { Calculator } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const PlatformFeeFormulasManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'formula_name',
      header: 'Formula Name',
      cell: ({ row }: any) => (
        <div className="text-sm font-medium">
          {row.getValue('formula_name')}
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
      accessorKey: 'country_name',
      header: 'Country',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('country_name') || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'base_consulting_fee',
      header: 'Base Consulting Fee',
      cell: ({ row }: any) => (
        <div className="text-sm font-mono">
          {row.getValue('base_consulting_fee') || 0}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_platform_fee_formulas"
      title="Platform Fee Formulas Manager"
      description="Manage platform fee calculation formulas and parameters"
      icon={Calculator}
      additionalColumns={additionalColumns}
    />
  );
};

export default PlatformFeeFormulasManager;
