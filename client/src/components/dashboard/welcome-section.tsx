import { FrontendUser } from "@shared/schema";
import { getGreeting } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface WelcomeSectionProps {
  user: FrontendUser;
}

export default function WelcomeSection({ user }: WelcomeSectionProps) {
  const greeting = getGreeting();

  return (
    <section>
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-4 mobile-shadow-lg">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mobile-shadow">
            <img
              src={user.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"}
              alt={user.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold">
              {greeting}, {user.firstName}!
            </h2>
            <p className="text-green-100 text-sm">{user.department}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center bg-white bg-opacity-10 rounded-xl p-3">
            <div className="text-xl font-bold">3</div>
            <div className="text-xs text-green-100">Notifications</div>
          </div>
          <div className="text-center bg-white bg-opacity-10 rounded-xl p-3">
            <div className="text-xl font-bold">2</div>
            <div className="text-xs text-green-100">Events</div>
          </div>
          <div className="text-center bg-white bg-opacity-10 rounded-xl p-3">
            <div className="text-xl font-bold">5</div>
            <div className="text-xs text-green-100">Messages</div>
          </div>
        </div>
      </div>
    </section>
  );
}
