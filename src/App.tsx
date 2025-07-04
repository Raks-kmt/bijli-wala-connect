
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppDataProvider } from "./contexts/AppDataContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { RealtimeProvider } from "./contexts/RealtimeContext";
import AuthPage from "./components/auth/AuthPage";
import CustomerDashboard from "./components/customer/CustomerDashboard";
import ElectricianDashboard from "./components/electrician/ElectricianDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import React from 'react';

const AppRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Role-based routing
  switch (user.role) {
    case 'customer':
      return <CustomerDashboard />;
    case 'electrician':
      return <ElectricianDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/" replace />;
  }
};

const App = () => {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <LanguageProvider>
            <AuthProvider>
              <AppDataProvider>
                <RealtimeProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/*" element={<AppRoutes />} />
                    </Routes>
                  </BrowserRouter>
                </RealtimeProvider>
              </AppDataProvider>
            </AuthProvider>
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
