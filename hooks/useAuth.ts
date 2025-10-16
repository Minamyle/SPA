'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { login, logout, getUser, isAuthenticated, User } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      try {
        if (isAuthenticated()) {
          const userData = getUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginUser = useCallback(async (username: string, password: string) => {
    try {
      const userData = await login(username, password);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }, []);

  const logoutUser = useCallback(() => {
    logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  const requireAuth = useCallback(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return false;
    }
    return true;
  }, [router]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login: loginUser,
    logout: logoutUser,
    requireAuth,
  };
}
