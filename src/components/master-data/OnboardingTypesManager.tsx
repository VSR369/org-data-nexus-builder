
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OnboardingTypesManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Onboarding Types Manager</h2>
        <p className="text-muted-foreground">Manage onboarding service types and configurations</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Onboarding Types management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingTypesManager;
