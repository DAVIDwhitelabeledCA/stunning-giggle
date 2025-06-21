import { Link } from "wouter";
import { FrontendUser } from "@shared/schema";
import { MessageCircle, Users, ChevronRight } from "lucide-react";

interface ChatPreviewProps {
  user: FrontendUser;
}

export default function ChatPreview({ user }: ChatPreviewProps) {
  // Sample chat data for mobile demonstration
  const sampleChats = [
    {
      id: 1,
      name: "General Discussion",
      description: "Welcome everyone! Feel free to share updates and ask questions here.",
      memberCount: 24,
      lastMessage: "2 hours ago",
      unreadCount: 3,
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Engineering Team",
      description: "Great work on the latest deployment! The new features are performing well.",
      memberCount: 12,
      lastMessage: "1 hour ago", 
      unreadCount: 1,
      color: "bg-green-500"
    },
    {
      id: 3,
      name: "Marketing & Sales",
      description: "Q1 marketing campaign results are in - exceeded targets by 25%!",
      memberCount: 8,
      lastMessage: "30 minutes ago",
      unreadCount: 2,
      color: "bg-purple-500"
    }
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Team Chats</h3>
        <Link href="/chat">
          <a className="flex items-center text-primary text-sm font-medium hover:text-primary-dark transition-colors">
            View All <ChevronRight size={16} className="ml-1" />
          </a>
        </Link>
      </div>
      
      <div className="space-y-3">
        {sampleChats.map((room) => (
          <Link key={room.id} href={`/chat/${room.id}`}>
            <a className="bg-white dark:bg-gray-800 rounded-2xl card-depth block hover:mobile-shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-12 h-12 ${room.color} rounded-xl flex items-center justify-center mobile-shadow`}>
                    <Users size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{room.name}</h4>
                      {room.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 leading-relaxed">
                      {room.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Users size={12} className="mr-1" />
                        {room.memberCount} members
                      </div>
                      <span>{room.lastMessage}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
}
