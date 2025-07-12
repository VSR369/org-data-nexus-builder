
import { GlobalNavigation } from "@/components/home/GlobalNavigation";
import { Footer } from "@/components/home/Footer";

const Community = () => {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation />
      <main className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Community</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with innovators, entrepreneurs, and organizations from around the world.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Community Hub</h3>
            <p className="text-gray-600">Coming soon - join our growing community!</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
