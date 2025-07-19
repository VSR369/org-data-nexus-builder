import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CommunicationTypesManager: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication Types Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Communication Types management interface will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

export default CommunicationTypesManager;