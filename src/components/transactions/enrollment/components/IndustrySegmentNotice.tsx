
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const IndustrySegmentNotice: React.FC = () => {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>
        Industry segments configuration has been removed. You can proceed with the registration without selecting specific industry segments.
      </AlertDescription>
    </Alert>
  );
};

export default IndustrySegmentNotice;
