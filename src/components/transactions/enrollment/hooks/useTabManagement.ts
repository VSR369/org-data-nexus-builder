
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useTabManagement = (selectedIndustrySegment?: string) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic-details');
  const [showValidationError, setShowValidationError] = useState(false);

  const handleTabChange = (value: string) => {
    if (value === 'core-competencies') {
      // Only check if industry segment is selected
      if (!selectedIndustrySegment) {
        setShowValidationError(true);
        toast({
          title: "Industry Segment Required",
          description: "Please select an Industry Segment in Basic Information before proceeding to Core Competencies.",
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
