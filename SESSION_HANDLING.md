# Session Handling System

This document explains the session handling system implemented in the CareTaker app.

## Overview

The session handling system provides automatic authentication management, ensuring users don't have to login repeatedly. It includes:

- **Automatic session restoration** on app startup
- **Token-based authentication** with JWT
- **Automatic session refresh** before expiration
- **Automatic logout** on token expiration
- **Persistent storage** using AsyncStorage

## Components

### 1. SessionManager (`utils/sessionManager.ts`)

The core session management utility that handles:
- Token storage and retrieval
- Session validation
- Automatic token injection in API requests
- Session expiration handling

**Key Methods:**
- `initialize()`: Check for existing session on app startup
- `createSession()`: Create new session after login
- `clearSession()`: Clear session on logout
- `refreshSession()`: Extend session expiry
- `isSessionValid()`: Check if session is still valid

### 2. AuthContext (`contexts/AuthContext.tsx`)

React context that provides authentication state throughout the app:
- `isAuthenticated`: Boolean indicating if user is logged in
- `user`: Current user object
- `isLoading`: Loading state during initialization
- `login()`: Login function
- `logout()`: Logout function
- `updateUser()`: Update user data
- `refreshSession()`: Manually refresh session

### 3. SessionRefreshManager (`utils/sessionRefresh.ts`)

Handles automatic session refresh:
- Checks session every 5 minutes
- Automatically refreshes session if expiring soon
- Can be manually triggered

### 4. useSessionRedirect Hook (`hooks/useSessionRedirect.ts`)

Handles automatic redirection to login when session expires.

## Usage

### Basic Usage

```typescript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { isAuthenticated, user, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <View>
      <Text>Welcome, {user?.name}!</Text>
      <Button onPress={logout} title="Logout" />
    </View>
  );
};
```

### Login Flow

```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post('/api/signin', { email, password });
    await login(response.data.token, response.data.user);
    // Navigation is handled automatically
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Logout Flow

```typescript
const handleLogout = async () => {
  try {
    await logout();
    // Navigation is handled automatically
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

## Features

### 1. Automatic Session Restoration

When the app starts, the system automatically checks for an existing valid session and restores it if found.

### 2. Automatic Token Injection

All API requests automatically include the authentication token in the Authorization header.

### 3. Session Expiration Handling

- Sessions expire after 7 days
- Automatic refresh when expiring within 1 hour
- Automatic logout and redirect to login on expiration

### 4. Persistent Storage

Session data is stored in AsyncStorage and persists across app restarts.

## Configuration

### Session Duration

Default session duration is 7 days. This can be modified in:
- `SessionManager.createSession()` - for new sessions
- `SessionManager.refreshSession()` - for session refresh

### Refresh Interval

Session refresh checks occur every 5 minutes. This can be modified in:
- `SessionRefreshManager.startAutoRefresh()`

## Security Features

1. **JWT Tokens**: Secure token-based authentication
2. **Automatic Expiration**: Tokens expire after 7 days
3. **Secure Storage**: Tokens stored in AsyncStorage
4. **Automatic Cleanup**: Sessions cleared on logout/expiration

## Error Handling

The system handles various error scenarios:
- Network errors during token validation
- Invalid or expired tokens
- Server authentication failures
- Storage errors

## Backend Requirements

The backend must provide:
1. `/api/signin` - Login endpoint
2. `/api/signup` - Registration endpoint  
3. `/api/validate-token` - Token validation endpoint
4. JWT token generation with user ID and role
5. Authentication middleware for protected routes

## Troubleshooting

### Common Issues

1. **Session not persisting**: Check AsyncStorage permissions
2. **Automatic logout**: Check token expiration and server connectivity
3. **Navigation issues**: Ensure AuthProvider wraps the app

### Debug Mode

Enable debug logging by adding console.log statements in:
- `SessionManager.initialize()`
- `SessionManager.createSession()`
- `SessionRefreshManager.checkAndRefreshSession()` 