import { Link } from "wouter";
import { FrontendUser } from "@shared/schema";
import { AlertCircle, CheckCircle, Info, AlertTriangle, ChevronRight } from "lucide-react";

interface NotificationsWidgetProps {
  user: FrontendUser;
}

export default function NotificationsWidget({ user }: NotificationsWidgetProps) {
  // Sample notifications for mobile demonstration
  const sampleNotifications = [
    {
      id: 1,
      title: "New Company Policy",
      message: "Updated remote work guidelines are now available for review.",
      type: "info",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      isRead: false
    },
    {
      id: 2,
      title: "Event Reminder",
      message: "All-hands meeting tomorrow at 2:00 PM in the main conference room.",
      type: "warning",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isRead: false
    },
    {
      id: 3,
      title: "System Update Complete",
      message: "Intranet system maintenance completed successfully.",
      type: "success",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertCircle;
      case 'success':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-l-yellow-500 text-yellow-700';
      case 'error':
        return 'bg-red-50 border-l-red-500 text-red-700';
      case 'success':
        return 'bg-green-50 border-l-green-500 text-green-700';
      default:
        return 'bg-blue-50 border-l-blue-500 text-blue-700';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Notifications</h3>
        <Link href="/notifications">
          <a className="flex items-center text-primary text-sm font-medium hover:text-primary-dark transition-colors">
            View All <ChevronRight size={16} className="ml-1" />
          </a>
        </Link>
      </div>
      
      <div className="space-y-3">
        {sampleNotifications.map((notification) => {
          const IconComponent = getNotificationIcon(notification.type);
          return (
            <div key={notification.id} className={`rounded-2xl p-4 border-l-4 card-depth hover:mobile-shadow-lg transition-shadow cursor-pointer ${getNotificationStyle(notification.type)}`}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <IconComponent size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">{notification.title}</p>
                      <p className="text-xs leading-relaxed mb-2">{notification.message}</p>
                      <span className="text-xs opacity-75">{formatTimeAgo(notification.createdAt)}</span>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
