import { useState, useEffect } from "react";
import { FrontendUser } from "@shared/schema";
import { AlertTriangle, X, Check } from "lucide-react";

interface CriticalAlert {
  id: number;
  title: string;
  message: string;
  type: 'critical';
  createdAt: Date;
  requiresAcknowledgment: boolean;
}

interface CriticalAlertModalProps {
  user: FrontendUser;
}

export default function CriticalAlertModal({ user }: CriticalAlertModalProps) {
  const [alerts, setAlerts] = useState<CriticalAlert[]>([]);
  const [currentAlert, setCurrentAlert] = useState<CriticalAlert | null>(null);

  // Check for critical alerts for level 3+ users
  useEffect(() => {
    if (user.userLevel <= 3) {
      // Simulate receiving a critical alert for demo purposes
      const sampleAlert: CriticalAlert = {
        id: 1,
        title: "URGENT: System Maintenance Tonight",
        message: "Critical system maintenance will begin at 11:00 PM EST tonight. All users must save their work and log out by 10:45 PM. Expected downtime: 2-3 hours. Emergency contact: IT Support at ext. 1234.",
        type: 'critical',
        createdAt: new Date(),
        requiresAcknowledgment: true
      };

      // Show alert after a short delay to simulate real-time notification
      const timer = setTimeout(() => {
        setAlerts([sampleAlert]);
        setCurrentAlert(sampleAlert);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user.userLevel]);

  const handleAcknowledge = () => {
    if (currentAlert) {
      console.log('Acknowledging alert:', currentAlert.id);
      setAlerts(prev => prev.filter(alert => alert.id !== currentAlert.id));
      setCurrentAlert(null);
    }
  };

  const handleDismiss = () => {
    setCurrentAlert(null);
  };

  // Don't show alerts for users below level 3
  if (user.userLevel > 3 || !currentAlert) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        {/* Alert Modal */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl mobile-shadow-xl max-w-md w-full animate-pulse-once">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center animate-pulse">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">CRITICAL ALERT</h2>
                <p className="text-red-100 text-sm">Level {user.userLevel} Notification</p>
              </div>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              {currentAlert.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {currentAlert.message}
            </p>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Sent: {currentAlert.createdAt.toLocaleString()}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {currentAlert.requiresAcknowledgment && (
                <button
                  onClick={handleAcknowledge}
                  className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl hover:bg-red-600 transition-colors button-depth flex items-center justify-center space-x-2"
                >
                  <Check size={16} />
                  <span>Acknowledge</span>
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="px-4 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-once {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-once {
          animation: pulse-once 0.6s ease-in-out;
        }
      `}</style>
    </>
  );
}