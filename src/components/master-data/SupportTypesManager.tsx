
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const SupportTypesManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'service_level',
      header: 'Service Level',
      cell: ({ row }: any) => (
        <div className="text-sm font-medium">
          {row.getValue('service_level')}
        </div>
      ),
    },
    {
      accessorKey: 'response_time',
      header: 'Response Time',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('response_time') || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'availability',
      header: 'Availability',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('availability') || 'N/A'}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_support_types"
      title="Support Types Manager"
      description="Manage support service types and service levels"
      icon={HelpCircle}
      additionalColumns={additionalColumns}
    />
  );
};

export default SupportTypesManager;
