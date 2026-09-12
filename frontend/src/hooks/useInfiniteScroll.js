import { useEffect, useRef } from 'react';

export const useInfiniteScroll = ({
  enabled,
  sentinelRef,
  loading,
  loadingMore,
  page,
  resetKey,
  totalPages,
  onLoadMore,
}) => {
  const requestedPagesRef = useRef(new Set());

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const nextPage = page + 1;
      const canLoad = entries[0].isIntersecting
        && !loading
        && !loadingMore
        && page < totalPages
        && !requestedPagesRef.current.has(nextPage);

      if (canLoad) {
        requestedPagesRef.current.add(nextPage);
        onLoadMore(nextPage);
      }
    }, { rootMargin: '140px 0px', threshold: 0.15 });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [enabled, loading, loadingMore, onLoadMore, page, resetKey, sentinelRef, totalPages]);

  useEffect(() => {
    requestedPagesRef.current.clear();
  }, [enabled, resetKey]);
};
