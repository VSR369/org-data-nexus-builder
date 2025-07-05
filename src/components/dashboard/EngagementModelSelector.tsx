import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Handshake, AlertCircle } from 'lucide-react';
import { useEngagementModels } from '@/hooks/useEngagementModels';
import { usePricingData } from '@/hooks/usePricingData';
import { useMembershipData } from '@/hooks/useMembershipData';
import { MembershipService } from '@/services/MembershipService';
import { useToast } from "@/hooks/use-toast";
import MembershipPlansSection from './MembershipPlansSection';
import EngagementModelsSection from './EngagementModelsSection';
import ConfirmationSection from './ConfirmationSection';

interface EngagementModelOption {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface PricingDetails {
  basePrice: number;
  currency: string;
  pricingTier: string;
  discountPercentage?: number;
  frequency: 'quarterly' | 'half-yearly' | 'annually';
  totalAmount: number;
}

interface StoredEngagementSelection {
  engagementModel: EngagementModelOption;
  pricingDetails: PricingDetails;
  selectionTimestamp: string;
  organizationType: string;
  entityType: string;
  country: string;
}

interface EngagementModelSelectorProps {
  country: string;
  organizationType: string;
  entityType: string;
  userId?: string; // Add userId to check membership status
  onEngagementSelect: (engagement: EngagementModelOption, pricing: PricingDetails | null) => void;
  selectedEngagement?: EngagementModelOption | null;
}

const EngagementModelSelector: React.FC<EngagementModelSelectorProps> = ({
  country,
  organizationType,
  entityType,
  userId,
  onEngagementSelect,
  selectedEngagement
}) => {
  const [selectedModel, setSelectedModel] = useState<EngagementModelOption | null>(selectedEngagement || null);
  const [selectedFrequency, setSelectedFrequency] = useState<'quarterly' | 'half-yearly' | 'annually'>('annually');
  const [selectedMembershipFrequency, setSelectedMembershipFrequency] = useState<'quarterly' | 'half-yearly' | 'annually'>('annually');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { engagementModels, loading: modelsLoading, error: modelsError } = useEngagementModels();
  const { getConfigByOrgTypeAndEngagement } = usePricingData();
  const { membershipData, countryPricing, loading: membershipLoading } = useMembershipData(entityType, country, organizationType);
  const { toast } = useToast();

  // Check if user has active membership
  const hasActiveMembership = userId ? MembershipService.getMembershipData(userId).status === 'active' : false;

  // Load saved selection on component mount
  useEffect(() => {
    const loadSavedSelection = () => {
      try {
        const storageKey = `engagement_selection_${organizationType}_${entityType}_${country}`.replace(/\s+/g, '_');
        const savedSelection = localStorage.getItem(storageKey);
        
        if (savedSelection) {
          const parsedSelection: StoredEngagementSelection = JSON.parse(savedSelection);
          console.log('✅ Loading saved engagement selection:', parsedSelection);
          
          setSelectedModel(parsedSelection.engagementModel);
          setSelectedFrequency(parsedSelection.pricingDetails.frequency);
          setIsConfirmed(true);
          
          // Notify parent component
          onEngagementSelect(parsedSelection.engagementModel, parsedSelection.pricingDetails);
          
          toast({
            title: "Previous Selection Loaded",
            description: `Restored your ${parsedSelection.engagementModel.name} selection with ${parsedSelection.pricingDetails.frequency} billing`,
          });
        }
      } catch (error) {
        console.error('❌ Error loading saved engagement selection:', error);
      }
    };

    loadSavedSelection();
  }, [organizationType, entityType, country, onEngagementSelect, toast]);

  const calculatePricing = (model: EngagementModelOption, frequency: 'quarterly' | 'half-yearly' | 'annually') => {
    // Get pricing configuration from master data for this specific combination
    const pricingConfig = getConfigByOrgTypeAndEngagement(organizationType, model.name);
    
    console.log('💰 Looking up pricing for:', {
      organizationType,
      entityType,
      country,
      engagementModel: model.name,
      frequency,
      foundConfig: pricingConfig,
      hasActiveMembership
    });
    
    if (!pricingConfig) {
      console.log('❌ No pricing data found in master data for this combination');
      return null; // Return null when no data is available
    }
    
    // Get the actual price based on frequency from master data
    let totalAmount = 0;
    const currency = pricingConfig.currency || 'USD';
    
    switch (frequency) {
      case 'quarterly':
        totalAmount = pricingConfig.quarterlyFee || 0;
        break;
      case 'half-yearly':
        totalAmount = pricingConfig.halfYearlyFee || 0;
        break;
      case 'annually':
        totalAmount = pricingConfig.annualFee || 0;
        break;
    }
    
    // If the specific frequency price is not configured, return null
    if (totalAmount === 0) {
      console.log(`❌ No ${frequency} pricing configured for ${model.name}`);
      return null;
    }
    
    // Only apply discount if user has active membership
    const discountPercentage = hasActiveMembership ? (pricingConfig.discountPercentage || 0) : undefined;
    const baseMonthlyPrice = frequency === 'quarterly' ? Math.round(totalAmount / 3) : 
                            frequency === 'half-yearly' ? Math.round(totalAmount / 6) : 
                            Math.round(totalAmount / 12);
    
    console.log('✅ Pricing calculated from master data:', {
      totalAmount,
      currency,
      frequency,
      discountPercentage,
      hasActiveMembership,
      baseMonthlyPrice
    });
    
    return {
      basePrice: baseMonthlyPrice,
      currency,
      pricingTier: pricingConfig.configName || 'Standard',
      discountPercentage,
      frequency,
      totalAmount
    };
  };

  const handleModelSelect = (modelId: string) => {
    const model = engagementModels.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
      setIsConfirmed(false); // Reset confirmation when model changes
      
      // Calculate pricing for current selection
      const pricingDetails = calculatePricing(model, selectedFrequency);
      onEngagementSelect(model, pricingDetails);
    }
  };

