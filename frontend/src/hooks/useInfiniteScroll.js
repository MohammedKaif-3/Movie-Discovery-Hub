import { useEffect } from 'react';

export const useInfiniteScroll = ({
  enabled,
  sentinelRef,
  loading,
  loadingMore,
  page,
  totalPages,
  onLoadMore,
}) => {
  useEffect(() => {
    if (!enabled || !sentinelRef.current) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const canLoad = entries[0].isIntersecting && !loading && !loadingMore && page < totalPages;
      if (canLoad) onLoadMore(page + 1);
    }, { rootMargin: '360px 0px' });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [enabled, loading, loadingMore, onLoadMore, page, sentinelRef, totalPages]);
};
