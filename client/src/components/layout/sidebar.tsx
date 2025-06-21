import { Link, useLocation } from "wouter";
import { FrontendUser } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  Bell, 
  MessageCircle, 
  Newspaper, 
  Calendar, 
  Building, 
  Users, 
  User as UserIcon,
  Settings,
  LogOut,
  X,
  Shield
} from "lucide-react";

interface SidebarProps {
  user: FrontendUser;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const getMenuItems = (userLevel: number) => {
  const baseItems = [
    { path: "/", icon: Home, label: "Home", color: "text-pink-600" },
    { path: "/news", icon: Newspaper, label: "News", color: "text-blue-600" },
    { path: "/events", icon: Calendar, label: "Events", color: "text-green-600" },
    { path: "/chat", icon: MessageCircle, label: "Chats", color: "text-purple-600" },
    { path: "/departments", icon: Building, label: "Departments", color: "text-orange-600" },
    { path: "/notifications", icon: Bell, label: "Notifications", color: "text-red-600" },
  ];

  // Add admin panel for level 3 or above
  if (userLevel <= 3) {
    baseItems.push({ path: "/admin", icon: Shield, label: "Admin Panel", color: "text-red-600" });
  }

  return baseItems;
};

export default function Sidebar({ user, isOpen, onClose, onLogout }: SidebarProps) {
  const [location] = useLocation();

  // Get unread notifications count
  const { data: unreadNotifications = [] } = useQuery<any[]>({
    queryKey: [`/api/notifications/${user.id}/unread`],
    enabled: !!user.id,
  });

  // Get active chat rooms count
  const { data: chatRooms = [] } = useQuery<any[]>({
    queryKey: [`/api/chat/rooms/${user.id}`],
    enabled: !!user.id,
  });

  const getBadgeCount = (path: string) => {
    // Temporary sample data for demonstration
    if (path === "/notifications") return 3;
    if (path === "/chat") return 2;
    return null;
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={cn("fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity", 
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={cn(
        "slide-menu fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 z-50 mobile-shadow-xl",
        isOpen && "open"
      )}>
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-4 mt-2">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mobile-shadow">
              <img
                src={user.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-14 h-14 rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
              <p className="text-green-100 text-sm">{user.department}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {getMenuItems(user.userLevel).map((item) => {
            const badgeCount = getBadgeCount(item.path);
            const isActive = location === item.path;
            const IconComponent = item.icon;

            return (
              <Link key={item.path} href={item.path}>
                <a
                  className={cn(
                    "flex items-center space-x-4 p-4 rounded-2xl transition-all button-depth hover:button-depth",
                    isActive
                      ? "bg-primary text-white mobile-shadow-lg"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  )}
                  onClick={onClose}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isActive ? "bg-white bg-opacity-20" : "bg-gray-100 dark:bg-gray-700"
                  )}>
                    <IconComponent 
                      size={20} 
                      className={cn(
                        isActive ? "text-white" : item.color
                      )} 
                    />
                  </div>
                  <span className="font-medium flex-1">{item.label}</span>
                  {badgeCount && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center notification-badge">
                      {badgeCount}
                    </span>
                  )}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="space-y-2">
            <Link href="/profile">
              <a
                className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                onClick={onClose}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <UserIcon size={16} className="text-gray-600 dark:text-gray-400" />
                </div>
                <span className="font-medium">Profile</span>
              </a>
            </Link>
            <Link href="/settings">
              <a
                className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                onClick={onClose}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Settings size={16} className="text-gray-600 dark:text-gray-400" />
                </div>
                <span className="font-medium">Settings</span>
              </a>
            </Link>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900 transition-colors text-red-600 dark:text-red-400"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <LogOut size={16} className="text-red-600 dark:text-red-400" />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
