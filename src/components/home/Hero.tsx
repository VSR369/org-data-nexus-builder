
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSupabaseAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/challenges");
    } else {
      navigate("/auth?mode=signup");
    }
  };

  const handleLearnMore = () => {
    // Scroll to success stories section or navigate to resources
    const successStoriesSection = document.getElementById('success-stories');
    if (successStoriesSection) {
      successStoriesSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate("/resources");
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to CoInnovator
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Connect, collaborate, and innovate with organizations worldwide. 
          Join our platform to find solutions, share challenges, and build the future together.
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {isAuthenticated ? "Explore Challenges" : "Get Started"}
          </button>
          <button 
            onClick={handleLearnMore}
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};
