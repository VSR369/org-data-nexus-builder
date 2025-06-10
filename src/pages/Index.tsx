
import { Hero } from "@/components/home/Hero";
import { TodaysEvents } from "@/components/home/TodaysEvents";
import { ChannelsMedia } from "@/components/home/ChannelsMedia";
import { LiveStats } from "@/components/home/LiveStats";
import { SuccessStories } from "@/components/home/SuccessStories";
import { SponsoredSection } from "@/components/home/SponsoredSection";
import { GlobalNavigation } from "@/components/home/GlobalNavigation";
import { TestimonialsPartners } from "@/components/home/TestimonialsPartners";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Index = () => {
  console.log('Index page rendered');

  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation />
      <main>
        {/* Test Button - Remove this later */}
        <div className="fixed top-24 right-4 z-50">
          <Button 
            onClick={() => {
              console.log('Test button clicked - page is working');
              alert('Page is working! Now try the Sign In button in the navigation.');
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-lg"
          >
            TEST - Click Me
          </Button>
        </div>
        
        <Hero />
        <TodaysEvents />
        <ChannelsMedia />
        <LiveStats />
        <SuccessStories />
        <SponsoredSection />
        <TestimonialsPartners />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
