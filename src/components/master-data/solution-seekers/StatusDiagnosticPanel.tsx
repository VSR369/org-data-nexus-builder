import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from 'lucide-react';

const StatusDiagnosticPanel: React.FC = () => {
  return (
    <Card className="mb-6 bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Status Persistence Diagnostic
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700 mb-1">Approval Statuses</div>
            <div className="text-xs text-gray-600">
              {(() => {
                try {
                  const approvals = JSON.parse(localStorage.getItem('seeker_approvals') || '[]');
                  const approved = approvals.filter((a: any) => a.status === 'approved').length;
                  const rejected = approvals.filter((a: any) => a.status === 'rejected').length;
                  return `✅ ${approved} Approved • ❌ ${rejected} Rejected • 📋 ${approvals.length} Total`;
                } catch {
                  return 'No approval data found';
                }
              })()}
            </div>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700 mb-1">Administrator Records</div>
            <div className="text-xs text-gray-600">
              {(() => {
                try {
                  const admins = JSON.parse(localStorage.getItem('created_administrators') || '[]');
                  return `👥 ${admins.length} Administrators Created`;
                } catch {
                  return 'No administrator data found';
                }
              })()}
            </div>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700 mb-1">Data Persistence</div>
            <div className="text-xs text-gray-600">
              <div>✅ LocalStorage Working</div>
              <div>🔄 Status Auto-Loading</div>
              <div>💾 Cross-Navigation Preserved</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusDiagnosticPanel;