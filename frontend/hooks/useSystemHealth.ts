"use client";

import { useState, useEffect, useCallback } from 'react';
import { getSystemHealth } from '@/lib/api';
import type { SystemHealth } from '@/types/system';

export function useSystemHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSystemHealth();
      setHealth(data);
    } catch (err) {
      setError('Failed to fetch system health diagnostics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    // Refresh health diagnostics every 10 seconds
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  return {
    health,
    isLoading,
    error,
    refetch: fetchHealth,
  };
}
