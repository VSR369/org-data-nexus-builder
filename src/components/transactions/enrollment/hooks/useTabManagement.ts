
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useTabManagement = (hasIndustrySegments?: boolean) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic-details');
  const [showValidationError, setShowValidationError] = useState(false);

  const handleTabChange = (value: string) => {
    // Remove the dependency check - allow Core Competencies to be accessed independently
    setActiveTab(value);
    setShowValidationError(false);
  };

  return {
    activeTab,
    showValidationError,
    handleTabChange
  };
};
