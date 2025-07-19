import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SubCategoriesConfigSupabase: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sub-Categories Manager</h2>
        <p className="text-muted-foreground">Manage sub-categories within categories for detailed classification</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Sub-Categories management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubCategoriesConfigSupabase;