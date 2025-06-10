
import React, { useState } from 'react';
import CapabilityLevelsManagement from './competency-capability/CapabilityLevelsManagement';
import { CapabilityLevel } from './competency-capability/types';
import { DEFAULT_CAPABILITY_LEVELS, COLOR_OPTIONS } from './competency-capability/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const CompetencyCapabilityConfig = () => {
  const [capabilityLevels, setCapabilityLevels] = useState<CapabilityLevel[]>(DEFAULT_CAPABILITY_LEVELS);
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-foreground mb-2">Capability Ratings Configuration</h2>
        <p className="text-lg text-muted-foreground">
          Manage capability levels, competency scoring ranges, and assessment parameters
        </p>
      </div>

      <CapabilityLevelsManagement
        capabilityLevels={capabilityLevels}
        onCapabilityLevelsChange={setCapabilityLevels}
        colorOptions={COLOR_OPTIONS}
      />
    </div>
  );
};

export default CompetencyCapabilityConfig;
