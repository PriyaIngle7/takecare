import SessionManager from './sessionManager';

class SessionRefreshManager {
  private static instance: SessionRefreshManager;
  private refreshInterval: NodeJS.Timeout | null = null;
  private sessionManager: SessionManager;

  private constructor() {
    this.sessionManager = SessionManager.getInstance();
  }

  static getInstance(): SessionRefreshManager {
    if (!SessionRefreshManager.instance) {
      SessionRefreshManager.instance = new SessionRefreshManager();
    }
    return SessionRefreshManager.instance;
  }

  // Start automatic session refresh
  startAutoRefresh(): void {
    if (this.refreshInterval) {
      this.stopAutoRefresh();
    }

    // Check every 5 minutes if session needs refresh
    this.refreshInterval = setInterval(() => {
      this.checkAndRefreshSession();
    }, 5 * 60 * 1000); // 5 minutes
  }

  // Stop automatic session refresh
  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  // Check if session needs refresh and refresh if necessary
  private async checkAndRefreshSession(): Promise<void> {
    try {
      if (this.sessionManager.isSessionValid() && this.sessionManager.isSessionExpiringSoon()) {
        console.log('Session expiring soon, refreshing...');
        await this.sessionManager.refreshSession();
        console.log('Session refreshed successfully');
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      // If refresh fails, the session might be invalid
      // The axios interceptor will handle this
    }
  }

  // Manually refresh session
  async manualRefresh(): Promise<void> {
    try {
      if (this.sessionManager.isSessionValid()) {
        await this.sessionManager.refreshSession();
        console.log('Session manually refreshed');
      }
    } catch (error) {
      console.error('Error manually refreshing session:', error);
      throw error;
    }
  }

  // Get time until next refresh check
  getTimeUntilNextCheck(): number {
    if (!this.refreshInterval) return 0;
    return 5 * 60 * 1000; // 5 minutes
  }
}

export default SessionRefreshManager; 