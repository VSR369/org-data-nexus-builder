
export const TodaysEvents = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Today's Events
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Innovation Workshop</h3>
            <p className="text-gray-600 mb-4">Join our interactive workshop on digital transformation</p>
            <span className="text-blue-600 font-medium">2:00 PM - 4:00 PM</span>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Networking Session</h3>
            <p className="text-gray-600 mb-4">Connect with like-minded professionals and entrepreneurs</p>
            <span className="text-blue-600 font-medium">5:00 PM - 6:30 PM</span>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Panel Discussion</h3>
            <p className="text-gray-600 mb-4">Future of collaborative innovation in business</p>
            <span className="text-blue-600 font-medium">7:00 PM - 8:30 PM</span>
          </div>
        </div>
      </div>
    </section>
  );
};
