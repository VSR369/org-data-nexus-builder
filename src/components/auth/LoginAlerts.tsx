import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Shield } from 'lucide-react';

interface LoginAlertsProps {
  error: string;
  success: string;
}

const LoginAlerts: React.FC<LoginAlertsProps> = ({ error, success }) => {
  return (
    <>
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-900">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default LoginAlerts;