import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MembershipStatusesConfigSupabase: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Membership Statuses Manager</h2>
        <p className="text-muted-foreground">Manage membership status types and levels</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Membership Statuses management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipStatusesConfigSupabase;