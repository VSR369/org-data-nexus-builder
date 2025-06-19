
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export const EngagementModelLoadingState: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p>Loading engagement models and pricing...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
