
import React, { useState, useEffect } from 'react';
import CapabilityLevelsManagement from './competency-capability/CapabilityLevelsManagement';
import { CapabilityLevel } from './competency-capability/types';
import { DEFAULT_CAPABILITY_LEVELS, COLOR_OPTIONS } from './competency-capability/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LegacyDataManager } from '@/utils/core/DataManager';

const dataManager = new LegacyDataManager<CapabilityLevel[]>({
  key: 'master_data_capability_levels',
  defaultData: DEFAULT_CAPABILITY_LEVELS,
  version: 1
});

const CompetencyCapabilityConfig = () => {
  const [capabilityLevels, setCapabilityLevels] = useState<CapabilityLevel[]>([]);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    const loadedLevels = dataManager.loadData();
    setCapabilityLevels(loadedLevels);
  }, []);

  // Save data whenever capabilityLevels change
  useEffect(() => {
    if (capabilityLevels.length > 0) {
      dataManager.saveData(capabilityLevels);
    }
  }, [capabilityLevels]);

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
