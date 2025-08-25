// Logic Layer - Controller
import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { AuthModel } from '@/models/AuthModel';
import { AuthService } from '@/services/AuthService';

export class AuthController {
  private authModel: AuthModel;
  private authService: AuthService;

  constructor() {
    this.authModel = new AuthModel();
    this.authService = new AuthService();
  }

  /**
   * Handle user login
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      // Validate input
      this.validateLoginCredentials(credentials);
      
      // Call service layer
      const response = await this.authService.login(credentials);
      
      // Update model state
      this.authModel.setCurrentUser(response.user);
      this.authModel.setAuthToken(response.token);
      
      return response;
    } catch (error) {
      this.authModel.setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  }

  /**
   * Handle user registration
   */
  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    try {
      // Validate input
      this.validateRegisterCredentials(credentials);
      
      // Call service layer
      const response = await this.authService.register(credentials);
      
      // Update model state
      this.authModel.setCurrentUser(response.user);
      this.authModel.setAuthToken(response.token);
      
      return response;
    } catch (error) {
      this.authModel.setError(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    }
  }

  /**
   * Handle user logout
   */
  logout(): void {
    try {
      // Clear service layer data
      this.authService.logout();
      
      // Clear model state
      this.authModel.clearUser();
      this.authModel.clearAuthToken();
      this.authModel.clearError();
    } catch (error) {
      this.authModel.setError(error instanceof Error ? error.message : 'Logout failed');
    }
  }

  /**
   * Validate token and restore session
   */
  async validateSession(): Promise<User | null> {
    try {
      const token = this.authModel.getAuthToken();
      if (!token) return null;

      const user = await this.authService.validateToken(token);
      this.authModel.setCurrentUser(user);
      
      return user;
    } catch (error) {
      // Invalid token, clear everything
      this.logout();
      return null;
    }
  }

  /**
   * Get current user from model
   */
  getCurrentUser(): User | null {
    return this.authModel.getCurrentUser();
  }

  /**
   * Get authentication error
   */
  getError(): string | null {
    return this.authModel.getError();
  }

  /**
   * Check if user can access route
   */
  canAccessRoute(route: string): boolean {
    const user = this.getCurrentUser();
    return this.authService.canAccessRoute(user, route);
  }

  /**
   * Get role-based redirect path
   */
  getRoleBasedRedirectPath(): string {
    const user = this.getCurrentUser();
    if (!user) return '/';
    return this.authService.getRoleBasedRedirectPath(user);
  }

  // Private validation methods
  private validateLoginCredentials(credentials: LoginCredentials): void {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    if (!this.isValidEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }
  }

  private validateRegisterCredentials(credentials: RegisterCredentials): void {
    if (!credentials.name || !credentials.email || !credentials.password) {
      throw new Error('Name, email, and password are required');
    }
    if (!this.isValidEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
