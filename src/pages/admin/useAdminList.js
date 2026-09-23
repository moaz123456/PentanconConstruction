import { useCallback, useEffect, useRef, useState } from 'react';

// Fetches an admin list on mount (and when reload() is called) and keeps it in local state
// so create/edit/delete can update the list immediately without waiting for a cache to expire.
export function useAdminList(fetcher) {
  const fetcherRef = useRef(fetcher);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetcherRef.current()
      .then((data) => {
        if (!cancelled) {
          setItems(data ?? []);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setItems([]);
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { items, setItems, loading, error, reload };
}