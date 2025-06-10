
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

export const SponsoredSection = () => {
  const [currentAd, setCurrentAd] = useState(0);

  const sponsoredContent = [
    {
      id: 1,
      title: "Advanced Analytics Platform",
      company: "DataTech Solutions",
      image: "/placeholder.svg",
      description: "Transform your business intelligence with our cutting-edge analytics platform. Get insights that drive results.",
      cta: "Learn More",
      link: "#",
      type: "Product"
    },
    {
      id: 2,
      title: "Cloud Infrastructure Summit 2024",
      company: "CloudNext Conference",
      image: "/placeholder.svg",
      description: "Join industry leaders at the premier cloud computing event. Early bird tickets now available.",
      cta: "Register Now",
      link: "#",
      type: "Event"
    },
    {
      id: 3,
      title: "AI Development Bootcamp",
      company: "TechEd Academy",
      image: "/placeholder.svg",
      description: "Master AI and machine learning in our intensive 12-week program. 90% job placement rate.",
      cta: "Apply Today",
      link: "#",
      type: "Education"
    },
    {
      id: 4,
      title: "Sustainable Tech Innovation Fund",
      company: "GreenVentures Capital",
      image: "/placeholder.svg",
      description: "Funding opportunities for clean technology startups. Up to $2M in seed funding available.",
      cta: "Apply for Funding",
      link: "#",
      type: "Funding"
    }
  ];

  // Auto-rotate ads every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % sponsoredContent.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sponsoredContent.length]);

  const nextAd = () => {
    setCurrentAd((prev) => (prev + 1) % sponsoredContent.length);
  };

  const prevAd = () => {
    setCurrentAd((prev) => (prev - 1 + sponsoredContent.length) % sponsoredContent.length);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Product": return "bg-blue-500";
      case "Event": return "bg-orange-500";
      case "Education": return "bg-green-500";
      case "Funding": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs">
              Sponsored
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold">Featured Partners</h2>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover innovative solutions and opportunities from our trusted partners
          </p>
        </div>

        {/* Rotating Ad Section */}
        <div className="relative max-w-4xl mx-auto mb-8">
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative">
              <img 
                src={sponsoredContent[currentAd].image}
                alt={sponsoredContent[currentAd].title}
                className="w-full h-64 md:h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              
              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                onClick={prevAd}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                onClick={nextAd}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="p-8 text-white max-w-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${getTypeColor(sponsoredContent[currentAd].type)}`}></div>
                    <Badge variant="secondary" className="text-xs">
                      {sponsoredContent[currentAd].type}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">
                    {sponsoredContent[currentAd].title}
                  </h3>
                  
                  <p className="text-sm opacity-90 mb-2">
                    by {sponsoredContent[currentAd].company}
                  </p>
                  
                  <p className="mb-4 opacity-80 leading-relaxed">
                    {sponsoredContent[currentAd].description}
                  </p>
                  
                  <Button 
                    className="bg-white text-black hover:bg-gray-100"
                    size="sm"
                  >
                    {sponsoredContent[currentAd].cta}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {sponsoredContent.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentAd ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
                onClick={() => setCurrentAd(index)}
              />
            ))}
          </div>
        </div>

        {/* Grid Ads */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsoredContent.slice(1, 4).map((ad) => (
            <Card key={ad.id} className="group hover:shadow-lg transition-all duration-300 hover-scale">
              <div className="relative">
                <img 
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-40 object-cover"
                />
                <Badge 
                  className="absolute top-2 left-2 text-xs"
                  variant="secondary"
                >
                  {ad.type}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {ad.title}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  by {ad.company}
                </p>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {ad.description}
                </p>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  {ad.cta}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
