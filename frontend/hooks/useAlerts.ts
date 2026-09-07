"use client";

import { useState, useEffect, useCallback } from 'react';
import { getAlerts, updateAlertStatus as apiUpdateStatus } from '@/lib/api';
import type { Alert, AlertStatus } from '@/types/alert';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAlerts();
      setAlerts(data);
    } catch (err) {
      setError('Failed to fetch alerts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const updateStatus = async (alertId: string, status: AlertStatus) => {
    const updated = await apiUpdateStatus(alertId, status);
    if (updated) {
      setAlerts((prev) => prev.map((a) => (a.alertId === alertId ? { ...a, status } : a)));
    }
    return updated;
  };

  return {
    alerts,
    isLoading,
    error,
    refetch: fetchAlerts,
    updateStatus,
  };
}
