
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TestimonialsPartners = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      quote: "CoInnovator transformed how we approach innovation challenges. The quality of solutions we received exceeded our expectations.",
      author: "Sarah Chen",
      role: "VP of Innovation",
      company: "TechGlobal Inc.",
      avatar: "/placeholder.svg",
      rating: 5,
      metrics: "Reduced R&D costs by 40%"
    },
    {
      id: 2,
      quote: "As a solution provider, this platform opened doors to opportunities I never knew existed. The support system is incredible.",
      author: "Dr. Marcus Rodriguez",
      role: "AI Research Lead",
      company: "DataMind Solutions",
      avatar: "/placeholder.svg",
      rating: 5,
      metrics: "Won 3 challenges in 6 months"
    },
    {
      id: 3,
      quote: "The collaborative environment here is unmatched. We've built lasting partnerships that go beyond individual challenges.",
      author: "Emma Thompson",
      role: "Chief Technology Officer",
      company: "GreenTech Innovations",
      avatar: "/placeholder.svg",
      rating: 5,
      metrics: "Formed 5+ strategic partnerships"
    }
  ];

  const partners = [
    { name: "Microsoft", logo: "/placeholder.svg" },
    { name: "IBM", logo: "/placeholder.svg" },
    { name: "Google", logo: "/placeholder.svg" },
    { name: "Amazon", logo: "/placeholder.svg" },
    { name: "Tesla", logo: "/placeholder.svg" },
    { name: "Pfizer", logo: "/placeholder.svg" },
    { name: "Samsung", logo: "/placeholder.svg" },
    { name: "Oracle", logo: "/placeholder.svg" },
    { name: "Intel", logo: "/placeholder.svg" },
    { name: "Cisco", logo: "/placeholder.svg" },
    { name: "Adobe", logo: "/placeholder.svg" },
    { name: "Salesforce", logo: "/placeholder.svg" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Testimonials Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Community Says</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Real stories from solution seekers and providers who are shaping the future
          </p>

          <div className="relative max-w-4xl mx-auto">
            <Card className="bg-primary/5 border-0 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="relative">
                  <Quote className="absolute -top-4 -left-4 h-8 w-8 text-primary/20" />
                  
                  <div className="text-center mb-8">
                    <blockquote className="text-lg md:text-xl leading-relaxed mb-6 italic">
                      "{testimonials[currentTestimonial].quote}"
                    </blockquote>
                    
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={testimonials[currentTestimonial].avatar} />
                        <AvatarFallback>
                          {testimonials[currentTestimonial].author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="text-left">
                        <p className="font-semibold text-lg">
                          {testimonials[currentTestimonial].author}
                        </p>
                        <p className="text-muted-foreground">
                          {testimonials[currentTestimonial].role}
                        </p>
                        <p className="text-sm text-primary">
                          {testimonials[currentTestimonial].company}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <div className="inline-block bg-primary/10 px-4 py-2 rounded-full">
                      <p className="text-sm font-medium text-primary">
                        {testimonials[currentTestimonial].metrics}
                      </p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevTestimonial}
                      className="hover-scale"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex gap-2">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentTestimonial ? 'bg-primary' : 'bg-muted-foreground/30'
                          }`}
                          onClick={() => setCurrentTestimonial(index)}
                        />
                      ))}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextTestimonial}
                      className="hover-scale"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Partners Section */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-8">Trusted by Industry Leaders</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="group cursor-pointer transition-all duration-300 hover-scale"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-12 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
