
import React, { useState, useEffect } from 'react';
import { IndustrySegmentData } from '@/types/industrySegments';
import { industrySegmentDataManager } from './industry-segments/industrySegmentDataManager';
import IndustrySegmentForm from './industry-segments/IndustrySegmentForm';
import IndustrySegmentDisplay from './industry-segments/IndustrySegmentDisplay';

const defaultIndustrySegmentData: IndustrySegmentData = {
  industrySegments: []
};

const IndustrySegmentConfig: React.FC = () => {
  const [data, setData] = useState<IndustrySegmentData>(defaultIndustrySegmentData);

  // Load data on component mount
  useEffect(() => {
    console.log('=== IndustrySegmentConfig: Loading data ===');
    const loadedData = industrySegmentDataManager.loadData();
    
    console.log('📊 Loaded industry segments data:', loadedData);
    setData(loadedData);
  }, []);

  const handleDataUpdate = (newData: IndustrySegmentData) => {
    setData(newData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Industry Segments Configuration</h1>
          <p className="text-muted-foreground">Manage industry segments for the platform</p>
        </div>
      </div>

      <IndustrySegmentForm data={data} onDataUpdate={handleDataUpdate} />
      <IndustrySegmentDisplay data={data} onDataUpdate={handleDataUpdate} />
    </div>
  );
};

export default IndustrySegmentConfig;
