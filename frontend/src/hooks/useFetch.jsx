import { useEffect, useState, useCallback } from 'react';

function useFetchData(fetchFunction) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isSuccess, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Memoize the fetch function to prevent unnecessary re-renders
  const memoizedFetchFunction = useCallback(fetchFunction, []);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts
    
    async function fetchData() {
      try {
        setLoading(true);
        const data = await memoizedFetchFunction();
        
        if (isMounted) {
          setData(data.result);
          setSuccess(true);
        }
      } catch (error) {
        if (isMounted) {
          setError(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [memoizedFetchFunction]); // Remove isLoading dependency to prevent infinite loops

  return { data, isLoading, isSuccess, error };
}

export default function useFetch(fetchFunction) {
  const { data, isLoading, isSuccess, error } = useFetchData(fetchFunction);

  return { result: data, isLoading, isSuccess, error };
}
