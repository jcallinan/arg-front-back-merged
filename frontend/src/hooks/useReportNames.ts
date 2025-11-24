import { useState, useEffect } from 'react';
import { useApi } from './useApi';

interface UseReportNamesReturn {
  reportNames: string[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useReportNames = (): UseReportNamesReturn => {
  const [reportNames, setReportNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  const fetchReportNames = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.globalStates.getAllReportNames();
      
      if (response.data?.success && response.data?.data) {
        setReportNames(response.data.data);
      } else {
        setError('Failed to fetch report names');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportNames();
  }, []);

  const refetch = () => {
    fetchReportNames();
  };

  return {
    reportNames,
    loading,
    error,
    refetch,
  };
};
