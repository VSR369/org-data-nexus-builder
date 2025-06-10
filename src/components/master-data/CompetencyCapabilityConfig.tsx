
import React, { useState } from 'react';
import RatingScaleOverview from './competency-capability/RatingScaleOverview';
import CapabilityManagement from './competency-capability/CapabilityManagement';
import { CompetencyCapability } from './competency-capability/types';
import { DEFAULT_CAPABILITIES } from './competency-capability/constants';

const CompetencyCapabilityConfig = () => {
  const [capabilities, setCapabilities] = useState<CompetencyCapability[]>(DEFAULT_CAPABILITIES);

  const handleUpdateRatingRange = (id: string, newRange: string) => {
    setCapabilities(prev => prev.map(cap => 
      cap.id === id ? { ...cap, ratingRange: newRange } : cap
    ));
  };

  return (
    <div className="space-y-6">
      <RatingScaleOverview
        capabilities={capabilities}
        onUpdateRatingRange={handleUpdateRatingRange}
      />
      
      <CapabilityManagement
        capabilities={capabilities}
        onCapabilitiesChange={setCapabilities}
      />
    </div>
  );
};

export default CompetencyCapabilityConfig;
