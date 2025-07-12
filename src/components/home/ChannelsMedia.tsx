
export const ChannelsMedia = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Media & Channels
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📺</span>
            </div>
            <h3 className="font-semibold mb-2">Video Content</h3>
            <p className="text-gray-600">Webinars and tutorials</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold mb-2">Social Media</h3>
            <p className="text-gray-600">Follow us for updates</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📰</span>
            </div>
            <h3 className="font-semibold mb-2">Newsletter</h3>
            <p className="text-gray-600">Weekly insights</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎧</span>
            </div>
            <h3 className="font-semibold mb-2">Podcast</h3>
            <p className="text-gray-600">Expert interviews</p>
          </div>
        </div>
      </div>
    </section>
  );
};
