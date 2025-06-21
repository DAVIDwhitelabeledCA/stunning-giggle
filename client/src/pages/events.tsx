import { useState } from "react";
import { FrontendUser } from "@shared/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate, formatTime, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EventsProps {
  user: FrontendUser;
}

export default function Events({ user }: EventsProps) {
  const [selectedView, setSelectedView] = useState<"upcoming" | "all">("upcoming");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: upcomingEvents = [], isLoading: upcomingLoading } = useQuery({
    queryKey: ['/api/events/upcoming'],
  });

  const { data: allEvents = [], isLoading: allLoading } = useQuery({
    queryKey: ['/api/events'],
  });

  const rsvpMutation = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: number; status: string }) => {
      return apiRequest("POST", `/api/events/${eventId}/rsvp`, {
        userId: user.id,
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: "RSVP Updated",
        description: "Your event response has been recorded.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update RSVP",
        variant: "destructive",
      });
    },
  });

  const handleRSVP = (eventId: number, status: string) => {
    rsvpMutation.mutate({ eventId, status });
  };

  const getEventColor = (startTime: string) => {
    const eventDate = new Date(startTime);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "bg-gray-500"; // Past event
    if (diffDays <= 1) return "bg-red-500"; // Today/Tomorrow
    if (diffDays <= 7) return "bg-primary"; // This week
    return "bg-blue-500"; // Future
  };

  const getEventStatus = (startTime: string) => {
    const eventDate = new Date(startTime);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: "Past", color: "bg-gray-100 text-gray-700" };
    if (diffDays === 0) return { label: "Today", color: "bg-red-100 text-red-700" };
    if (diffDays === 1) return { label: "Tomorrow", color: "bg-orange-100 text-orange-700" };
    if (diffDays <= 7) return { label: "This Week", color: "bg-primary-bg text-primary" };
    return { label: "Upcoming", color: "bg-blue-100 text-blue-700" };
  };

  const renderEventCard = (event: any) => {
    const eventDate = new Date(event.startTime);
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = eventDate.getDate();
    const status = getEventStatus(event.startTime);

    return (
      <Card key={event.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className={`${getEventColor(event.startTime)} text-white p-3 rounded-xl text-center min-w-16`}>
              <div className="text-xs font-medium">{month}</div>
              <div className="text-lg font-bold">{day}</div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-800 text-lg">{event.title}</h3>
                <Badge className={status.color}>{status.label}</Badge>
              </div>
              
              <p className="text-gray-600 mb-3">{event.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-clock text-primary"></i>
                  <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-map-marker-alt text-primary"></i>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-calendar text-primary"></i>
                  <span>{formatDate(event.startTime)}</span>
                </div>
                {event.maxAttendees && (
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-users text-primary"></i>
                    <span>Max {event.maxAttendees} attendees</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleRSVP(event.id, "attending")}
                  disabled={rsvpMutation.isPending}
                  className="bg-primary hover:bg-primary-dark text-white"
                  size="sm"
                >
                  <i className="fas fa-check mr-2"></i>
                  Attending
                </Button>
                <Button
                  onClick={() => handleRSVP(event.id, "maybe")}
                  disabled={rsvpMutation.isPending}
                  variant="outline"
                  size="sm"
                >
                  <i className="fas fa-question mr-2"></i>
                  Maybe
                </Button>
                <Button
                  onClick={() => handleRSVP(event.id, "declined")}
                  disabled={rsvpMutation.isPending}
                  variant="outline"
                  size="sm"
                >
                  <i className="fas fa-times mr-2"></i>
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const isLoading = selectedView === "upcoming" ? upcomingLoading : allLoading;
  const events = selectedView === "upcoming" ? upcomingEvents : allEvents;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Company Events</h1>
        <p className="text-gray-600">
          Stay updated with upcoming company events, meetings, and activities. RSVP to events you plan to attend.
        </p>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming" onClick={() => setSelectedView("upcoming")}>
            Upcoming Events
          </TabsTrigger>
          <TabsTrigger value="all" onClick={() => setSelectedView("all")}>
            All Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
              <i className="fas fa-calendar text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Upcoming Events</h3>
              <p className="text-gray-600">There are no events scheduled for the near future. Check back later!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map(renderEventCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {allLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : allEvents.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
              <i className="fas fa-calendar text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Events Available</h3>
              <p className="text-gray-600">No events have been scheduled yet. Contact your administrator to create events.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allEvents.map(renderEventCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-plus text-primary"></i>
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="p-4 h-auto flex flex-col items-center space-y-2">
              <i className="fas fa-calendar-plus text-primary text-xl"></i>
              <span className="text-sm font-medium">Schedule Event</span>
            </Button>
            <Button variant="outline" className="p-4 h-auto flex flex-col items-center space-y-2">
              <i className="fas fa-download text-primary text-xl"></i>
              <span className="text-sm font-medium">Export Calendar</span>
            </Button>
            <Button variant="outline" className="p-4 h-auto flex flex-col items-center space-y-2">
              <i className="fas fa-bell text-primary text-xl"></i>
              <span className="text-sm font-medium">Event Reminders</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
