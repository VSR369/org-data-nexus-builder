
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Lightbulb, Trophy, Globe, ToggleLeft } from "lucide-react";

export const LiveStats = () => {
  const [showIndustryStats, setShowIndustryStats] = useState(false);
  const [counters, setCounters] = useState({
    seekers: 0,
    providers: 0,
    challenges: 0,
    solutions: 0
  });

  const finalStats = {
    seekers: 15420,
    providers: 8935,
    challenges: 1247,
    solutions: 3892
  };

  const industryStats = {
    healthcare: 2840,
    fintech: 1950,
    energy: 1120,
    logistics: 890
  };

  // Animated counter effect
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepTime = duration / steps;

    const intervals = Object.keys(finalStats).map(key => {
      const finalValue = finalStats[key as keyof typeof finalStats];
      const increment = finalValue / steps;
      let current = 0;
      let step = 0;

      return setInterval(() => {
        if (step < steps) {
          current += increment;
          setCounters(prev => ({
            ...prev,
            [key]: Math.floor(current)
          }));
          step++;
        } else {
          setCounters(prev => ({
            ...prev,
            [key]: finalValue
          }));
        }
      }, stepTime);
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, []);

  const statCards = [
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      label: "Solution Seekers",
      value: counters.seekers,
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      icon: <Target className="h-8 w-8 text-green-500" />,
      label: "Solution Providers",
      value: counters.providers,
      color: "from-green-500/20 to-green-600/20"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
      label: "Challenges Launched",
      value: counters.challenges,
      color: "from-yellow-500/20 to-yellow-600/20"
    },
    {
      icon: <Trophy className="h-8 w-8 text-purple-500" />,
      label: "Solutions Received",
      value: counters.solutions,
      color: "from-purple-500/20 to-purple-600/20"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Platform Stats</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Real-time insights into our growing innovation community
          </p>
          
          {/* Toggle for Industry Stats */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Global</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowIndustryStats(!showIndustryStats)}
              className="p-1"
            >
              <ToggleLeft className={`h-6 w-6 transition-transform ${showIndustryStats ? 'rotate-180' : ''}`} />
            </Button>
            <span className="text-sm text-muted-foreground">By Industry</span>
          </div>
        </div>

        {!showIndustryStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden bg-gradient-to-br ${stat.color} border-0 hover:shadow-lg transition-all duration-300 hover-scale`}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2 font-mono">
                    {stat.value.toLocaleString()}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.entries(industryStats).map(([industry, value]) => (
              <Card key={industry} className="hover:shadow-lg transition-all duration-300 hover-scale">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-2 font-mono">
                    {value.toLocaleString()}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground capitalize">
                    {industry}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Last Updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </section>
  );
};
