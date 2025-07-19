
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SupportTypesManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Support Types Manager</h2>
        <p className="text-muted-foreground">Manage support service types and service levels</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Support Types management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTypesManager;
