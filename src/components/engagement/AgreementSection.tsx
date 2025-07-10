import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, CheckSquare } from "lucide-react";

interface AgreementSectionProps {
  agreementAccepted: boolean;
  onAgreementChange: (accepted: boolean) => void;
  engagementModel: string;
}

export const AgreementSection: React.FC<AgreementSectionProps> = ({
  agreementAccepted,
  onAgreementChange,
  engagementModel
}) => {
  const getTermsForModel = (model: string) => {
    switch (model) {
      case 'Market Place':
        return {
          title: 'Marketplace Terms & Conditions',
          terms: [
            'You will operate as a marketplace facilitator connecting solution seekers with solution providers.',
            'Commission structure will be based on successful transactions facilitated through the platform.',
            'You are responsible for maintaining quality standards for listed solutions and providers.',
            'All marketplace transactions must comply with applicable laws and regulations.',
            'You will provide customer support for marketplace users and handle dispute resolution.',
            'Platform branding and white-labeling options are available as per your subscription tier.',
            'Regular reporting and analytics will be provided to track marketplace performance.',
            'You maintain control over pricing, promotions, and marketplace policies within platform guidelines.'
          ]
        };
      case 'Aggregator':
        return {
          title: 'Aggregator Terms & Conditions',
          terms: [
            'You will aggregate multiple solution providers under a unified interface.',
            'Revenue sharing will be based on successful referrals and completed projects.',
            'You are responsible for vetting and onboarding solution providers to maintain quality.',
            'All aggregated solutions must meet platform standards and compliance requirements.',
            'You will manage client relationships and serve as the primary point of contact.',
            'Technical integration support will be provided for seamless solution aggregation.',
            'Regular performance metrics and analytics will be available through the dashboard.',
            'You retain flexibility in packaging and presenting aggregated solutions to clients.'
          ]
        };
      case 'Market Place & Aggregator':
        return {
          title: 'Marketplace & Aggregator Terms & Conditions',
          terms: [
            'You will operate in a hybrid model combining marketplace and aggregator functionalities.',
            'Dual revenue streams through both marketplace commissions and aggregator fees.',
            'Enhanced control over both direct marketplace listings and aggregated solution packages.',
            'Comprehensive provider management tools for both marketplace vendors and aggregated partners.',
            'Advanced analytics covering both marketplace transactions and aggregator performance.',
            'Flexible client engagement options through both self-service marketplace and curated aggregation.',
            'Priority support for managing complex multi-provider solution scenarios.',
            'Full platform customization options to support both business models simultaneously.'
          ]
        };
      default:
        return {
          title: 'Engagement Terms & Conditions',
          terms: [
            'By activating this engagement model, you agree to comply with all platform terms and conditions.',
            'You will use the platform in accordance with its intended purpose and functionality.',
            'All activities must comply with applicable laws and regulations.',
            'Regular usage reporting and compliance monitoring may be conducted.',
            'Platform updates and feature changes will be communicated in advance.',
            'Support and assistance will be provided as per your engagement level.',
            'Data privacy and security standards will be maintained throughout the engagement.',
            'Terms may be updated periodically with appropriate notice.'
          ]
        };
    }
  };

  const { title, terms } = getTermsForModel(engagementModel);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-48 w-full border rounded-lg p-4">
          <div className="space-y-3">
            {terms.map((term, index) => (
              <div key={index} className="flex gap-3">
                <div className="text-primary mt-1 font-medium text-sm">{index + 1}.</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{term}</p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
          <Checkbox
            id="agreement-checkbox"
            checked={agreementAccepted}
            onCheckedChange={(checked) => onAgreementChange(checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <label 
              htmlFor="agreement-checkbox" 
              className="text-sm font-medium leading-relaxed cursor-pointer"
            >
              I have read, understood, and agree to the terms and conditions outlined above for the {engagementModel} engagement model.
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              By checking this box, you confirm your acceptance of all terms and authorize the activation of your engagement.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckSquare className="w-4 h-4" />
          <span>Agreement acceptance is required to activate your engagement model</span>
        </div>
      </CardContent>
    </Card>
  );
};