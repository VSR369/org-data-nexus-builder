import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SolutionSeekersAdminDashboard from './solution-seekers-admin/SolutionSeekersAdminDashboard';

const SolutionSeekersManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Solution Seekers Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Comprehensive management interface for solution-seeking organizations. View complete organization data, 
            create administrator accounts, and manage organizational access control.
          </p>
          <SolutionSeekersAdminDashboard />
        </CardContent>
      </Card>
    </div>
  );
};

export default SolutionSeekersManager;