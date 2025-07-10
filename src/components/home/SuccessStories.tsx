
export const SuccessStories = () => {
  const stories = [
    {
      title: "Green Energy Innovation",
      description: "A startup found the perfect partner through our platform and developed a revolutionary solar panel technology that increased efficiency by 40%.",
      company: "EcoTech Solutions",
      impact: "40% efficiency increase"
    },
    {
      title: "Healthcare Breakthrough",
      description: "Medical researchers collaborated with tech innovators to create an AI-powered diagnostic tool that reduces diagnosis time by 60%.",
      company: "MedAI Labs",
      impact: "60% faster diagnosis"
    },
    {
      title: "Smart City Initiative",
      description: "Municipal government partnered with IoT specialists to implement a city-wide traffic optimization system, reducing congestion by 35%.",
      company: "CityFlow Systems",
      impact: "35% less traffic"
    }
  ];

  return (
    <section id="success-stories" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how organizations are transforming their challenges into breakthrough innovations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100">
              <div className="mb-4">
                <div className="text-2xl font-bold text-blue-600 mb-2">{story.impact}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{story.title}</h3>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">{story.description}</p>
              <div className="text-sm font-medium text-blue-600">{story.company}</div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            View More Stories
          </button>
        </div>
      </div>
    </section>
  );
};
