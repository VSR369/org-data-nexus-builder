
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MasterDataStructureConfig = () => {
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-foreground mb-2">Domain Groups Configuration</h2>
        <p className="text-lg text-muted-foreground">
          Configure the hierarchical structure of Domain Groups, Categories, and Sub-Categories
        </p>
      </div>

      {message && (
        <Alert>
          <AlertDescription className="text-left text-base">{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="text-left">
          <CardTitle className="text-2xl">
            Domain Groups Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Domain Groups features have been removed.
            </p>
            <p className="text-muted-foreground text-base mt-2">
              Ready for recreation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterDataStructureConfig;
