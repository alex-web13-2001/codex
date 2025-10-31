import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteLoaderOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

const useInfiniteLoader = ({ hasMore, isLoading, onLoadMore }: UseInfiniteLoaderOptions) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '200px'
    });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [observerCallback]);

  return sentinelRef;
};

export default useInfiniteLoader;
