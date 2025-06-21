import { Plus, Calendar, UserPlus, Upload, MessageSquare, Bell } from "lucide-react";

export default function QuickActions() {
  const actions = [
    { icon: MessageSquare, label: "New Chat", color: "bg-blue-500", bgColor: "bg-blue-50" },
    { icon: Calendar, label: "Events", color: "bg-green-500", bgColor: "bg-green-50" },
    { icon: Bell, label: "Alerts", color: "bg-orange-500", bgColor: "bg-orange-50" },
    { icon: Plus, label: "Create", color: "bg-purple-500", bgColor: "bg-purple-50" },
  ];

  return (
    <section>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <button
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl card-depth hover:mobile-shadow-lg transition-all button-depth text-center"
            >
              <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mx-auto mb-2 mobile-shadow`}>
                <IconComponent size={20} className={`${action.color.replace('bg-', 'text-')}`} />
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{action.label}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
