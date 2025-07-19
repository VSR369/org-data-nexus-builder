
import React from 'react';
import { Target } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const CapabilityLevelsManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'min_score',
      header: 'Min Score',
      cell: ({ row }: any) => (
        <div className="text-sm font-mono">
          {row.getValue('min_score')}
        </div>
      ),
    },
    {
      accessorKey: 'max_score',
      header: 'Max Score', 
      cell: ({ row }: any) => (
        <div className="text-sm font-mono">
          {row.getValue('max_score')}
        </div>
      ),
    },
    {
      accessorKey: 'color',
      header: 'Color',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: row.getValue('color') }}
          />
          <span className="text-sm font-mono">{row.getValue('color')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'order_index',
      header: 'Order',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('order_index')}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_capability_levels"
      title="Capability Levels Manager"
      description="Manage capability levels and scoring ranges"
      icon={Target}
      additionalColumns={additionalColumns}
    />
  );
};

export default CapabilityLevelsManager;
