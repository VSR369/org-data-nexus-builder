
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Sparkles, Zap } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-violet-950/20 dark:via-blue-950/20 dark:to-cyan-950/20 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 via-blue-400/20 to-cyan-400/20 animate-pulse"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center z-10 pt-8">
        {/* Language Selector */}
        <div className="absolute top-8 right-8 flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <select className="bg-white/80 backdrop-blur-sm border border-primary/30 rounded-lg px-3 py-2 text-sm shadow-lg hover:shadow-xl transition-all">
            <option>EN</option>
            <option>ES</option>
            <option>FR</option>
          </select>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Floating Elements */}
          <div className="relative">
            <Sparkles className="absolute -top-8 left-1/4 h-6 w-6 text-yellow-400 animate-spin" />
            <Zap className="absolute -top-4 right-1/3 h-5 w-5 text-blue-500 animate-bounce" />
            
            <h1 className="text-4xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Co-Invent the Future.
              </span>
              <span className="block bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent mt-2">
                One Challenge at a Time.
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
            Where <span className="text-primary font-semibold">problem solvers</span> meet <span className="text-blue-600 font-semibold">problem owners</span> to shape real-world solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Button size="lg" className="group text-lg px-10 py-8 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl">
              <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
              Launch a Challenge
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="group text-lg px-10 py-8 bg-white/80 backdrop-blur-sm border-2 border-primary hover:bg-primary hover:text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl">
              <Zap className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Submit a Solution
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-2xl mx-auto">
            {[
              { label: "Active Challenges", value: "1,247" },
              { label: "Solutions Submitted", value: "3,892" },
              { label: "Problem Solvers", value: "15,420" },
              { label: "Success Stories", value: "324" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center bg-white/50 backdrop-blur-sm shadow-lg">
            <div className="w-1 h-3 bg-gradient-to-b from-primary to-blue-600 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
