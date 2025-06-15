
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';

interface LoginWarningProps {
  show: boolean;
}

const LoginWarning: React.FC<LoginWarningProps> = ({ show }) => {
  if (!show) return null;

  return (
    <Card className="shadow-xl border-0 mb-6 border-l-4 border-l-red-500">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <p className="font-medium">Please log in again to access your dashboard.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginWarning;
