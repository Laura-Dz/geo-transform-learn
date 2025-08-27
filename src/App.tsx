import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import VisualizerPage from "./pages/VisualizerPage";
import ConceptsPage from "./pages/ConceptsPage";
import PracticePage from "./pages/PracticePage";
import QuizPage from "./pages/QuizPage";
import ChallengesPage from "./pages/ChallengesPage";
import LearningHubPage from "./pages/LearningHubPage";
import ProgressPage from "./pages/ProgressPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Profile from "./components/profile/Profile";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { LoginCredentials, RegisterCredentials } from "@/types/auth";

const queryClient = new QueryClient();

const AppContent = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const {
    user,
    isLoading,
    authenticate,
    logout,
    canAccessRoute,
    getRoleBasedRedirectPath,
    isAuthenticated
  } = useAuth();

  const handleLogin = async (credentials: LoginCredentials | RegisterCredentials) => {
    try {
      await authenticate(credentials);
      setShowAuthModal(false);
      window.location.href = getRoleBasedRedirectPath();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Sonner />
      
      <Routes>
        {/* Landing page */}
        <Route 
          path="/" 
          element={
            isAuthenticated() ? (
              <Navigate to={getRoleBasedRedirectPath()} replace />
            ) : (
              <Index onShowAuthModal={() => setShowAuthModal(true)} />
            )
          } 
        />
        
        {/* Protected routes */}
        {isAuthenticated() ? (
          <Route path="/app" element={<AppLayout />}>
            <Route 
              index 
              element={<Navigate to={user?.role === 'admin' ? 'admin' : 'learning-hub'} replace />} 
            />
            
            {/* Admin routes */}
            <Route 
              path="admin" 
              element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="visualizer" replace />} 
            />
            
            {/* Student routes (accessible by both students and admins) */}
            <Route path="visualizer" element={<VisualizerPage />} />
            <Route path="concepts" element={<ConceptsPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="challenges" element={<ChallengesPage />} />
            <Route path="learning-hub" element={<LearningHubPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        ) : (
          <Route path="/app/*" element={<Navigate to="/" replace />} />
        )}
        
        <Route path="*" element={<NotFound />} />
      </Routes>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
