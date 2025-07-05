
import { Hero } from "@/components/home/Hero";
import { TodaysEvents } from "@/components/home/TodaysEvents";
import { ChannelsMedia } from "@/components/home/ChannelsMedia";
import { LiveStats } from "@/components/home/LiveStats";
import { SuccessStories } from "@/components/home/SuccessStories";
import { SponsoredSection } from "@/components/home/SponsoredSection";
import { GlobalNavigation } from "@/components/home/GlobalNavigation";
import { TestimonialsPartners } from "@/components/home/TestimonialsPartners";
import { Footer } from "@/components/home/Footer";

const Index = () => {
  console.log('Index page is rendering...');
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to CoInnovator</h1>
        <p className="text-xl text-center text-muted-foreground mb-8">
          Your home page is loading. If you can see this message, the routing is working correctly.
        </p>
        <div className="text-center">
          <p className="text-lg">Testing home page components...</p>
        </div>
      </div>
      
      {/* Gradually add components back */}
      <GlobalNavigation />
      <Hero />
      <Footer />
    </div>
  );
};

export default Index;
