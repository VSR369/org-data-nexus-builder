
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Users, ArrowRight } from "lucide-react";

export const SuccessStories = () => {
  const successStories = [
    {
      id: 1,
      title: "Smart Grid Optimization Challenge",
      outcome: "Reduced energy costs by 32%",
      industry: "Energy",
      duration: "3 months",
      participants: 156,
      winningCompany: "EnergyTech Solutions",
      companyLogo: "/placeholder.svg",
      description: "Revolutionary AI algorithm that optimizes power distribution in real-time, resulting in significant cost savings and improved grid stability.",
      metrics: [
        { label: "Cost Reduction", value: "32%" },
        { label: "Efficiency Gain", value: "45%" },
        { label: "ROI", value: "280%" }
      ]
    },
    {
      id: 2,
      title: "Medical Diagnosis Acceleration",
      outcome: "Improved diagnosis speed by 65%",
      industry: "Healthcare",
      duration: "4 months",
      participants: 203,
      winningCompany: "MedAI Innovations",
      companyLogo: "/placeholder.svg",
      description: "Machine learning model that analyzes medical imaging data to assist radiologists in faster and more accurate diagnoses.",
      metrics: [
        { label: "Speed Improvement", value: "65%" },
        { label: "Accuracy Increase", value: "23%" },
        { label: "Patient Satisfaction", value: "91%" }
      ]
    },
    {
      id: 3,
      title: "Supply Chain Transparency Platform",
      outcome: "Increased transparency by 78%",
      industry: "Logistics",
      duration: "5 months",
      participants: 89,
      winningCompany: "ChainView Systems",
      companyLogo: "/placeholder.svg",
      description: "Blockchain-based solution providing end-to-end visibility in complex supply chains, enabling better decision-making and risk management.",
      metrics: [
        { label: "Transparency", value: "78%" },
        { label: "Risk Reduction", value: "42%" },
        { label: "Processing Time", value: "-56%" }
      ]
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Success Stories</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how innovative solutions are transforming industries worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {successStories.map((story) => (
            <Card key={story.id} className="group hover:shadow-xl transition-all duration-300 hover-scale overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline">{story.industry}</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {story.duration}
                  </div>
                </div>
                
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  {story.title}
                </CardTitle>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {story.participants} participants
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    {story.outcome}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {story.description}
                </CardDescription>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2">
                  {story.metrics.map((metric, index) => (
                    <div key={index} className="text-center p-2 bg-muted/50 rounded">
                      <div className="font-bold text-primary">{metric.value}</div>
                      <div className="text-xs text-muted-foreground">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Winner Info */}
                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                  <img 
                    src={story.companyLogo} 
                    alt={story.winningCompany}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{story.winningCompany}</p>
                    <p className="text-xs text-muted-foreground">Winning Solution</p>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Read Case Study
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="hover-scale">
            View All Success Stories
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
