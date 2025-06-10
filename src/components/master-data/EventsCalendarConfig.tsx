import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus, Edit, Trash2, Clock, MapPin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type EventType = 'conference' | 'workshop' | 'webinar' | 'networking' | 'other';

interface EventConfig {
  id: string;
  title: string;
  description: string;
  type: EventType;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  registrationDeadline: string;
  isActive: boolean;
}

const EventsCalendarConfig = () => {
  const [events, setEvents] = useState<EventConfig[]>([
    {
      id: '1',
      title: 'Innovation Summit 2024',
      description: 'Annual summit for showcasing breakthrough innovations',
      type: 'conference',
      startDate: '2024-06-15',
      endDate: '2024-06-17',
      location: 'Tech Convention Center',
      maxParticipants: 500,
      registrationDeadline: '2024-06-01',
      isActive: true
    },
    {
      id: '2',
      title: 'AI Workshop Series',
      description: 'Hands-on workshop for AI implementation',
      type: 'workshop',
      startDate: '2024-07-10',
      endDate: '2024-07-10',
      location: 'Virtual Platform',
      maxParticipants: 50,
      registrationDeadline: '2024-07-05',
      isActive: true
    }
  ]);

  const [message, setMessage] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventConfig | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'conference' as EventType,
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: 100,
    registrationDeadline: ''
  });

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...formData }
          : event
      ));
      showMessage('Event updated successfully!');
      setEditingEvent(null);
    } else {
      const newEvent: EventConfig = {
        id: Date.now().toString(),
        ...formData,
        isActive: true
      };
      setEvents([...events, newEvent]);
      showMessage('Event created successfully!');
    }
    
    setFormData({
      title: '',
      description: '',
      type: 'conference',
      startDate: '',
      endDate: '',
      location: '',
      maxParticipants: 100,
      registrationDeadline: ''
    });
  };

  const handleEdit = (event: EventConfig) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      type: event.type,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      maxParticipants: event.maxParticipants,
      registrationDeadline: event.registrationDeadline
    });
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    showMessage('Event deleted successfully!');
  };

  const eventTypeColors = {
    conference: 'bg-blue-100 text-blue-800',
    workshop: 'bg-green-100 text-green-800',
    webinar: 'bg-purple-100 text-purple-800',
    networking: 'bg-orange-100 text-orange-800',
    other: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Events Calendar Configuration</h2>
        <p className="text-lg text-muted-foreground">
          Manage and configure events, workshops, and activities for the platform
        </p>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </CardTitle>
            <CardDescription>
              {editingEvent ? 'Update event details' : 'Create a new event configuration'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Event description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Event Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as EventType})}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  >
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="webinar">Webinar</option>
                    <option value="networking">Networking</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Event location or platform"
                />
              </div>

              <div>
                <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                <Input
                  id="registrationDeadline"
                  type="date"
                  value={formData.registrationDeadline}
                  onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </Button>
                {editingEvent && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEditingEvent(null);
                      setFormData({
                        title: '',
                        description: '',
                        type: 'conference',
                        startDate: '',
                        endDate: '',
                        location: '',
                        maxParticipants: 100,
                        registrationDeadline: ''
                      });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Configured Events ({events.length})
            </CardTitle>
            <CardDescription>
              Manage existing event configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {events.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${eventTypeColors[event.type]}`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {event.startDate} - {event.endDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Max: {event.maxParticipants} participants
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventsCalendarConfig;
