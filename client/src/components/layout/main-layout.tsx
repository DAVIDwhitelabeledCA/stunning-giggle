import { useState } from "react";
import { FrontendUser } from "@shared/schema";
import Sidebar from "./sidebar";
import TopNav from "./top-nav";
import MobileNav from "./mobile-nav";

interface MainLayoutProps {
  children: React.ReactNode;
  user: FrontendUser;
  onLogout: () => void;
}

export default function MainLayout({ children, user, onLogout }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        user={user}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex flex-col min-h-screen">
        {/* Top Navigation */}
        <TopNav user={user} onMenuToggle={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 p-3 pb-20 md:pb-4 max-w-md mx-auto w-full">
          <div className="space-y-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
