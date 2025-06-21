import { Link, useLocation } from "wouter";
import { User } from "@shared/schema";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  user: User;
}

const navItems = [
  { path: "/", icon: "fas fa-home", label: "Home" },
  { path: "/chat", icon: "fas fa-comments", label: "Chats" },
  { path: "/events", icon: "fas fa-calendar", label: "Events" },
  { path: "/directory", icon: "fas fa-building", label: "Directory" },
];

export default function MobileNav({ user }: MobileNavProps) {
  const [location] = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <a
                className={cn(
                  "flex flex-col items-center py-2 px-3 rounded-lg",
                  isActive ? "text-primary" : "text-gray-500"
                )}
              >
                <i className={cn(item.icon, "text-lg mb-1")}></i>
                <span className="text-xs font-medium">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
