
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompetencyCapability } from './types';

interface RatingScaleOverviewProps {
  capabilities: CompetencyCapability[];
  onUpdateRatingRange: (id: string, newRange: string) => void;
}

const RatingScaleOverview: React.FC<RatingScaleOverviewProps> = ({
  capabilities,
  onUpdateRatingRange
}) => {
  const ratingOptions = ['1-3', '1-5', '1-10'];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-green-100 text-green-800';
      case 'behavioral': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Scale Overview</CardTitle>
        <CardDescription>
          Manage rating scales for different competency and capability categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {capabilities.map((capability) => (
            <div key={capability.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="font-medium">{capability.name}</h4>
                  <p className="text-sm text-muted-foreground">{capability.description}</p>
                </div>
                <Badge className={getCategoryColor(capability.category)}>
                  {capability.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rating Scale:</span>
                <Select
                  value={capability.ratingRange}
                  onValueChange={(value) => onUpdateRatingRange(capability.id, value)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ratingOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingScaleOverview;
