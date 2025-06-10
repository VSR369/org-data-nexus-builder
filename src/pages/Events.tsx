
import { GlobalNavigation } from "@/components/home/GlobalNavigation";
import { Footer } from "@/components/home/Footer";

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Events</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Join webinars, workshops, and networking events
          </p>
          <div className="bg-muted/30 rounded-lg p-8">
            <p className="text-muted-foreground">
              Event calendar and registration functionality coming soon...
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
