import { FrontendUser } from "@shared/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTimeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface NotificationsProps {
  user: FrontendUser;
}

export default function Notifications({ user }: NotificationsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: [`/api/notifications/${user.id}`],
    enabled: !!user.id,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      return apiRequest("PATCH", `/api/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/notifications/${user.id}`] });
      toast({
        title: "Notification marked as read",
        description: "The notification has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark notification as read",
        variant: "destructive",
      });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'error':
        return 'fas fa-times-circle';
      case 'success':
        return 'fas fa-check-circle';
      default:
        return 'fas fa-info-circle';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-500 border-l-yellow-500';
      case 'error':
        return 'text-red-500 border-l-red-500';
      case 'success':
        return 'text-green-500 border-l-green-500';
      default:
        return 'text-blue-500 border-l-blue-500';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'normal':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h1>
          <p className="text-gray-600">Loading your notifications...</p>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h1>
        <p className="text-gray-600">
          You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''} out of {notifications.length} total.
        </p>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
          <i className="fas fa-bell-slash text-gray-400 text-4xl mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Notifications</h3>
          <p className="text-gray-600">You're all caught up! Check back later for new updates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${getNotificationColor(notification.type)} ${
                !notification.isRead ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <i className={`${getNotificationIcon(notification.type)} ${getNotificationColor(notification.type)} mt-1`}></i>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-semibold text-gray-800">{notification.title}</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityBadge(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <span className="text-xs text-gray-500">{getTimeAgo(notification.createdAt!)}</span>
                  </div>
                </div>
                {!notification.isRead && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsReadMutation.mutate(notification.id)}
                    disabled={markAsReadMutation.isPending}
                    className="ml-4"
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
