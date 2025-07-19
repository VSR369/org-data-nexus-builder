import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  X, CheckCircle, Clock, AlertTriangle, XCircle, User, Building2, 
  CreditCard, Settings, Activity, DollarSign, Target, Zap,
  FileText, Calendar, Database, TrendingUp, Shield, Headphones,
  BarChart3, Workflow, Gift, Users, Package
} from 'lucide-react';
import { SolutionSeekerData, ComprehensiveOrganizationData, OrganizationDataService } from '@/services/OrganizationDataService';
import { toast } from "sonner";

interface ComprehensiveDataViewProps {
  isOpen: boolean;
  onClose: () => void;
  seeker: SolutionSeekerData;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Active Member':
      return <CheckCircle className="h-3 w-3 mr-1" />;
    case 'Pending Activation':
      return <Clock className="h-3 w-3 mr-1" />;
    case 'Registered - No Engagement':
      return <AlertTriangle className="h-3 w-3 mr-1" />;
    default:
      return <XCircle className="h-3 w-3 mr-1" />;
  }
};

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case 'Active Member':
    case 'Activated':
      return 'default';
    case 'Pending Activation':
      return 'secondary';
    case 'Registered - No Engagement':
      return 'outline';
    default:
      return 'destructive';
  }
};

const ComprehensiveDataView: React.FC<ComprehensiveDataViewProps> = ({
  isOpen,
  onClose,
  seeker
}) => {
  const [comprehensiveData, setComprehensiveData] = useState<ComprehensiveOrganizationData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && seeker) {
      fetchComprehensiveData();
    }
  }, [isOpen, seeker]);

  const fetchComprehensiveData = async () => {
    if (!seeker?.organization_id) return;
    
    setLoading(true);
    try {
      const data = await OrganizationDataService.getComprehensiveOrganizationData(seeker.organization_id);
      setComprehensiveData(data);
    } catch (error) {
      console.error('Error fetching comprehensive data:', error);
      toast.error('Failed to load comprehensive organization data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading comprehensive data...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {seeker.organization_name} - Comprehensive Data
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="tier">Tier Details</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Overall Status</p>
                      <Badge variant={getStatusBadgeVariant(seeker.overall_status)} className="w-fit">
                        {getStatusIcon(seeker.overall_status)}
                        {seeker.overall_status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Membership Status</p>
                      <Badge variant={getStatusBadgeVariant(seeker.membership_status)} className="w-fit">
                        {getStatusIcon(seeker.membership_status)}
                        {seeker.membership_status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Activation Status</p>
                      <Badge variant={getStatusBadgeVariant(seeker.activation_status)} className="w-fit">
                        {getStatusIcon(seeker.activation_status)}
                        {seeker.activation_status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">User Account</p>
                      <Badge variant={seeker.has_user_account ? "default" : "secondary"} className="w-fit">
                        {seeker.has_user_account ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                        {seeker.has_user_account ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Organization Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Organization Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Organization ID</p>
                        <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{seeker.organization_id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Organization Name</p>
                        <p className="font-medium">{seeker.organization_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Contact Person</p>
                        <p>{seeker.contact_person_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-mono text-sm">{seeker.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Organization Type</p>
                        <p>{seeker.organization_type || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Entity Type</p>
                        <p>{seeker.entity_type || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Country</p>
                        <p>{seeker.country || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Industry Segment</p>
                        <p>{seeker.industry_segment || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="membership" className="space-y-6 mt-6">
              {/* Payment Details */}
              {seeker.has_engagement_record && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Payment Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Payment Amount</p>
                            <p className="font-medium">{seeker.mem_payment_amount ? `${seeker.mem_payment_amount} ${seeker.mem_payment_currency || ''}` : 'Not set'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Payment Status</p>
                            <Badge variant={seeker.mem_payment_status === 'completed' ? 'default' : 'secondary'}>
                              {seeker.mem_payment_status || 'Not set'}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Payment Method</p>
                            <p>{seeker.mem_payment_method || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Payment Timeline
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Payment Date</p>
                            <p>{seeker.mem_payment_date ? new Date(seeker.mem_payment_date).toLocaleDateString() : 'Not recorded'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Last Payment</p>
                            <p>{seeker.last_payment_date ? new Date(seeker.last_payment_date).toLocaleDateString() : 'None'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Payments Made</p>
                            <p className="font-medium">{seeker.total_payments_made || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Payment Records
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Receipt Number</p>
                            <p className="font-mono text-sm">{seeker.mem_receipt_number || 'Not generated'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Selected Frequency</p>
                            <p>{seeker.selected_frequency || 'Not selected'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Current Frequency</p>
                            <p>{seeker.current_frequency || 'Not set'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Membership Fees Available */}
              {comprehensiveData?.membership_fees && comprehensiveData.membership_fees.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Available Membership Fees
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {comprehensiveData.membership_fees.map((fee, index) => (
                        <div key={fee.id} className="border rounded-lg p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Monthly</p>
                              <p className="font-medium">{fee.monthly_amount ? `${fee.monthly_amount} ${fee.monthly_currency}` : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Quarterly</p>
                              <p className="font-medium">{fee.quarterly_amount ? `${fee.quarterly_amount} ${fee.quarterly_currency}` : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Half-Yearly</p>
                              <p className="font-medium">{fee.half_yearly_amount ? `${fee.half_yearly_amount} ${fee.half_yearly_currency}` : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Annual</p>
                              <p className="font-medium">{fee.annual_amount ? `${fee.annual_amount} ${fee.annual_currency}` : 'N/A'}</p>
                            </div>
                          </div>
                          {fee.description && (
                            <div className="mt-3">
                              <p className="text-sm text-muted-foreground">Description</p>
                              <p className="text-sm">{fee.description}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tier" className="space-y-6 mt-6">
              {seeker.pricing_tier && comprehensiveData?.tier_configuration ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {comprehensiveData.tier_configuration.tier_info.name} Tier Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p>{comprehensiveData.tier_configuration.tier_info.description}</p>
                      </div>
                      
                      {comprehensiveData.tier_configuration.configurations?.map((config, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-4">{config.country} Configuration</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-3">
                              <h5 className="font-medium flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Challenge Limits
                              </h5>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">Monthly Limit</p>
                                  <p>{config.monthly_challenge_limit || 'Unlimited'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Solutions per Challenge</p>
                                  <p>{config.solutions_per_challenge}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Allows Overage</p>
                                  <Badge variant={config.allows_overage ? 'default' : 'secondary'}>
                                    {config.allows_overage ? 'Yes' : 'No'}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Fixed Charge per Challenge</p>
                                  <p>{config.fixed_charge_per_challenge} {config.currency}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h5 className="font-medium flex items-center gap-2">
                                <Headphones className="h-4 w-4" />
                                Support & Analytics
                              </h5>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">Support Type</p>
                                  <p>{config.support_type}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Support Level</p>
                                  <p>{config.support_level}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Availability</p>
                                  <p>{config.support_availability}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Response Time</p>
                                  <p>{config.support_response_time}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h5 className="font-medium flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Analytics & Workflow
                              </h5>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">Analytics Access</p>
                                  <p>{config.analytics_access}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Dashboard Access</p>
                                  <Badge variant={config.analytics_dashboard_access ? 'default' : 'secondary'}>
                                    {config.analytics_dashboard_access ? 'Yes' : 'No'}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Onboarding Type</p>
                                  <p>{config.onboarding_type}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Workflow Template</p>
                                  <p>{config.workflow_template}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No pricing tier selected or configured</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6 mt-6">
              {seeker.engagement_model && comprehensiveData?.engagement_model_details ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        {comprehensiveData.engagement_model_details.model_info.name} Model
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{comprehensiveData.engagement_model_details.model_info.description}</p>
                    </CardContent>
                  </Card>

                  {/* Complexity Levels */}
                  {comprehensiveData.engagement_model_details.complexity_levels?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Complexity Levels
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {comprehensiveData.engagement_model_details.complexity_levels.map((level, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{level.name}</h4>
                                <Badge variant="outline">Level {level.level_order}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Consulting Fee Multiplier</p>
                                  <p className="font-medium">{level.consulting_fee_multiplier}x</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Management Fee Multiplier</p>
                                  <p className="font-medium">{level.management_fee_multiplier}x</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Platform Fee Formulas */}
                  {comprehensiveData.engagement_model_details.platform_fee_formulas?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Platform Fee Formulas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {comprehensiveData.engagement_model_details.platform_fee_formulas.map((formula, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <h4 className="font-medium mb-2">{formula.formula_name}</h4>
                              <p className="text-sm text-muted-foreground mb-3">{formula.description}</p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Base Consulting Fee</p>
                                  <p>{formula.base_consulting_fee} {formula.currency}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Base Management Fee</p>
                                  <p>{formula.base_management_fee} {formula.currency}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Platform Usage Fee</p>
                                  <p>{formula.platform_usage_fee_percentage}%</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Advance Payment</p>
                                  <p>{formula.advance_payment_percentage}%</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Membership Discount</p>
                                  <p>{formula.membership_discount_percentage}%</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Country/Currency</p>
                                  <p>{formula.country} ({formula.currency})</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No engagement model selected</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6 mt-6">
              {comprehensiveData?.pricing_configurations && comprehensiveData.pricing_configurations.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Pricing Configurations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {comprehensiveData.pricing_configurations.map((config, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">{config.config_name}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Base Value</p>
                              <p className="font-medium">{config.base_value} {config.unit_symbol}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Calculated Value</p>
                              <p className="font-medium">{config.calculated_value} {config.unit_symbol}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Currency</p>
                              <p>{config.currency_code}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Membership Discount</p>
                              <p>{config.membership_discount}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Billing Frequency</p>
                              <p>{config.billing_frequency}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Effective From</p>
                              <p>{config.effective_from}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Effective To</p>
                              <p>{config.effective_to || 'Ongoing'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No pricing configurations available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ComprehensiveDataView;