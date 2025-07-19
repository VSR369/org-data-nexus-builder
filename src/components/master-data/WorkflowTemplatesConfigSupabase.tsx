import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WorkflowTemplatesConfigSupabase: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Workflow Templates Manager</h2>
        <p className="text-muted-foreground">Manage workflow templates and processes</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Workflow Templates management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowTemplatesConfigSupabase;