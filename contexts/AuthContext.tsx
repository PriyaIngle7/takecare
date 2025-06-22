import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SessionManager, { User } from '../utils/sessionManager';
import SessionRefreshManager from '../utils/sessionRefresh';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionManager = SessionManager.getInstance();
  const sessionRefreshManager = SessionRefreshManager.getInstance();

  useEffect(() => {
    initializeAuth();
  }, []);

  // Start/stop session refresh based on authentication status
  useEffect(() => {
    if (isAuthenticated) {
      sessionRefreshManager.startAutoRefresh();
    } else {
      sessionRefreshManager.stopAutoRefresh();
    }

    return () => {
      sessionRefreshManager.stopAutoRefresh();
    };
  }, [isAuthenticated]);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Initialize session manager
      const hasValidSession = await sessionManager.initialize();
      
      if (hasValidSession) {
        const currentUser = sessionManager.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      }

      // Set up session expiration listener
      sessionManager.onSessionExpired(() => {
        handleSessionExpired();
      });

    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionExpired = () => {
    setIsAuthenticated(false);
    setUser(null);
    sessionRefreshManager.stopAutoRefresh();
    // You can add navigation logic here to redirect to login
  };

  const login = async (token: string, user: User) => {
    try {
      await sessionManager.createSession(token, user);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await sessionManager.clearSession();
      setUser(null);
      setIsAuthenticated(false);
      sessionRefreshManager.stopAutoRefresh();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      await sessionManager.updateUserData(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      await sessionManager.refreshSession();
    } catch (error) {
      console.error('Error refreshing session:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    updateUser,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 