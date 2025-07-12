
export const TestimonialsPartners = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What Our Community Says
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <blockquote className="text-gray-700 mb-4">
              "Amazing platform for collaboration and innovation."
            </blockquote>
            <div className="font-semibold">Alex Chen</div>
            <div className="text-gray-600">Innovation Director</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <blockquote className="text-gray-700 mb-4">
              "Found incredible partners through this platform."
            </blockquote>
            <div className="font-semibold">Maria Rodriguez</div>
            <div className="text-gray-600">Startup Founder</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <blockquote className="text-gray-700 mb-4">
              "The networking opportunities are unmatched."
            </blockquote>
            <div className="font-semibold">David Park</div>
            <div className="text-gray-600">Tech Entrepreneur</div>
          </div>
        </div>
      </div>
    </section>
  );
};
