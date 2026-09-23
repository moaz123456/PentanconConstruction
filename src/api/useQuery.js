import { useEffect, useState } from 'react';

// A very small data-fetching hook: caches results for a couple of minutes, shares in-flight requests
// between components (header and home page both ask for categories) and exposes { data, loading, error }.
const TTL_MS = 2 * 60 * 1000;
const cache = new Map(); // key -> { data, at }
const inflight = new Map(); // key -> Promise

const fresh = (key) => {
  const hit = cache.get(key);
  return hit && Date.now() - hit.at < TTL_MS ? hit : null;
};

export function useQuery(key, fetcher, { enabled = true } = {}) {
  const [result, setResult] = useState(() => {
    const hit = fresh(key);
    return { key, data: hit?.data, loading: enabled && !hit, error: null };
  });

  useEffect(() => {
    if (!enabled) return undefined;

    const hit = fresh(key);
    if (hit) {
      setResult({ key, data: hit.data, loading: false, error: null });
      return undefined;
    }

    let cancelled = false;
    setResult({ key, data: undefined, loading: true, error: null });

    let request = inflight.get(key);
    if (!request) {
      request = fetcher()
        .then((data) => {
          cache.set(key, { data, at: Date.now() });
          return data;
        })
        .finally(() => inflight.delete(key));
      inflight.set(key, request);
    }

    request.then(
      (data) => !cancelled && setResult({ key, data, loading: false, error: null }),
      (error) => !cancelled && setResult({ key, data: undefined, loading: false, error })
    );

    return () => {
      cancelled = true;
    };
    // fetcher is intentionally not a dependency: the key identifies the request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  // The key changed but the effect has not run yet: never show the previous key's data.
  if (result.key !== key) {
    const hit = fresh(key);
    return hit
      ? { data: hit.data, loading: false, error: null }
      : { data: undefined, loading: enabled, error: null };
  }

  return { data: result.data, loading: result.loading, error: result.error };
}
