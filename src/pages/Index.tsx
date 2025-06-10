
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
  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation />
      <main>
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
