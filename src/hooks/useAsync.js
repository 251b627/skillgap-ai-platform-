import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for managing async promise workflows with loading, error, and data states.
 */
export function useAsync(asyncFunction, immediate = true) {
  const [loading, setLoading] = useState(immediate);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await asyncFunction(...params);
      setData(response);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, loading, data, error, setData };
}
