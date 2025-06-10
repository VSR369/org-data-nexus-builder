
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Headphones, BookOpen, Newspaper } from "lucide-react";

export const ChannelsMedia = () => {
  const mediaChannels = [
    {
      id: 1,
      title: "Innovation Talks",
      type: "YouTube",
      icon: <Youtube className="h-8 w-8 text-red-500" />,
      description: "Watch expert interviews and solution showcases",
      thumbnail: "/placeholder.svg",
      action: "Watch",
      count: "125 Videos"
    },
    {
      id: 2,
      title: "Problem Solver Podcast",
      type: "Podcast",
      icon: <Headphones className="h-8 w-8 text-purple-500" />,
      description: "Listen to success stories and innovation insights",
      thumbnail: "/placeholder.svg",
      action: "Listen",
      count: "48 Episodes"
    },
    {
      id: 3,
      title: "Innovation Blog",
      type: "Blog",
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      description: "Read in-depth articles on emerging technologies",
      thumbnail: "/placeholder.svg",
      action: "Read",
      count: "200+ Articles"
    },
    {
      id: 4,
      title: "Platform Newsroom",
      type: "News",
      icon: <Newspaper className="h-8 w-8 text-green-500" />,
      description: "Stay updated with platform announcements and features",
      thumbnail: "/placeholder.svg",
      action: "Read",
      count: "Latest Updates"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Channels & Media</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our content ecosystem for insights, stories, and updates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mediaChannels.map((channel) => (
            <Card 
              key={channel.id} 
              className="group hover:shadow-xl transition-all duration-300 hover-scale cursor-pointer overflow-hidden"
            >
              <div className="relative">
                <img 
                  src={channel.thumbnail} 
                  alt={channel.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  {channel.icon}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-medium">{channel.count}</p>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">{channel.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {channel.description}
                </p>
                <Button 
                  className="w-full hover-scale" 
                  variant="outline"
                  size="sm"
                >
                  {channel.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
