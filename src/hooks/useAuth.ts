import { useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export function useAuth() {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message ?? `Login failed (${response.status})`);
      }

      const data = await response.json();
      if (!data.threadId) throw new Error('No threadId returned from login');
      setThreadId(data.threadId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setThreadId(null);
    setError(null);
  };

  return { threadId, isLoading, error, login, logout };
}
