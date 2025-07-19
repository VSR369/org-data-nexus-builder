
import React from 'react';
import { GitBranch } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const EngagementModelSubtypesManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'required_fields',
      header: 'Required Fields',
      cell: ({ row }: any) => {
        const fields = row.getValue('required_fields') || [];
        return (
          <div className="text-sm">
            {Array.isArray(fields) ? fields.length : 0} fields
          </div>
        );
      },
    },
    {
      accessorKey: 'optional_fields',
      header: 'Optional Fields',
      cell: ({ row }: any) => {
        const fields = row.getValue('optional_fields') || [];
        return (
          <div className="text-sm">
            {Array.isArray(fields) ? fields.length : 0} fields
          </div>
        );
      },
    },
  ];

  return (
    <StandardDataManager
      tableName="master_engagement_model_subtypes"
      title="Engagement Model Subtypes Manager"
      description="Manage engagement model subtypes and their field configurations"
      icon={GitBranch}
      additionalColumns={additionalColumns}
    />
  );
};

export default EngagementModelSubtypesManager;
