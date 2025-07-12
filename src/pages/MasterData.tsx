
import { GlobalNavigation } from "@/components/home/GlobalNavigation";
import { Footer } from "@/components/home/Footer";

const MasterData = () => {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation />
      <main className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Master Data Portal</h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage and configure master data for the platform.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Data Management</h3>
          <p className="text-gray-600">Master data management features coming soon!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MasterData;
