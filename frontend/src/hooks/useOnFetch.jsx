import { useState, useCallback } from 'react';

export default function useOnFetch() {
  const [result, setResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the onFetch function to prevent unnecessary re-renders
  const onFetch = useCallback(async (callback) => {
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const data = await callback;
      setResult(data.result);
      if (data.success === true) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('OnFetch error:', error);
      setIsSuccess(false);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { onFetch, result, isSuccess, isLoading };
}
