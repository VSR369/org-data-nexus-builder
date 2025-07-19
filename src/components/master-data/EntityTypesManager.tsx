import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EntityTypesManager: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entity Types Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Entity Types management interface will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

export default EntityTypesManager;