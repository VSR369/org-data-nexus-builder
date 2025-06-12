
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderTree } from 'lucide-react';

const EmptyStateDisplay: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="w-5 h-5" />
            Configured Domain Group Hierarchies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FolderTree className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Domain Groups Configured</h3>
            <p className="text-muted-foreground">
              No domain group hierarchies have been configured yet. Please create some domain groups first.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyStateDisplay;
