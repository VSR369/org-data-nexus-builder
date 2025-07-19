
import React from 'react';
import { Settings } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const SystemConfigurationsManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'config_key',
      header: 'Config Key',
      cell: ({ row }: any) => (
        <div className="font-mono text-sm">
          {row.getValue('config_key')}
        </div>
      ),
    },
    {
      accessorKey: 'config_value',
      header: 'Config Value',
      cell: ({ row }: any) => (
        <div className="text-sm max-w-xs truncate">
          {row.getValue('config_value')}
        </div>
      ),
    },
    {
      accessorKey: 'data_type',
      header: 'Data Type',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('data_type')}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('category')}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_system_configurations"
      title="System Configurations Manager"
      description="Manage system configuration parameters and settings"
      icon={Settings}
      additionalColumns={additionalColumns}
    />
  );
};

export default SystemConfigurationsManager;
