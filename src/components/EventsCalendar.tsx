
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Plus, Edit, Trash2, MapPin, Users } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string;
  type: 'meeting' | 'workshop' | 'presentation' | 'other';
}

const EventsCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Innovation Workshop',
      description: 'Quarterly innovation workshop for team leads',
      date: new Date(),
      startTime: '09:00',
      endTime: '11:00',
      location: 'Conference Room A',
      attendees: 'Team Leads',
      type: 'workshop'
    },
    {
      id: '2',
      title: 'Product Demo',
      description: 'New product feature demonstration',
      date: addDays(new Date(), 1),
      startTime: '14:00',
      endTime: '15:30',
      location: 'Virtual Meeting',
      attendees: 'All Staff',
      type: 'presentation'
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    location: '',
    attendees: '',
    type: 'meeting' as Event['type']
  });
  const { toast } = useToast();

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getEventTypeColor = (type: Event['type']) => {
    const colors = {
      meeting: 'bg-blue-100 text-blue-800 border-blue-200',
      workshop: 'bg-green-100 text-green-800 border-green-200',
      presentation: 'bg-purple-100 text-purple-800 border-purple-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type];
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.startTime || !formData.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newEvent: Event = {
      id: selectedEvent ? selectedEvent.id : Date.now().toString(),
      ...formData,
    };

    if (selectedEvent) {
      setEvents(prev => prev.map(event => event.id === selectedEvent.id ? newEvent : event));
      toast({
        title: "Success",
        description: "Event updated successfully.",
      });
    } else {
      setEvents(prev => [...prev, newEvent]);
      toast({
        title: "Success",
        description: "Event created successfully.",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location || '',
      attendees: event.attendees || '',
      type: event.type
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast({
      title: "Success",
      description: "Event deleted successfully.",
    });
  };

  const resetForm = () => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      date: new Date(),
      startTime: '',
      endTime: '',
      location: '',
      attendees: '',
      type: 'meeting'
    });
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(selectedDate);
    
    return (
      <div className="grid grid-cols-8 gap-2 h-[600px]">
        {/* Time column */}
        <div className="border-r">
          <div className="h-12 border-b flex items-center justify-center font-medium text-sm">
            Time
          </div>
          <div className="space-y-0">
            {timeSlots.filter((_, i) => i >= 6 && i <= 20).map((time) => (
              <div key={time} className="h-12 border-b text-xs text-muted-foreground p-1 flex items-start">
                {time}
              </div>
            ))}
          </div>
        </div>

        {/* Day columns */}
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="border-r">
            <div className="h-12 border-b flex flex-col items-center justify-center">
              <div className="text-xs text-muted-foreground">
                {format(day, 'EEE')}
              </div>
              <div className={`text-sm font-medium ${isSameDay(day, new Date()) ? 'text-blue-600' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>
            <div className="space-y-0 relative">
              {timeSlots.filter((_, i) => i >= 6 && i <= 20).map((time, timeIndex) => (
                <div key={time} className="h-12 border-b relative">
                  {getEventsForDate(day)
                    .filter(event => event.startTime.startsWith(time.split(':')[0]))
                    .map((event) => (
                      <div
                        key={event.id}
                        className={`absolute inset-x-1 top-1 p-1 rounded text-xs border cursor-pointer hover:shadow-sm ${getEventTypeColor(event.type)}`}
                        onClick={() => handleEditEvent(event)}
                        style={{
                          height: '40px',
                          zIndex: 10
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs opacity-75">{event.startTime}-{event.endTime}</div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(selectedDate);
    
    return (
      <div className="grid grid-cols-2 gap-6 h-[600px]">
        <div className="border rounded-lg">
          <div className="p-4 border-b">
            <h3 className="font-medium">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
          </div>
          <div className="p-2">
            {timeSlots.filter((_, i) => i >= 6 && i <= 20).map((time) => (
              <div key={time} className="flex border-b h-12">
                <div className="w-16 text-xs text-muted-foreground p-2">
                  {time}
                </div>
                <div className="flex-1 relative">
                  {dayEvents
                    .filter(event => event.startTime.startsWith(time.split(':')[0]))
                    .map((event) => (
                      <div
                        key={event.id}
                        className={`absolute inset-x-1 top-1 p-1 rounded text-xs border cursor-pointer hover:shadow-sm ${getEventTypeColor(event.type)}`}
                        onClick={() => handleEditEvent(event)}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs opacity-75">{event.startTime}-{event.endTime}</div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Events Today</CardTitle>
            </CardHeader>
            <CardContent>
              {dayEvents.length === 0 ? (
                <p className="text-muted-foreground">No events scheduled</p>
              ) : (
                <div className="space-y-3">
                  {dayEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.startTime} - {event.endTime}
                            </span>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </span>
                            )}
                            {event.attendees && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {event.attendees}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Events Calendar
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {selectedEvent ? 'Edit Event' : 'Create New Event'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Event title"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Event description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Select value={formData.startTime} onValueChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="endTime">End Time *</Label>
                      <Select value={formData.endTime} onValueChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Event location"
                    />
                  </div>

                  <div>
                    <Label htmlFor="attendees">Attendees</Label>
                    <Input
                      id="attendees"
                      value={formData.attendees}
                      onChange={(e) => setFormData(prev => ({ ...prev, attendees: e.target.value }))}
                      placeholder="Who will attend"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Event Type</Label>
                    <Select value={formData.type} onValueChange={(value: Event['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="presentation">Presentation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {selectedEvent ? 'Update Event' : 'Create Event'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('day')}
              >
                Day
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(prev => addDays(prev, viewMode === 'day' ? -1 : -7))}
              >
                Previous
              </Button>
              <span className="font-medium">
                {viewMode === 'day' 
                  ? format(selectedDate, 'MMMM d, yyyy')
                  : format(selectedDate, 'MMMM yyyy')
                }
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(prev => addDays(prev, viewMode === 'day' ? 1 : 7))}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </Button>
            </div>
          </div>

          {viewMode === 'month' && (
            <div className="grid grid-cols-2 gap-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="border rounded-lg"
              />
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Events for {format(selectedDate, 'MMMM d, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getEventsForDate(selectedDate).length === 0 ? (
                      <p className="text-muted-foreground">No events scheduled</p>
                    ) : (
                      getEventsForDate(selectedDate).map((event) => (
                        <div
                          key={event.id}
                          className={`p-2 rounded border cursor-pointer hover:shadow-sm ${getEventTypeColor(event.type)}`}
                          onClick={() => handleEditEvent(event)}
                        >
                          <div className="font-medium text-sm">{event.title}</div>
                          <div className="text-xs opacity-75">{event.startTime} - {event.endTime}</div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsCalendar;
