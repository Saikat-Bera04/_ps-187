"use client";

import { useState, useEffect, useCallback } from 'react';
import { getEvidence, verifyEvidence as apiVerifyEvidence } from '@/lib/api';
import type { Evidence } from '@/types/evidence';

export function useEvidence() {
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvidence = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getEvidence();
      setEvidenceList(data);
    } catch (err) {
      setError('Failed to fetch evidence records');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  const verify = async (id: string) => {
    const result = await apiVerifyEvidence(id);
    if (result.verified) {
      setEvidenceList((prev) =>
        prev.map((e) => (e.evidenceId === id ? { ...e, verificationStatus: 'VERIFIED' } : e))
      );
    }
    return result;
  };

  return {
    evidenceList,
    isLoading,
    error,
    refetch: fetchEvidence,
    verify,
  };
}
