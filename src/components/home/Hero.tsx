
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      
      <div className="container mx-auto px-4 text-center z-10">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <select className="bg-transparent border border-border rounded px-2 py-1 text-sm">
            <option>EN</option>
            <option>ES</option>
            <option>FR</option>
          </select>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Co-Invent the Future.
            <span className="block text-primary">One Challenge at a Time.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Where problem solvers meet problem owners to shape real-world solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" className="text-lg px-8 py-6 hover-scale">
              Launch a Challenge
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover-scale">
              Submit a Solution
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
