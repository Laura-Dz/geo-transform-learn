import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import GraphVisualizerPage from "./pages/GraphVisualizerPage";
import PracticeModePage from "./pages/PracticeModePage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
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
      // Error handling is done in the useAuth hook
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
          <Route path="/app" element={<MainLayout user={user!} onLogout={handleLogout} />}>
            <Route 
              index 
              element={<Navigate to={user?.role === 'admin' ? 'admin' : 'visualizer'} replace />} 
            />
            
            {/* Admin routes */}
            {user?.role === 'admin' && (
              <Route path="admin" element={<AdminDashboard user={user} />} />
            )}
            
            {/* Student routes (accessible by both students and admins) */}
            <Route path="visualizer" element={<GraphVisualizerPage />} />
            <Route path="practice" element={<PracticeModePage />} />
            
            {/* Common routes */}
            <Route path="concepts" element={
              <div className="text-white text-center py-20">
                <h2 className="text-2xl">Concept Library - Coming Soon!</h2>
              </div>
            } />
            <Route path="challenges" element={
              <div className="text-white text-center py-20">
                <h2 className="text-2xl">Challenges - Coming Soon!</h2>
              </div>
            } />
            <Route path="quiz" element={
              <div className="text-white text-center py-20">
                <h2 className="text-2xl">Quiz Zone - Coming Soon!</h2>
              </div>
            } />
            <Route path="progress" element={
              <div className="text-white text-center py-20">
                <h2 className="text-2xl">Progress Dashboard - Coming Soon!</h2>
              </div>
            } />
            <Route path="profile" element={
              <div className="text-white text-center py-20">
                <h2 className="text-2xl">Profile - Coming Soon!</h2>
              </div>
            } />
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
