// Presentation Layer - Custom Hook for Authentication
import { useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { AuthController } from '@/controllers/AuthController';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Initialize controller
  const authController = new AuthController();

  /**
   * Initialize authentication state
   */
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const validatedUser = await authController.validateSession();
        setUser(validatedUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login function
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authController.login(credentials);
      setUser(response.user);
      
      toast({
        title: "Login Successful!",
        description: response.user.role === 'admin' ? 'Welcome to your admin dashboard' : 'Ready to explore 3D mathematics?',
      });
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Register function
   */
  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authController.register(credentials);
      setUser(response.user);
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to 3DZert! Your learning journey begins now.",
      });
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Handle both login and registration based on credentials
   */
  const authenticate = useCallback(async (credentials: LoginCredentials | RegisterCredentials) => {
    if ('name' in credentials) {
      // Registration
      return await register(credentials as RegisterCredentials);
    } else {
      // Login
      return await login(credentials as LoginCredentials);
    }
  }, [login, register]);

  /**
   * Logout function
   */
  const logout = useCallback(() => {
    authController.logout();
    setUser(null);
    setError(null);
    
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  }, [toast]);

  /**
   * Check route access
   */
  const canAccessRoute = useCallback((route: string): boolean => {
    return authController.canAccessRoute(route);
  }, [user]);

  /**
   * Get role-based redirect path
   */
  const getRoleBasedRedirectPath = useCallback((): string => {
    return authController.getRoleBasedRedirectPath();
  }, [user]);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((role: 'student' | 'admin'): boolean => {
    return user?.role === role;
  }, [user]);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback((): boolean => {
    return user !== null;
  }, [user]);

  return {
    // State
    user,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    authenticate,
    logout,
    
    // Utilities
    canAccessRoute,
    getRoleBasedRedirectPath,
    hasRole,
    isAuthenticated,
  };
};
