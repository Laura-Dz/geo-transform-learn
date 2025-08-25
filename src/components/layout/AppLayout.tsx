import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  BarChart3, 
  BookOpen, 
  Brain, 
  Target, 
  Trophy,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import FloatingAI from './FloatingAI';

const AppLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigationItems = [
    { path: '/app/learning-hub', icon: Home, label: 'Learning Hub' },
    { path: '/app/visualizer', icon: BarChart3, label: 'Graph Visualizer' },
    { path: '/app/quiz', icon: Trophy, label: 'Quiz Zone' },
    { path: '/app/challenges', icon: Brain, label: 'Challenges' },
    { path: '/app/practice', icon: Target, label: 'Practice Mode' },
    { path: '/app/concepts', icon: BookOpen, label: 'Concept Library' },
    { path: '/app/progress', icon: BarChart3, label: 'Progress Dashboard' },
    { path: '/app/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getCurrentContext = () => {
    const path = location.pathname;
    if (path.includes('visualizer')) return { concept: '3D Visualization', userLevel: 'intermediate' };
    if (path.includes('concepts')) return { concept: 'Concept Learning', userLevel: 'intermediate' };
    if (path.includes('practice')) return { concept: 'Practice Mode', userLevel: 'intermediate' };
    if (path.includes('quiz')) return { concept: 'Quiz System', userLevel: 'intermediate' };
    if (path.includes('challenges')) return { concept: 'Challenge Mode', userLevel: 'intermediate' };
    if (path.includes('learning-hub')) return { concept: 'Learning Hub', userLevel: 'intermediate' };
    if (path.includes('progress')) return { concept: 'Progress Tracking', userLevel: 'intermediate' };
    return { concept: 'General Help', userLevel: 'intermediate' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">3D Math</h2>
              <p className="text-gray-400 text-sm">Learning Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <p className="text-gray-400 text-sm font-medium px-3 mb-3">Navigation</p>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-gray-400 text-xs">Student</p>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
          <p className="text-gray-500 text-xs mt-3">v1.0.0 • Educational Platform</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">3D Mathematics Visualization</h1>
              <p className="text-gray-300 mt-1">Explore, visualize, and master mathematical functions</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Assistant */}
      <FloatingAI currentContext={getCurrentContext()} />
    </div>
  );
};

export default AppLayout;
