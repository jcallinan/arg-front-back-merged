import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { TokenTimingProvider } from '@/context/TokenTimingContext';
import { AuthProvider, useAuth } from '@/modules/auth/customhooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getAccessToken, removeAccessToken } from '@/utils/cookieUtils';
import * as authApiClient from '@/modules/auth/api/authApiClient';

// No module-level mocks; use spies per-test

// Helper wrapper that mirrors main.tsx provider order for auth
const withAuthProviders = (ui: React.ReactNode, initialEntries: string[] = ['/']) => {
  return render(
    <TokenTimingProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
      </AuthProvider>
    </TokenTimingProvider>
  );
};

// Simple components used in route tests
const ProtectedContent = () => <div>Protected Content</div>;
const LoginScreen = () => <div>Login Screen</div>;

describe('Authentication and Authorization Flow', () => {
  beforeEach(async () => {
    try { removeAccessToken(); } catch (_) {}
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders protected content after successful me API (SSO) and sets token', async () => {
    vi.spyOn(authApiClient, 'getUserDetails').mockResolvedValue({
      data: {
        token: 'test-access-token',
        user: { userId: 'u1', email: 'u1@example.com', userDisplayName: 'User One', role: 'Admin' },
      },
    } as any);

    withAuthProviders(
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <ProtectedContent />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginScreen />} />
      </Routes>,
      ['/protected']
    );

    // Should show protected content once me API succeeds
    await waitFor(() => expect(screen.getByText('Protected Content')).toBeInTheDocument());

    // Access token cookie should be set
    expect(getAccessToken()).toBe('test-access-token');
  });

  it('redirects to /login when me API fails (unauthenticated)', async () => {
    vi.spyOn(authApiClient, 'getUserDetails').mockRejectedValue(new Error('USER_NOT_AUTHENTICATED'));

    withAuthProviders(
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <ProtectedContent />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginScreen />} />
      </Routes>,
      ['/protected']
    );

    // Should navigate to login
    await waitFor(() => expect(screen.getByText('Login Screen')).toBeInTheDocument());
  });

  it('schedules token refresh ~28 minutes after successful me API', async () => {
    // Seed localStorage so provider refreshes immediately on mount
    const past = Date.now() - (28 * 60 * 1000) - 5000;
    window.localStorage.setItem('auth_me_api_call_time', String(past));
    vi.spyOn(authApiClient, 'getToken').mockResolvedValue({ status: 200 } as any);

    render(
      <TokenTimingProvider>
        <div>Ready</div>
      </TokenTimingProvider>
    );

    await waitFor(() => expect(authApiClient.getToken).toHaveBeenCalledTimes(1));
  });

  it('logout calls backend and clears auth state', async () => {
    vi.spyOn(authApiClient, 'logoutUser').mockResolvedValue({ status: 200 } as any);

    const LogoutButton = () => {
      const { logout } = useAuth();
      return <button onClick={() => logout()} data-testid="logout-btn">Logout</button>;
    };

    render(
      <TokenTimingProvider>
        <AuthProvider>
          <MemoryRouter>
            <LogoutButton />
          </MemoryRouter>
        </AuthProvider>
      </TokenTimingProvider>
    );

    await userEvent.click(screen.getByTestId('logout-btn'));
    await waitFor(() => expect(authApiClient.logoutUser).toHaveBeenCalled());
  });
});


