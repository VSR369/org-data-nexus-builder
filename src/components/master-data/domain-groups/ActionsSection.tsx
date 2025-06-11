
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap, Building2 } from 'lucide-react';

interface ActionsSectionProps {
  hasData: boolean;
  isCreating: boolean;
  onShowDataEntry?: () => void;
  onCreateLifeSciencesHierarchy: () => void;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({
  hasData,
  isCreating,
  onShowDataEntry,
  onCreateLifeSciencesHierarchy
}) => {
  return (
    <div className="flex gap-4">
      {/* Add New Domain Hierarchy Button */}
      <Button 
        onClick={onShowDataEntry}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add New Domain Hierarchy
      </Button>

      {/* Quick Create Life Sciences Button - only show if no Life Sciences exists */}
      {!hasData && (
        <Card className="flex-1 border-2 border-dashed border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Setup: Life Sciences Hierarchy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Get started quickly with a comprehensive Life Sciences & Pharma competency hierarchy.
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="font-medium">4 Domain Groups</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">13 Categories</Badge>
                  <Badge variant="outline" className="text-xs">52 Sub-categories</Badge>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={onCreateLifeSciencesHierarchy}
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? 'Creating Life Sciences Hierarchy...' : 'Create Life Sciences Hierarchy'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActionsSection;
