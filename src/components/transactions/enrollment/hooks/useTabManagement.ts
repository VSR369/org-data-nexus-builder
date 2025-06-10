
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useTabManagement = (hasIndustrySegments?: boolean) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic-details');
  const [showValidationError, setShowValidationError] = useState(false);

  const handleTabChange = (value: string) => {
    if (value === 'core-competencies') {
      // Only check if at least one industry segment is selected
      if (!hasIndustrySegments) {
        setShowValidationError(true);
        toast({
          title: "Industry Segment Required",
          description: "Please select at least one Industry Segment in Basic Information before proceeding to Core Competencies.",
          variant: "destructive"
        });
        return;
      }
      setShowValidationError(false);
    }
    setActiveTab(value);
  };

  return {
    activeTab,
    showValidationError,
    handleTabChange
  };
};
