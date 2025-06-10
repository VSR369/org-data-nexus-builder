
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from 'lucide-react';

const HierarchyExistsMessage: React.FC = () => {
  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-green-900">Life Sciences Hierarchy Already Created</h3>
            <p className="text-sm text-green-700">
              The Life Sciences domain group hierarchy is already configured and ready for use. 
              You can view and manage it in the hierarchies section below.
            </p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Already Available
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default HierarchyExistsMessage;
