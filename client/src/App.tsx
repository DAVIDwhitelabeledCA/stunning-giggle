import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { FrontendUser } from "@shared/schema";
import { ProtectedRoute } from "@/lib/protected-route";

import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Notifications from "@/pages/notifications";
import Chat from "@/pages/chat";
import News from "@/pages/news";
import Events from "@/pages/events";
import Departments from "@/pages/departments";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";
import MainLayout from "@/components/layout/main-layout";
import CriticalAlertModal from "@/components/admin/critical-alert-modal";

function Router() {
  const { user, isLoading, logoutMutation } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Company Intranet</h1>
          <p className="text-sm text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (user) {
    return (
      <MainLayout user={user} onLogout={handleLogout}>
        <Switch>
          <Route path="/" component={() => <Dashboard user={user} />} />
          <Route path="/notifications" component={() => <Notifications user={user} />} />
          <Route path="/chat" component={() => <Chat user={user} />} />
          <Route path="/news" component={() => <News user={user} />} />
          <Route path="/events" component={() => <Events user={user} />} />
          <Route path="/departments" component={() => <Departments user={user} />} />
          <Route path="/admin" component={() => <Admin user={user} />} />
          <Route component={NotFound} />
        </Switch>
        <CriticalAlertModal user={user} />
      </MainLayout>
    );
  }

  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
