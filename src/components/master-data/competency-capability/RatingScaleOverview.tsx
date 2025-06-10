
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Scale, Edit } from 'lucide-react';
import { CompetencyCapability } from './types';

interface RatingScaleOverviewProps {
  capabilities: CompetencyCapability[];
  onUpdateRatingRange: (id: string, newRange: string) => void;
}

const RatingScaleOverview: React.FC<RatingScaleOverviewProps> = ({
  capabilities,
  onUpdateRatingRange,
}) => {
  const [isEditingScale, setIsEditingScale] = useState(false);

  const sortedCapabilities = [...capabilities].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Competency Rating Scale Overview
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingScale(!isEditingScale)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditingScale ? 'Done Editing' : 'Edit Scale'}
          </Button>
        </CardTitle>
        <CardDescription>
          The competency assessment uses a 0-10 rating scale with the following capability levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedCapabilities.filter(cap => cap.isActive).map((capability) => (
            <div key={capability.id} className="text-center p-4 border rounded-lg">
              <Badge className={`${capability.color} mb-2`}>
                {capability.name}
              </Badge>
              {isEditingScale ? (
                <Input
                  value={capability.ratingRange}
                  onChange={(e) => onUpdateRatingRange(capability.id, e.target.value)}
                  className="text-center text-sm font-medium mb-1"
                  placeholder="e.g., 0 - 2.49999"
                />
              ) : (
                <div className="text-sm font-medium mb-1">{capability.ratingRange}</div>
              )}
              <div className="text-xs text-muted-foreground">{capability.description}</div>
            </div>
          ))}
        </div>
        {isEditingScale && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Editing Mode:</strong> Click on any rating range above to edit it directly. 
              Click "Done Editing" when finished.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingScaleOverview;
