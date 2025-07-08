
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Home,
  Calculator,
  BookOpen,
  Trophy,
  Target,
  BarChart3,
  User,
  Gamepad2
} from 'lucide-react';

const navigationItems = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Graph Visualizer', url: '/visualizer', icon: Calculator },
  { title: 'Practice Mode', url: '/practice', icon: Gamepad2 },
  { title: 'Concept Library', url: '/concepts', icon: BookOpen },
  { title: 'Challenges', url: '/challenges', icon: Target },
  { title: 'Quiz Zone', url: '/quiz', icon: Trophy },
  { title: 'Progress Dashboard', url: '/progress', icon: BarChart3 },
  { title: 'Profile', url: '/profile', icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r border-white/10 bg-black/30 backdrop-blur-sm">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Calculator className="h-8 w-8 text-cyan-400" />
          {state !== 'collapsed' && (
            <h2 className="text-xl font-bold text-white">MathViz 3D</h2>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 font-medium">
            {state !== 'collapsed' ? 'Navigation' : ''}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-400 border-r-2 border-cyan-400'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {state !== 'collapsed' && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {state !== 'collapsed' && (
          <div className="text-xs text-gray-400 text-center">
            v1.0.0 • Educational Platform
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
