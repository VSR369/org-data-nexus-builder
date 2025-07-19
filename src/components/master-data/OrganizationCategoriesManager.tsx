
import React from 'react';
import { Building } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const OrganizationCategoriesManager: React.FC = () => {
  const additionalColumns = [
    {
      accessorKey: 'category_type',
      header: 'Category Type',
      cell: ({ row }: any) => (
        <div className="text-sm font-medium">
          {row.getValue('category_type')}
        </div>
      ),
    },
    {
      accessorKey: 'workflow_config',
      header: 'Workflow Config',
      cell: ({ row }: any) => {
        const config = row.getValue('workflow_config');
        return (
          <div className="text-sm">
            {config && typeof config === 'object' ? 'Configured' : 'None'}
          </div>
        );
      },
    },
  ];

  return (
    <StandardDataManager
      tableName="master_organization_categories"
      title="Organization Categories Manager"
      description="Manage organization categories and workflow configurations"
      icon={Building}
      additionalColumns={additionalColumns}
    />
  );
};

export default OrganizationCategoriesManager;
