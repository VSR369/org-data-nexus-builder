
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const CommunicationTypesManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'link',
      header: 'Link',
      cell: ({ row }: any) => (
        <div className="text-sm font-mono max-w-xs truncate">
          {row.getValue('link') || 'N/A'}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_communication_types"
      title="Communication Types Manager"
      description="Manage communication channels and contact methods"
      icon={MessageSquare}
      additionalColumns={additionalColumns}
    />
  );
};

export default CommunicationTypesManager;
