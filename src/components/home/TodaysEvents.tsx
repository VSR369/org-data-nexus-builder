
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Filter, Users, Video } from "lucide-react";

export const TodaysEvents = () => {
  const [filter, setFilter] = useState("All");

  const events = [
    {
      id: 1,
      title: "AI in Healthcare: Expert AMA",
      time: "2:00 PM - 3:30 PM EST",
      type: "AMA",
      industry: "Healthcare",
      summary: "Join leading AI experts discussing breakthrough applications in medical diagnosis and treatment.",
      participants: 245,
      status: "Live Soon"
    },
    {
      id: 2,
      title: "Sustainable Energy Challenge",
      time: "11:59 PM EST",
      type: "Deadline",
      industry: "Energy",
      summary: "Final day to submit solutions for renewable energy optimization challenge.",
      participants: 89,
      status: "Deadline Today"
    },
    {
      id: 3,
      title: "Fintech Innovation Webinar",
      time: "4:00 PM - 5:00 PM EST",
      type: "Webinar",
      industry: "Finance",
      summary: "Exploring the latest trends in financial technology and digital banking solutions.",
      participants: 156,
      status: "Register"
    },
    {
      id: 4,
      title: "Supply Chain Optimization Workshop",
      time: "6:00 PM - 7:30 PM EST",
      type: "Workshop",
      industry: "Logistics",
      summary: "Hands-on session on improving supply chain efficiency using IoT and AI.",
      participants: 78,
      status: "Join Now"
    }
  ];

  const eventTypes = ["All", "Webinar", "AMA", "Deadline", "Workshop"];

  const filteredEvents = filter === "All" 
    ? events 
    : events.filter(event => event.type === filter);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "AMA": return <Users className="h-4 w-4" />;
      case "Webinar": return <Video className="h-4 w-4" />;
      case "Workshop": return <Users className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live Soon": return "bg-orange-500";
      case "Deadline Today": return "bg-red-500";
      case "Register": return "bg-blue-500";
      default: return "bg-green-500";
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Today's Events</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't miss out on today's webinars, deadlines, and expert sessions
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Filter className="h-5 w-5 text-muted-foreground mr-2" />
          {eventTypes.map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(type)}
              className="hover-scale"
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-all duration-300 hover-scale">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    {getEventIcon(event.type)}
                    <Badge variant="secondary">{event.type}</Badge>
                    <Badge variant="outline">{event.industry}</Badge>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`}></div>
                </div>
                <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {event.participants}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="mb-4">
                  {event.summary}
                </CardDescription>
                <Button 
                  className="w-full hover-scale"
                  variant={event.status === "Deadline Today" ? "destructive" : "default"}
                >
                  {event.status}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found for the selected filter.</p>
          </div>
        )}
      </div>
    </section>
  );
};
