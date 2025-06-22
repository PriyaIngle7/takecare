import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'caretaker' | 'patient';
  inviteCode?: string;
}

export interface SessionData {
  token: string;
  user: User;
  expiresAt: number;
}

class SessionManager {
  private static instance: SessionManager;
  private sessionData: SessionData | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Initialize session manager and check for existing session
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return this.isSessionValid();
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      const expiresAt = await AsyncStorage.getItem('sessionExpiresAt');

      if (token && userData && expiresAt) {
        const user = JSON.parse(userData);
        const expiryTime = parseInt(expiresAt);

        this.sessionData = {
          token,
          user,
          expiresAt: expiryTime,
        };

        // Check if session is still valid
        if (this.isSessionValid()) {
          this.setupAxiosInterceptors();
          this.isInitialized = true;
          return true;
        } else {
          // Session expired, clear it
          await this.clearSession();
        }
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      await this.clearSession();
    }

    this.isInitialized = true;
    return false;
  }

  // Check if current session is valid
  isSessionValid(): boolean {
    if (!this.sessionData) return false;
    
    const now = Date.now();
    return now < this.sessionData.expiresAt;
  }

  // Get current session data
  getSessionData(): SessionData | null {
    return this.sessionData;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.sessionData?.user || null;
  }

  // Get current token
  getToken(): string | null {
    return this.sessionData?.token || null;
  }

  // Set up axios interceptors for automatic token handling
  private setupAxiosInterceptors() {
    // Request interceptor to add token
    axios.interceptors.request.use(
      (config) => {
        if (this.sessionData?.token) {
          config.headers.Authorization = `Bearer ${this.sessionData.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token expiration
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await this.clearSession();
          // You can emit an event here to notify the app to redirect to login
          this.emitSessionExpired();
        }
        return Promise.reject(error);
      }
    );
  }

  // Create new session after login/signup
  async createSession(token: string, user: User, expiresInDays: number = 7): Promise<void> {
    const expiresAt = Date.now() + (expiresInDays * 24 * 60 * 60 * 1000);
    
    this.sessionData = {
      token,
      user,
      expiresAt,
    };

    // Store in AsyncStorage
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('sessionExpiresAt', expiresAt.toString());

    // Setup axios interceptors
    this.setupAxiosInterceptors();
  }

  // Clear session (logout)
  async clearSession(): Promise<void> {
    this.sessionData = null;
    
    // Clear from AsyncStorage
    await AsyncStorage.multiRemove(['token', 'user', 'sessionExpiresAt']);
    
    // Remove axios interceptors
    axios.interceptors.request.clear();
    axios.interceptors.response.clear();
  }

  // Refresh session (extend expiry)
  async refreshSession(expiresInDays: number = 7): Promise<void> {
    if (!this.sessionData) {
      throw new Error('No active session to refresh');
    }

    const expiresAt = Date.now() + (expiresInDays * 24 * 60 * 60 * 1000);
    this.sessionData.expiresAt = expiresAt;
    
    await AsyncStorage.setItem('sessionExpiresAt', expiresAt.toString());
  }

  // Update user data in session
  async updateUserData(user: User): Promise<void> {
    if (this.sessionData) {
      this.sessionData.user = user;
      await AsyncStorage.setItem('user', JSON.stringify(user));
    }
  }

  // Event emitter for session expiration
  private sessionExpiredCallbacks: (() => void)[] = [];

  onSessionExpired(callback: () => void): void {
    this.sessionExpiredCallbacks.push(callback);
  }

  private emitSessionExpired(): void {
    this.sessionExpiredCallbacks.forEach(callback => callback());
  }

  // Validate token with server
  async validateToken(): Promise<boolean> {
    if (!this.sessionData?.token) return false;

    try {
      const response = await axios.get('https://takecare-ds3g.onrender.com/api/validate-token', {
        headers: {
          Authorization: `Bearer ${this.sessionData.token}`,
        },
      });
      return response.status === 200;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  // Get session expiry time remaining
  getSessionTimeRemaining(): number {
    if (!this.sessionData) return 0;
    return Math.max(0, this.sessionData.expiresAt - Date.now());
  }

  // Check if session will expire soon (within 1 hour)
  isSessionExpiringSoon(): boolean {
    const timeRemaining = this.getSessionTimeRemaining();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    return timeRemaining > 0 && timeRemaining < oneHour;
  }
}

export default SessionManager; 