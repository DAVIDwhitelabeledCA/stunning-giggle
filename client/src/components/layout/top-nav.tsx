import { useState } from "react";
import { FrontendUser } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Menu, Search, Bell } from "lucide-react";

interface TopNavProps {
  user: FrontendUser;
  onMenuToggle: () => void;
}

export default function TopNav({ user, onMenuToggle }: TopNavProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white dark:bg-gray-900 mobile-shadow-lg sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors button-depth"
          >
            <Menu size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center mobile-shadow">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">IntraConnect</h1>
          </div>
        </div>

        {/* Search Bar - Mobile optimized */}
        <div className="flex-1 max-w-xs mx-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-gray-50 dark:bg-gray-800 text-sm"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors button-depth">
            <Bell size={18} className="text-gray-600 dark:text-gray-400" />
            <span className="notification-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mobile-shadow">
            <img
              src={user.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-7 h-7 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
