import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CategoriesManager: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Categories management interface will be implemented here.</p>
      </CardContent>
    </Card>
  );
};

export default CategoriesManager;