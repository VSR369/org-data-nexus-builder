
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CreditCard } from "lucide-react";

export const NoEngagementSelected: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight whitespace-nowrap">
          <CreditCard className="w-5 h-5" />
          Engagement Activation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Please select an engagement model to continue</p>
        </div>
      </CardContent>
    </Card>
  );
};
