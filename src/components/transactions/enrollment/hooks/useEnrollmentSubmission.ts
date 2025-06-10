
import { useToast } from "@/hooks/use-toast";
import { FormData } from '../types';

export const useEnrollmentSubmission = (
  formData: FormData,
  providerType: string,
  selectedIndustrySegment: string,
  hasCompetencyRatings: boolean,
  validateAndHighlightFields: (
    formData: FormData,
    providerType: string,
    selectedIndustrySegment: string,
    hasCompetencyRatings: boolean
  ) => { isValid: boolean; missingFields: string[] },
  clearDraft: () => void
) => {
  const { toast } = useToast();

  const handleSubmitEnrollment = () => {
    const validation = validateAndHighlightFields(formData, providerType, selectedIndustrySegment, hasCompetencyRatings);
    
    if (!validation.isValid) {
      toast({
        title: "Required Fields Missing",
        description: `Please complete the following: ${validation.missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Clear draft after successful submission
    clearDraft();
    
    toast({
      title: "Success",
      description: "Solution Provider enrollment submitted successfully",
    });
  };

  return {
    handleSubmitEnrollment
  };
};
