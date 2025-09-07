import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, BookOpen, BarChart3, Settings, Plus, Search } from 'lucide-react';
import { User } from '@/types/auth';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'admin'>('all');

  // Fetch live users from backend (admin only)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('mathVizToken');
        const res = await fetch('http://localhost:8080/api/users', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`Failed to load users (${res.status})`);
        const data = await res.json();
        // Normalize dates to strings
        const normalized: User[] = (data || []).map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: (u.role as string) === 'admin' ? 'admin' : 'student',
          createdAt: typeof u.createdAt === 'string' ? u.createdAt : new Date(u.createdAt).toISOString().slice(0, 10),
          lastLogin: u.lastLogin ? (typeof u.lastLogin === 'string' ? u.lastLogin : new Date(u.lastLogin).toISOString().slice(0, 10)) : undefined,
        }));
        setUsers(normalized);
      } catch (e) {
        console.error(e);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

const today = new Date().toISOString().slice(0,10);
  const stats = {
    totalUsers: users.length,
    students: users.filter(u => u.role === 'student').length,
    admins: users.filter(u => u.role === 'admin').length,
    activeToday: users.filter(u => (u.lastLogin || '').slice(0,10) === today).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user.name}</p>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-600">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-black/30 border-white/20">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-cyan-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/30 border-white/20">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-green-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Students</p>
              <p className="text-2xl font-bold text-white">{stats.students}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/30 border-white/20">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-purple-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Admins</p>
              <p className="text-2xl font-bold text-white">{stats.admins}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/30 border-white/20">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-yellow-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Active Today</p>
              <p className="text-2xl font-bold text-white">{stats.activeToday}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* User Management */}
      <Card className="p-6 bg-black/30 border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">User Management</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/50 border-white/30 text-white"
              />
            </div>
            <Select value={filterRole} onValueChange={(value: 'all' | 'student' | 'admin') => setFilterRole(value)}>
              <SelectTrigger className="w-32 bg-black/50 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/30">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Last Login</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-4 text-white">{u.name}</td>
                  <td className="py-3 px-4 text-gray-300">{u.email}</td>
                  <td className="py-3 px-4">
                    <Badge 
                      variant={u.role === 'admin' ? 'default' : 'secondary'}
                      className={u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'}
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{u.createdAt}</td>
                  <td className="py-3 px-4 text-gray-300">{u.lastLogin || 'Never'}</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-black/30 border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">System Settings</h3>
          <p className="text-gray-400 mb-4">Configure application settings and preferences.</p>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
            <Settings className="h-4 w-4 mr-2" />
            Manage Settings
          </Button>
        </Card>

        <Card className="p-6 bg-black/30 border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Analytics</h3>
          <p className="text-gray-400 mb-4">View detailed usage analytics and reports.</p>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </Card>

        <Card className="p-6 bg-black/30 border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Content Management</h3>
          <p className="text-gray-400 mb-4">Manage educational content and resources.</p>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
            <BookOpen className="h-4 w-4 mr-2" />
            Manage Content
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
