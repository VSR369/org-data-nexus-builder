
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DomainGroupsData } from '@/types/domainGroups';

interface DevelopmentInfoProps {
  data: DomainGroupsData;
  hierarchyExists: boolean;
  hasData: boolean;
}

const DevelopmentInfo: React.FC<DevelopmentInfoProps> = ({
  data,
  hierarchyExists,
  hasData
}) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle className="text-sm">Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>Domain Groups: {data.domainGroups?.length || 0}</div>
        <div>Categories: {data.categories?.length || 0}</div>
        <div>Sub-Categories: {data.subCategories?.length || 0}</div>
        <div>Hierarchy Exists: {hierarchyExists.toString()}</div>
        <div>Has Data: {hasData.toString()}</div>
      </CardContent>
    </Card>
  );
};

export default DevelopmentInfo;
