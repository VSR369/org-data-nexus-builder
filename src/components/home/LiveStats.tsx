
export const LiveStats = () => {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Platform Statistics
        </h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">10,000+</div>
            <div className="text-blue-100">Active Organizations</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">25,000+</div>
            <div className="text-blue-100">Challenges Solved</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">50+</div>
            <div className="text-blue-100">Countries</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">95%</div>
            <div className="text-blue-100">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};
