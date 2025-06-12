
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderTree } from 'lucide-react';

const EmptyHierarchyState: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderTree className="w-5 h-5" />
          Domain Group Hierarchies
        </CardTitle>
        <CardDescription>
          No domain group hierarchies configured yet. Use the wizard above to create your first hierarchy.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default EmptyHierarchyState;
