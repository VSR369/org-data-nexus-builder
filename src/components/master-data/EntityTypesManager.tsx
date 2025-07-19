
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EntityTypesManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Entity Types Manager</h2>
        <p className="text-muted-foreground">Manage legal entity types for organization classification</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Entity Types management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntityTypesManager;
