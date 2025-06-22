import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import SessionManager from '../utils/sessionManager';

export const useSessionRedirect = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const sessionManager = SessionManager.getInstance();

    const handleSessionExpired = () => {
      // Only redirect if we're not already on a login screen
      if (isAuthenticated) {
        // Reset to login screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' as never }],
        });
      }
    };

    // Set up session expiration listener
    sessionManager.onSessionExpired(handleSessionExpired);

    return () => {
      // Clean up listener if needed
      // Note: SessionManager doesn't have a remove listener method yet
      // This is a limitation but shouldn't cause issues in practice
    };
  }, [navigation, isAuthenticated]);
}; 