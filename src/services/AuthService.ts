// Logic Layer - Service (renamed from authService.ts for consistency)
import { User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth';

const API_BASE_URL = 'http://localhost:8080';

export class AuthService {
  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        role: credentials.role || 'student'
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    
    return response.json();
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }
    
    return response.json();
  }

  /**
   * Validate authentication token
   */
  async validateToken(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Invalid token");
    }
    
    const data = await response.json();
    return data.user || data;
  }

  /**
   * Logout user (client-side cleanup)
   */
  logout(): void {
    // In a real app, you might want to call an API endpoint to invalidate the token
    // For now, we just handle client-side cleanup
  }

  /**
   * Get role-based redirect path
   */
  getRoleBasedRedirectPath(user: User): string {
    switch (user.role) {
      case 'admin':
        return '/app/admin';
      case 'student':
      default:
        return '/app/visualizer';
    }
  }

  /**
   * Check if user can access specific route
   */
  canAccessRoute(user: User | null, route: string): boolean {
    if (!user) return false;
    
    // Admin routes
    if (route.startsWith('/app/admin')) {
      return user.role === 'admin';
    }
    
    // Student routes (accessible by both students and admins)
    if (route.startsWith('/app/visualizer') || route.startsWith('/app/practice')) {
      return user.role === 'student' || user.role === 'admin';
    }
    
    return true;
  }

  /**
   * Get user permissions based on role
   */
  getUserPermissions(user: User): string[] {
    const permissions: string[] = [];
    
    if (user.role === 'admin') {
      permissions.push(
        'manage_users',
        'view_analytics',
        'manage_content',
        'access_admin_dashboard',
        'access_visualizer',
        'access_practice'
      );
    } else if (user.role === 'student') {
      permissions.push(
        'access_visualizer',
        'access_practice',
        'view_progress',
        'take_quizzes'
      );
    }
    
    return permissions;
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(user: User, permission: string): boolean {
    const permissions = this.getUserPermissions(user);
    return permissions.includes(permission);
  }
}
