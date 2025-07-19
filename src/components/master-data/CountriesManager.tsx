import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CountriesManager: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Countries Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Countries management interface will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

export default CountriesManager;