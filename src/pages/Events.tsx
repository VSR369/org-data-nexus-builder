
import { GlobalNavigation } from "@/components/home/GlobalNavigation";
import { Footer } from "@/components/home/Footer";

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation />
      <main className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Events</h1>
        <p className="text-xl text-gray-600 mb-8">
          Join upcoming events, workshops, and networking opportunities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Upcoming Event</h3>
            <p className="text-gray-600">Coming soon - exciting events await!</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
