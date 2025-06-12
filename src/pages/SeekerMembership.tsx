import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Building, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { DataManager } from '@/utils/dataManager';

interface MembershipFeeEntry {
  id: string;
  country: string;
  entityType: string;
  quarterlyAmount: number;
  quarterlyCurrency: string;
  halfYearlyAmount: number;
  halfYearlyCurrency: string;
  annualAmount: number;
  annualCurrency: string;
}

interface SeekerMembershipProps {
  userId?: string;
  organizationName?: string;
  isEditing?: boolean;
}

// Data managers
const entityTypeDataManager = new DataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: ['Commercial', 'Non-Profit Organization', 'Society', 'Trust'],
  version: 1
});

const membershipFeeDataManager = new DataManager<MembershipFeeEntry[]>({
  key: 'master_data_seeker_membership_fees',
  defaultData: [],
  version: 1
});

const SeekerMembership = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { userId, organizationName, isEditing } = location.state as SeekerMembershipProps & { isEditing?: boolean } || {};
  
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [membershipFees, setMembershipFees] = useState<MembershipFeeEntry[]>([]);
  const [selectedEntityType, setSelectedEntityType] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Load master data
  useEffect(() => {
    console.log('🔄 SeekerMembership - Loading master data...');
    
    const loadedEntityTypes = entityTypeDataManager.loadData();
    const loadedMembershipFees = membershipFeeDataManager.loadData();
    
    console.log('🔍 SeekerMembership - Raw loaded entity types:', loadedEntityTypes);
    console.log('🔍 SeekerMembership - Raw loaded membership fees:', loadedMembershipFees);
    console.log('🔍 SeekerMembership - Membership fees length:', loadedMembershipFees?.length || 0);
    
    // Check if we have any membership fee data
    if (loadedMembershipFees && loadedMembershipFees.length > 0) {
      console.log('✅ Found membership fee configurations:', loadedMembershipFees);
      loadedMembershipFees.forEach((fee, index) => {
        console.log(`📋 Fee ${index + 1}:`, {
          entityType: fee.entityType,
          country: fee.country,
          quarterly: `${fee.quarterlyCurrency} ${fee.quarterlyAmount}`,
          halfYearly: `${fee.halfYearlyCurrency} ${fee.halfYearlyAmount}`,
          annual: `${fee.annualCurrency} ${fee.annualAmount}`
        });
      });
    } else {
      console.log('❌ No membership fee configurations found');
    }
    
    setEntityTypes(loadedEntityTypes);
    setMembershipFees(loadedMembershipFees);
    
    // Auto-select first entity type if available
    if (loadedEntityTypes.length > 0) {
      setSelectedEntityType(loadedEntityTypes[0]);
      console.log('🎯 Auto-selected entity type:', loadedEntityTypes[0]);
    }
  }, []);

  // Load existing membership data when editing
  useEffect(() => {
    if (isEditing && userId) {
      console.log('🔍 Loading existing membership data for editing...');
      const existingMembershipData = localStorage.getItem('seeker_membership_data');
      
      if (existingMembershipData) {
        try {
          const parsedData = JSON.parse(existingMembershipData);
          console.log('📋 Existing membership data:', parsedData);
          
          if (parsedData.userId === userId) {
            console.log('✅ Found matching membership data, pre-filling form');
            setSelectedEntityType(parsedData.entityType || '');
            setSelectedPlan(parsedData.membershipPlan || '');
          }
        } catch (error) {
          console.log('❌ Error parsing existing membership data:', error);
        }
      }
    }
  }, [isEditing, userId]);

  // Get membership fee options for selected entity type
  const getMembershipOptions = () => {
    console.log('🔍 Getting membership options for entity type:', selectedEntityType);
    console.log('🔍 Available membership fees:', membershipFees);
    
    if (!selectedEntityType) {
      console.log('❌ No entity type selected');
      return null;
    }
    
    // Find membership fee configuration for the selected entity type
    const feeConfig = membershipFees.find(fee => {
      console.log(`🔍 Checking fee config: ${fee.entityType} === ${selectedEntityType}?`, fee.entityType === selectedEntityType);
      return fee.entityType === selectedEntityType;
    });
    
    if (!feeConfig) {
      console.log('❌ No membership fee configuration found for entity type:', selectedEntityType);
      console.log('📋 Available entity types in fees:', membershipFees.map(f => f.entityType));
      return null;
    }
    
    console.log('✅ Found fee configuration:', feeConfig);
    
    return {
      quarterly: {
        amount: feeConfig.quarterlyAmount,
        currency: feeConfig.quarterlyCurrency,
        label: 'Quarterly'
      },
      halfYearly: {
        amount: feeConfig.halfYearlyAmount,
        currency: feeConfig.halfYearlyCurrency,
        label: 'Half-Yearly'
      },
      annual: {
        amount: feeConfig.annualAmount,
        currency: feeConfig.annualCurrency,
        label: 'Annual'
      }
    };
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEntityType || !selectedPlan) {
      toast({
        title: "Validation Error",
        description: "Please select entity type and membership plan",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Save membership data to localStorage
      const membershipData = {
        userId,
        organizationName,
        entityType: selectedEntityType,
        membershipPlan: selectedPlan,
        isMember: true,
        joinedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('seeker_membership_data', JSON.stringify(membershipData));
      console.log('💾 Saved membership data to localStorage:', membershipData);

      // Here you would save to backend
      console.log('Membership registration:', membershipData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: isEditing ? "Update Successful" : "Registration Successful",
        description: isEditing ? "Your membership has been updated successfully!" : "Your membership registration has been submitted successfully!",
      });

      // Navigate back to dashboard with updated membership status
      navigate('/seeker-dashboard', {
        state: {
          userId,
          organizationName,
          isMember: true
        }
      });
    } catch (error) {
      toast({
        title: isEditing ? "Update Failed" : "Registration Failed",
        description: isEditing ? "There was an error updating your membership." : "There was an error processing your membership registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const membershipOptions = getMembershipOptions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Link to="/seeker-dashboard" state={{ userId, organizationName, isMember: false }}>
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl font-bold">Seeker Membership Registration</CardTitle>
                  <p className="text-muted-foreground">Complete your membership to access all features</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Auto-populated Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Organization Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Organization Name</p>
                      <p className="font-semibold">{organizationName || 'Not Available'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">User ID</p>
                      <p className="font-semibold">{userId || 'Not Available'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Debug Information */}
              <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800">Debug Information:</h4>
                <p className="text-sm text-blue-700">Entity Types Available: {entityTypes.length} ({entityTypes.join(', ')})</p>
                <p className="text-sm text-blue-700">Membership Fees Loaded: {membershipFees.length}</p>
                {membershipFees.length > 0 && (
                  <div className="text-sm text-blue-700">
                    <p>Available Fee Configurations:</p>
                    <ul className="list-disc list-inside ml-4">
                      {membershipFees.map(fee => (
                        <li key={fee.id}>
                          {fee.country} - {fee.entityType}: Q{fee.quarterlyAmount} {fee.quarterlyCurrency}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Entity Type Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Entity Type *</Label>
                <RadioGroup value={selectedEntityType} onValueChange={setSelectedEntityType}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entityTypes.map((entityType) => (
                      <div key={entityType} className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedEntityType === entityType 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={entityType} id={entityType} />
                          <Label htmlFor={entityType} className="cursor-pointer font-medium">
                            {entityType}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Membership Fee Options */}
              {membershipOptions && (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Membership Plan *</Label>
                  <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(membershipOptions).map(([key, option]) => (
                        <div key={key} className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                          selectedPlan === key 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center justify-between">
                              <RadioGroupItem value={key} id={key} />
                              <Badge variant="outline">{option.label}</Badge>
                            </div>
                            <div className="text-center">
                              <Label htmlFor={key} className="cursor-pointer">
                                <div className="text-2xl font-bold text-blue-600">
                                  {formatCurrency(option.amount, option.currency)}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  per {option.label.toLowerCase()}
                                </div>
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              {!membershipOptions && selectedEntityType && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    ⚠️ No membership fee configuration found for "{selectedEntityType}". 
                    Please contact administrator to set up pricing for this entity type.
                  </p>
                  <p className="text-sm text-yellow-700 mt-2">
                    You may need to configure membership fees in the Master Data Portal first.
                  </p>
                </div>
              )}

              {membershipFees.length === 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">
                    ❌ No membership fee configurations found in master data. 
                    Please set up membership fees in the Master Data Portal before proceeding.
                  </p>
                  <Link to="/master-data" className="inline-block mt-2">
                    <Button variant="outline" size="sm">
                      Go to Master Data Portal
                    </Button>
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={!selectedEntityType || !selectedPlan || isLoading || membershipFees.length === 0}
                >
                  {isLoading ? 'Processing...' : 'Submit Registration'}
                </Button>
                <Link to="/seeker-dashboard" state={{ userId, organizationName, isMember: false }}>
                  <Button type="button" variant="outline" className="px-8">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerMembership;
