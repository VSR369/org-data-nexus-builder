import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TeamUnitsManager: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Units Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Team Units management interface will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

export default TeamUnitsManager;