
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface CompetencyData {
  [domainGroup: string]: {
    [category: string]: {
      [subCategory: string]: number;
    };
  };
}

interface CompetencyAssessmentTabProps {
  selectedIndustrySegment: string;
  competencyData: CompetencyData;
  updateCompetencyData: (domainGroup: string, category: string, subCategory: string, rating: number) => void;
}

// Mock competency structure based on industry segment
const getCompetencyStructure = (industrySegment: string) => {
  const structures: { [key: string]: any } = {
    bfsi: {
      "Digital Banking": {
        "Core Banking Systems": ["Account Management", "Transaction Processing", "Payment Systems"],
        "Digital Channels": ["Mobile Banking", "Internet Banking", "API Integration"]
      },
      "Risk Management": {
        "Credit Risk": ["Credit Scoring", "Portfolio Management", "Default Prediction"],
        "Operational Risk": ["Process Automation", "Compliance Monitoring", "Fraud Detection"]
      }
    },
    retail: {
      "E-commerce Platform": {
        "Customer Experience": ["User Interface Design", "Shopping Cart", "Checkout Process"],
        "Inventory Management": ["Stock Control", "Order Fulfillment", "Supply Chain"]
      },
      "Data Analytics": {
        "Customer Analytics": ["Behavior Analysis", "Personalization", "Recommendation Engine"],
        "Sales Analytics": ["Performance Metrics", "Trend Analysis", "Forecasting"]
      }
    },
    healthcare: {
      "Health Information Systems": {
        "Electronic Health Records": ["Patient Data Management", "Clinical Documentation", "Interoperability"],
        "Medical Imaging": ["DICOM Systems", "Image Processing", "Diagnostic Tools"]
      },
      "Telemedicine": {
        "Remote Consultation": ["Video Conferencing", "Patient Monitoring", "Digital Diagnosis"],
        "Mobile Health": ["Health Apps", "Wearable Integration", "Data Collection"]
      }
    }
  };

  return structures[industrySegment] || {};
};

const getIndustrySegmentName = (value: string) => {
  const names: { [key: string]: string } = {
    bfsi: "Banking, Financial Services & Insurance (BFSI)",
    retail: "Retail & E-Commerce",
    healthcare: "Healthcare & Life Sciences",
    it: "Information Technology & Software Services",
    telecom: "Telecommunications",
    education: "Education & EdTech",
    manufacturing: "Manufacturing",
    logistics: "Logistics & Supply Chain"
  };
  return names[value] || value;
};

const CompetencyAssessmentTab: React.FC<CompetencyAssessmentTabProps> = ({
  selectedIndustrySegment,
  competencyData,
  updateCompetencyData
}) => {
  if (!selectedIndustrySegment) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Core Competencies Assessment</h3>
        <p className="text-muted-foreground">
          Please select an Industry Segment in Basic Information to enable competency ratings.
        </p>
      </div>
    );
  }

  const competencyStructure = getCompetencyStructure(selectedIndustrySegment);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Selected Industry Segment</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {getIndustrySegmentName(selectedIndustrySegment)}
          </Badge>
        </CardContent>
      </Card>

      {Object.keys(competencyStructure).length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Competency Structure</h3>
            <p className="text-muted-foreground">
              Competency assessment structure for this industry segment is being configured.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(competencyStructure).map(([domainGroup, categories]) => (
            <Card key={domainGroup}>
              <CardHeader>
                <CardTitle className="text-lg">{domainGroup}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(categories).map(([category, subCategories]) => (
                  <div key={category} className="space-y-4">
                    <h4 className="font-medium text-base">{category}</h4>
                    <div className="space-y-4 pl-4">
                      {(subCategories as string[]).map((subCategory) => {
                        const currentRating = competencyData[domainGroup]?.[category]?.[subCategory] || 0;
                        return (
                          <div key={subCategory} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label className="text-sm">{subCategory}</Label>
                              <span className="text-sm font-medium">
                                {currentRating}/10
                              </span>
                            </div>
                            <Slider
                              value={[currentRating]}
                              onValueChange={([value]) => 
                                updateCompetencyData(domainGroup, category, subCategory, value)
                              }
                              max={10}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompetencyAssessmentTab;
