
import React from 'react';
import { Workflow } from 'lucide-react';
import { StandardDataManager } from './StandardDataManager';

const WorkflowTemplatesManager: React.FC = () => {
  return (
    <StandardDataManager
      tableName="master_workflow_templates"
      title="Workflow Templates Manager"
      description="Manage workflow templates and process configurations"
      icon={Workflow}
    />
  );
};

export default WorkflowTemplatesManager;
