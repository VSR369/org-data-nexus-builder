
import React from 'react';
import { Brain } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const CompetencyCapabilitiesManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.getValue('category') || 'N/A'}
        </div>
      ),
    },
  ];

  return (
    <StandardDataManager
      tableName="master_competency_capabilities"
      title="Competency Capabilities Manager"
      description="Manage competency capabilities and skill assessments"
      icon={Brain}
      additionalColumns={additionalColumns}
    />
  );
};

export default CompetencyCapabilitiesManager;
