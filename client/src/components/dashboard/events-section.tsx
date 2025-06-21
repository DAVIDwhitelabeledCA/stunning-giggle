import { Link } from "wouter";
import { FrontendUser } from "@shared/schema";
import { Calendar, Clock, MapPin, ChevronRight, Users } from "lucide-react";

interface EventsSectionProps {
  user: FrontendUser;
}

export default function EventsSection({ user }: EventsSectionProps) {
  // Sample events data for mobile demonstration
  const sampleEvents = [
    {
      id: 1,
      title: "All-Hands Company Meeting",
      description: "Monthly company update covering quarterly results and upcoming projects.",
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      location: "Main Conference Room",
      attendees: 45
    },
    {
      id: 2,
      title: "Team Building Workshop",
      description: "Interactive activities to strengthen collaboration across departments.",
      startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      location: "Recreation Center",
      attendees: 32
    }
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Upcoming Events</h3>
        <Link href="/events">
          <a className="flex items-center text-primary text-sm font-medium hover:text-primary-dark transition-colors">
            View All <ChevronRight size={16} className="ml-1" />
          </a>
        </Link>
      </div>
      
      <div className="space-y-3">
        {sampleEvents.map((event) => {
          const eventDate = new Date(event.startTime);
          const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
          const day = eventDate.getDate();
          const time = eventDate.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          });

          return (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-2xl card-depth hover:mobile-shadow-lg transition-shadow cursor-pointer">
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-3 rounded-xl text-center min-w-[60px] mobile-shadow">
                    <div className="text-xs font-medium">{month}</div>
                    <div className="text-lg font-bold">{day}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm leading-tight">{event.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{event.description}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {time}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={12} className="mr-1" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users size={12} className="mr-1" />
                        {event.attendees}
                      </div>
                    </div>
                  </div>
                  <button className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-xs font-medium hover:bg-primary/30 transition-colors button-depth">
                    RSVP
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
