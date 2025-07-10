
export const SuccessStories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Success Stories
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-8 rounded-lg">
            <blockquote className="text-lg text-gray-700 mb-4">
              "CoInnovator helped us find the perfect technology partner for our digital transformation. 
              The collaboration exceeded our expectations."
            </blockquote>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                JD
              </div>
              <div>
                <div className="font-semibold">John Doe</div>
                <div className="text-gray-600">CEO, TechCorp</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg">
            <blockquote className="text-lg text-gray-700 mb-4">
              "The platform's matching algorithm connected us with organizations that shared our vision. 
              We've launched three successful joint ventures."
            </blockquote>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                SJ
              </div>
              <div>
                <div className="font-semibold">Sarah Johnson</div>
                <div className="text-gray-600">Founder, InnovateLab</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
