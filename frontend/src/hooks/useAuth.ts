import { useEffect, useState } from 'react';
import { AUTH_STORAGE_KEY, DEMO_USER } from '../lib/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (storedEmail) {
      setIsAuthenticated(true);
      setSessionEmail(storedEmail);
    }
  }, []);

  async function login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return {
        ok: false,
        message: 'Email is required.',
      } as const;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!isValidEmail) {
      return {
        ok: false,
        message: 'Enter a valid email address.',
      } as const;
    }

    if (!password.trim()) {
      return {
        ok: false,
        message: 'Password is required.',
      } as const;
    }

    if (
      normalizedEmail !== DEMO_USER.email.toLowerCase() ||
      password !== DEMO_USER.password
    ) {
      return {
        ok: false,
        message: 'Invalid email or password.',
      } as const;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, DEMO_USER.email);
    setIsAuthenticated(true);
    setSessionEmail(DEMO_USER.email);

    return {
      ok: true,
      message: 'Welcome back.',
    } as const;
  }

  function logout() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setSessionEmail(null);
  }

  return {
    isAuthenticated,
    login,
    logout,
    sessionEmail,
  };
}
