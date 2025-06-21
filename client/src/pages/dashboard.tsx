import { FrontendUser } from "@shared/schema";
import WelcomeSection from "@/components/dashboard/welcome-section";
import QuickActions from "@/components/dashboard/quick-actions";
import NotificationsWidget from "@/components/dashboard/notifications-widget";
import NewsSection from "@/components/dashboard/news-section";
import EventsSection from "@/components/dashboard/events-section";
import DepartmentsWidget from "@/components/dashboard/departments-widget";
import ChatPreview from "@/components/dashboard/chat-preview";

interface DashboardProps {
  user: FrontendUser;
}

export default function Dashboard({ user }: DashboardProps) {
  return (
    <div className="space-y-4">
      <WelcomeSection user={user} />
      <QuickActions />
      <NotificationsWidget user={user} />
      <NewsSection />
      <EventsSection user={user} />
      <ChatPreview user={user} />
    </div>
  );
}