  const handleFrequencyChange = (frequency: 'quarterly' | 'half-yearly' | 'annually') => {
    setSelectedFrequency(frequency);
    setIsConfirmed(false); // Reset confirmation when frequency changes
    
    if (selectedModel) {
      const pricingDetails = calculatePricing(selectedModel, frequency);
      onEngagementSelect(selectedModel, pricingDetails);
    }
  };

  const confirmSelection = () => {
    if (selectedModel) {
      const pricingDetails = calculatePricing(selectedModel, selectedFrequency);
      
      // Store selection permanently
      const selectionData: StoredEngagementSelection = {
        engagementModel: selectedModel,
        pricingDetails,
        selectionTimestamp: new Date().toISOString(),
        organizationType,
        entityType,
        country
      };
      
      const storageKey = `engagement_selection_${organizationType}_${entityType}_${country}`.replace(/\s+/g, '_');
      localStorage.setItem(storageKey, JSON.stringify(selectionData));
      
      // Also store in a general list for reporting
      const allSelections = JSON.parse(localStorage.getItem('all_engagement_selections') || '[]');
      allSelections.push(selectionData);
      localStorage.setItem('all_engagement_selections', JSON.stringify(allSelections));
      
      setIsConfirmed(true);
      
      console.log('✅ Engagement selection confirmed and stored:', selectionData);
      
      toast({
        title: "Selection Confirmed & Saved ✅",
        description: `${selectedModel.name} with ${selectedFrequency} billing has been saved to your profile`,
      });
      
      onEngagementSelect(selectedModel, pricingDetails);
    }
  };

  const handleMembershipActivation = () => {
    if (!userId || !countryPricing || !selectedMembershipFrequency) return;
    
    const membershipPricing = {
      currency: countryPricing.currency,
      amount: selectedMembershipFrequency === 'quarterly' ? countryPricing.quarterlyPrice :
              selectedMembershipFrequency === 'half-yearly' ? countryPricing.halfYearlyPrice :
              countryPricing.annualPrice,
      frequency: selectedMembershipFrequency
    };
    
    const success = MembershipService.activateMembership(
      userId, 
      `${organizationType} - ${selectedMembershipFrequency}`, 
      membershipPricing
    );
    
    if (success) {
      toast({
        title: "Membership Activated! 🎉",
        description: `Your ${selectedMembershipFrequency} membership plan is now active. You'll get discounts on engagement models.`,
      });
      
      // Refresh component to show updated membership status
      window.location.reload();
    } else {
      toast({
        title: "Activation Failed",
        description: "Failed to activate membership. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (modelsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Handshake className="h-8 w-8 animate-pulse text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading engagement models...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (modelsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Error Loading Engagement Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{modelsError}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const activeModels = engagementModels.filter(model => model.isActive);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Handshake className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Membership & Engagement Selection</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Configure your membership plan and engagement model for {organizationType} ({entityType}) in {country}
        </p>
      </div>

      {/* Three Column Layout: Membership Plans | Engagement Models | Confirmation */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Section: Membership Plans */}
        <div className="xl:col-span-3">
          <MembershipPlansSection
            membershipLoading={membershipLoading}
            countryPricing={countryPricing}
            hasActiveMembership={hasActiveMembership}
            selectedMembershipFrequency={selectedMembershipFrequency}
            onMembershipFrequencyChange={setSelectedMembershipFrequency}
            onMembershipActivation={handleMembershipActivation}
          />
        </div>

        {/* Center Section: Engagement Models */}
        <div className="xl:col-span-6">
          <EngagementModelsSection
            activeModels={activeModels}
            selectedModel={selectedModel}
            selectedFrequency={selectedFrequency}
            organizationType={organizationType}
            entityType={entityType}
            hasActiveMembership={hasActiveMembership}
            onModelSelect={handleModelSelect}
            onFrequencyChange={handleFrequencyChange}
            calculatePricing={calculatePricing}
          />
        </div>

        {/* Right Section: Confirmation */}
        <div className="xl:col-span-3">
          <ConfirmationSection
            selectedModel={selectedModel}
            selectedFrequency={selectedFrequency}
            isConfirmed={isConfirmed}
            hasActiveMembership={hasActiveMembership}
            onConfirmSelection={confirmSelection}
            onModifySelection={() => {
              setIsConfirmed(false);
              toast({
                title: "Modification Enabled",
                description: "You can now change your selections",
              });
            }}
            calculatePricing={calculatePricing}
          />
        </div>
      </div>
    </div>
  );
};

export default EngagementModelSelector;