
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";

// Páginas
import Index from "./pages/Index";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";
import ResetPasswordPage from "./pages/auth/reset-password";
import NotFound from "./pages/NotFound";

// Páginas do Dashboard
import DashboardPage from "./pages/dashboard/dashboard";
import ServicesPage from "./pages/dashboard/services";
import BillingPage from "./pages/dashboard/billing";
import SupportPage from "./pages/dashboard/support";
import ProfilePage from "./pages/dashboard/profile";

// Componentes
import { ProtectedRoute } from "./components/protected-route";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Rotas protegidas do dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/services" element={
              <ProtectedRoute>
                <ServicesPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/billing" element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/support" element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/help" element={
              <ProtectedRoute>
                <Navigate to="/dashboard/support" replace />
              </ProtectedRoute>
            } />

            {/* Rota de fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
