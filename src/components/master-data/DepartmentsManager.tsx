import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DepartmentsManager: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Departments Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Departments management interface will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

export default DepartmentsManager;