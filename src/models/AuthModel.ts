// Data Layer - Model
import { User } from '@/types/auth';

export class AuthModel {
  private currentUser: User | null = null;
  private authToken: string | null = null;
  private error: string | null = null;
  private isLoading: boolean = false;

  /**
   * Set current authenticated user
   */
  setCurrentUser(user: User): void {
    this.currentUser = user;
    this.clearError();
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Clear current user
   */
  clearUser(): void {
    this.currentUser = null;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    // Persist to localStorage
    localStorage.setItem('mathVizToken', token);
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    if (!this.authToken) {
      // Try to get from localStorage
      this.authToken = localStorage.getItem('mathVizToken');
    }
    return this.authToken;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem('mathVizToken');
  }

  /**
   * Set error message
   */
  setError(error: string): void {
    this.error = error;
  }

  /**
   * Get error message
   */
  getError(): string | null {
    return this.error;
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.error = null;
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  /**
   * Get loading state
   */
  getLoading(): boolean {
    return this.isLoading;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.authToken !== null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: 'student' | 'admin'): boolean {
    return this.currentUser?.role === role;
  }

  /**
   * Get user's role
   */
  getUserRole(): 'student' | 'admin' | null {
    return this.currentUser?.role || null;
  }

  /**
   * Reset all authentication state
   */
  reset(): void {
    this.clearUser();
    this.clearAuthToken();
    this.clearError();
    this.setLoading(false);
  }
}
