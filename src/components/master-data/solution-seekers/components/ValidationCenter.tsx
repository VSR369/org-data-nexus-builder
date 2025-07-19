import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, Users } from 'lucide-react';
import type { SeekerDetails } from '../types';

interface ValidationCenterProps {
  seekers: SeekerDetails[];
  isMobile?: boolean;
}

const ValidationCenter: React.FC<ValidationCenterProps> = ({ seekers, isMobile }) => {
  const pendingCount = seekers.filter(s => s.approvalStatus === 'pending').length;
  const approvedCount = seekers.filter(s => s.approvalStatus === 'approved').length;
  const rejectedCount = seekers.filter(s => s.approvalStatus === 'rejected').length;

  return (
    <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-3 gap-6"}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <Clock className="h-5 w-5" />
            Pending Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">{pendingCount}</div>
          <p className="text-sm text-muted-foreground">Organizations awaiting approval</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Approved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
          <p className="text-sm text-muted-foreground">Validated organizations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Users className="h-5 w-5" />
            Rejected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
          <p className="text-sm text-muted-foreground">Organizations needing review</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationCenter;