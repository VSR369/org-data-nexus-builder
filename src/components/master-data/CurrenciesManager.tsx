import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CurrenciesManager: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Currencies Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Currencies management interface will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

export default CurrenciesManager;