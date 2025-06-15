
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { MasterDataSeeder } from '@/utils/masterDataSeeder';
import { useToast } from "@/hooks/use-toast";

interface ValidationResult {
  isValid: boolean;
  issues: string[];
  currencyCount: number;
  entityTypeCount: number;
  membershipFeeCount: number;
}

export const MembershipFeeValidator = () => {
  const [validationResult, setValidationResult] = React.useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = React.useState(false);
  const { toast } = useToast();

  const runValidation = () => {
    setIsValidating(true);
    
    try {
      // Validate master data integrity
      const integrity = MasterDataSeeder.validateMasterDataIntegrity();
      
      // Get counts
      const membershipFees = JSON.parse(localStorage.getItem('master_data_seeker_membership_fees') || '[]');
      const currencies = JSON.parse(localStorage.getItem('master_data_currencies') || '[]');
      const entityTypes = JSON.parse(localStorage.getItem('master_data_entity_types') || '[]');
      
      const result: ValidationResult = {
        isValid: integrity.isValid && membershipFees.length > 0,
        issues: [
          ...integrity.issues,
          ...(membershipFees.length === 0 ? ['No membership fees configured'] : [])
        ],
        currencyCount: currencies.length,
        entityTypeCount: entityTypes.length,
        membershipFeeCount: membershipFees.length
      };
      
      setValidationResult(result);
      
      if (result.isValid) {
        toast({
          title: "Validation Passed",
          description: "All master data is properly configured.",
        });
      } else {
        toast({
          title: "Validation Issues Found",
          description: `Found ${result.issues.length} issue(s) that need attention.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: "Validation Error",
        description: "Failed to validate master data.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const seedMasterData = () => {
    try {
      MasterDataSeeder.seedAllMasterData();
      runValidation();
      toast({
        title: "Master Data Seeded",
        description: "Default master data has been initialized.",
      });
    } catch (error) {
      console.error('Seeding error:', error);
      toast({
        title: "Seeding Error",
        description: "Failed to seed master data.",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    runValidation();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Master Data Validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runValidation} disabled={isValidating}>
            {isValidating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Validating...
              </>
            ) : (
              'Run Validation'
            )}
          </Button>
          <Button onClick={seedMasterData} variant="outline">
            Seed Default Data
          </Button>
        </div>

        {validationResult && (
          <div className="space-y-4">
            <Alert variant={validationResult.isValid ? "default" : "destructive"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {validationResult.isValid 
                  ? "All master data is properly configured and ready for use."
                  : `Found ${validationResult.issues.length} issue(s) that need attention.`
                }
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{validationResult.currencyCount}</div>
                <Badge variant="outline">Currencies</Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{validationResult.entityTypeCount}</div>
                <Badge variant="outline">Entity Types</Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{validationResult.membershipFeeCount}</div>
                <Badge variant="outline">Membership Fees</Badge>
              </div>
            </div>

            {validationResult.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Issues Found:</h4>
                {validationResult.issues.map((issue, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertDescription>{issue}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
