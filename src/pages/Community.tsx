
import { GlobalNavigation } from "@/components/home/GlobalNavigation";
import { Footer } from "@/components/home/Footer";

const Community = () => {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Community</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connect with fellow innovators and problem solvers
          </p>
          <div className="bg-muted/30 rounded-lg p-8">
            <p className="text-muted-foreground">
              Community forums and networking features coming soon...
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
