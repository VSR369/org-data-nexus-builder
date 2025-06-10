
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useTabManagement = (isBasicDetailsComplete: boolean, selectedIndustrySegment?: string) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic-details');
  const [showValidationError, setShowValidationError] = useState(false);

  const handleTabChange = (value: string) => {
    if (value === 'core-competencies') {
      // Check if industry segment is selected first
      if (!selectedIndustrySegment) {
        setShowValidationError(true);
        toast({
          title: "Industry Segment Required",
          description: "Please select an Industry Segment in Basic Information before proceeding to Core Competencies.",
          variant: "destructive"
        });
        return;
      }
      
      // Then check if basic details are complete
      if (!isBasicDetailsComplete) {
        setShowValidationError(true);
        toast({
          title: "Required Fields Missing",
          description: "Please complete all required fields in Basic Information before proceeding to Core Competencies.",
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
