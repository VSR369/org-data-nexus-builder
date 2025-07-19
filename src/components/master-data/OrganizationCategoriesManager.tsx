
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OrganizationCategoriesManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Organization Categories Manager</h2>
        <p className="text-muted-foreground">Manage organization categories and workflow configurations</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Organization Categories management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationCategoriesManager;
