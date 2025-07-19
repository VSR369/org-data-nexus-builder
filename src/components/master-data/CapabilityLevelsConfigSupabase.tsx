import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CapabilityLevelsConfigSupabase: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Capability Levels Manager</h2>
        <p className="text-muted-foreground">Manage capability maturity levels and assessments</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Capability Levels management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CapabilityLevelsConfigSupabase;