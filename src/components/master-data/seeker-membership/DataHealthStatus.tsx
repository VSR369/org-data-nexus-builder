
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Database } from 'lucide-react';

interface DataHealthStatusProps {
  dataHealth: any;
}

const DataHealthStatus: React.FC<DataHealthStatusProps> = ({ dataHealth }) => {
  if (!dataHealth) return null;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium">Data Health Status</p>
            <div className="text-sm text-muted-foreground mt-1">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${dataHealth.currencies.hasUserData ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              Currencies: {dataHealth.currencies.hasUserData ? 'User Data Found' : 'Using Fallback'}
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ml-4 ${dataHealth.membershipFees.hasUserData ? 'bg-green-500' : 'bg-gray-500'}`}></span>
              Membership Fees: {dataHealth.membershipFees.hasUserData ? 'User Data Found' : 'No User Data'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataHealthStatus;
