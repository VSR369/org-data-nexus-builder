
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from 'lucide-react';
import { CompetencyCapability } from './types';

interface CapabilityItemProps {
  capability: CompetencyCapability;
  onEdit: (capability: CompetencyCapability) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const CapabilityItem: React.FC<CapabilityItemProps> = ({
  capability,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div
      className={`border rounded-lg p-4 ${
        capability.isActive ? 'bg-card' : 'bg-muted/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge className={capability.color}>
            {capability.name}
          </Badge>
          <div>
            <div className="font-medium">{capability.name}</div>
            <div className="text-sm text-muted-foreground mb-1">
              Rating Range: {capability.ratingRange}
            </div>
            {capability.description && (
              <div className="text-sm text-muted-foreground">
                {capability.description}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={capability.isActive ? "default" : "secondary"}>
            {capability.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(capability)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(capability.id)}
          >
            {capability.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(capability.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CapabilityItem;
