
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import GraphVisualizerPage from "./pages/GraphVisualizerPage";
import PracticeModePage from "./pages/PracticeModePage";
import NotFound from "./pages/NotFound";
import AuthModal from "@/components/AuthModal";
import { useToast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing authentication
    const token = localStorage.getItem('mathVizToken');
    if (token) {
      validateToken(token);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      // This would typically make an API call to validate the token
      // For now, we'll simulate a valid user
      setUser({ id: '1', email: 'student@example.com', name: 'Student' });
    } catch (error) {
      localStorage.removeItem('mathVizToken');
    }
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setShowAuthModal(false);
    toast({
      title: "Welcome back!",
      description: "Ready to explore 3D mathematics?",
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mathVizToken');
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {user ? (
              <Route path="/" element={<MainLayout user={user} onLogout={handleLogout} />}>
                <Route index element={<Navigate to="/visualizer" replace />} />
                <Route path="visualizer" element={<GraphVisualizerPage />} />
                <Route path="practice" element={<PracticeModePage />} />
                <Route path="concepts" element={<div className="text-white text-center py-20"><h2 className="text-2xl">Concept Library - Coming Soon!</h2></div>} />
                <Route path="challenges" element={<div className="text-white text-center py-20"><h2 className="text-2xl">Challenges - Coming Soon!</h2></div>} />
                <Route path="quiz" element={<div className="text-white text-center py-20"><h2 className="text-2xl">Quiz Zone - Coming Soon!</h2></div>} />
                <Route path="progress" element={<div className="text-white text-center py-20"><h2 className="text-2xl">Progress Dashboard - Coming Soon!</h2></div>} />
                <Route path="profile" element={<div className="text-white text-center py-20"><h2 className="text-2xl">Profile - Coming Soon!</h2></div>} />
              </Route>
            ) : (
              <Route path="/" element={<Index />} />
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
