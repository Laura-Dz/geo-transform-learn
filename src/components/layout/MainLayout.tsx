
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { User, LogOut, Menu, X } from 'lucide-react';

interface MainLayoutProps {
  user: any;
  onLogout: () => void;
}

export function MainLayout({ user, onLogout }: MainLayoutProps) {
  const [showNav, setShowNav] = useState<boolean>(true);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div
          className={`transition-all duration-300 overflow-hidden ${
            showNav ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
          }`}
          style={{ position: 'sticky', top: 0 }}
        >
          <AppSidebar />
        </div>
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowNav(v => !v)}
                  aria-label={showNav ? 'Hide navigation' : 'Show navigation'}
                  className="p-2 text-white hover:bg-white/10 rounded"
                >
                  {showNav ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
                <SidebarTrigger />
                <h1 className="text-xl font-semibold text-white">
                  3D Mathematics Visualization
                </h1>
              </div>
              
              {user && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-white">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onLogout}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
