
export const SponsoredSection = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Featured Partners
        </h2>
        <div className="grid md:grid-cols-4 gap-8 items-center">
          <div className="text-center">
            <div className="w-32 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto">
              <span className="text-gray-500 font-bold">PARTNER 1</span>
            </div>
          </div>
          <div className="text-center">
            <div className="w-32 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto">
              <span className="text-gray-500 font-bold">PARTNER 2</span>
            </div>
          </div>
          <div className="text-center">
            <div className="w-32 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto">
              <span className="text-gray-500 font-bold">PARTNER 3</span>
            </div>
          </div>
          <div className="text-center">
            <div className="w-32 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto">
              <span className="text-gray-500 font-bold">PARTNER 4</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
