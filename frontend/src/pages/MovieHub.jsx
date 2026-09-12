import { useCallback, useMemo, useRef } from 'react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { DetailPanel } from '../components/movie/DetailPanel.jsx';
import { EmptyState } from '../components/feedback/EmptyState.jsx';
import { ErrorBlock } from '../components/feedback/ErrorBlock.jsx';
import { MovieGrid } from '../components/movie/MovieGrid.jsx';
import { ROUTES } from '../constants/app.js';
import { SkeletonGrid } from '../components/feedback/SkeletonGrid.jsx';
import { sortMovies } from '../utils/movieSort.js';
import { useAppContext } from '../context/useAppContext.js';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll.js';
import { useMovieDiscovery } from '../features/movies/hooks/useMovieDiscovery.js';
import { useScrollMemory } from '../hooks/useScrollMemory.js';
import { useWishlist } from '../features/wishlist/hooks/useWishlist.js';

export const MovieHub = () => {
  const {
    activeRoute,
    filters,
    getScrollPosition,
    movies,
    saveScrollPosition,
    searchQuery,
    selectedMovie,
    setActiveRoute,
    setFilters,
    setMovies,
    setSearchQuery,
    setSelectedMovie,
    setWishlist,
    wishlist,
  } = useAppContext();

  const sentinelRef = useRef(null);
  const movieDiscovery = useMovieDiscovery({ activeRoute, filters, searchQuery, setMovies });
  const wishlistFeature = useWishlist({ activeRoute, setWishlist, wishlist });

  const visibleMovies = useMemo(
    () => (activeRoute === ROUTES.WISHLIST ? wishlistFeature.savedWishlist.map((item) => item.movie) : movies),
    [activeRoute, movies, wishlistFeature.savedWishlist],
  );

  const sortedMovies = useMemo(
    () => sortMovies(visibleMovies, filters.sortBy),
    [filters.sortBy, visibleMovies],
  );

  const activeError = activeRoute === ROUTES.WISHLIST ? wishlistFeature.error : movieDiscovery.error;
  const activeGenre = useMemo(
    () => movieDiscovery.genres.find((genre) => String(genre.id) === String(filters.genreId)),
    [filters.genreId, movieDiscovery.genres],
  );
  const isInitialLoading = (activeRoute === ROUTES.DISCOVER && movieDiscovery.loading)
    || (activeRoute === ROUTES.WISHLIST && wishlistFeature.loading);

  const handleSortChange = useCallback((sortBy) => {
    setFilters((current) => ({ ...current, sortBy }));
  }, [setFilters]);

  const handleGenreChange = useCallback((genreId) => {
    setFilters((current) => ({ ...current, genreId }));
  }, [setFilters]);

  const handleCloseDetail = useCallback(() => setSelectedMovie(null), [setSelectedMovie]);

  const handleRetry = useCallback(() => {
    if (activeRoute === ROUTES.WISHLIST) {
      wishlistFeature.refreshWishlist();
      return;
    }

    movieDiscovery.retry();
  }, [activeRoute, movieDiscovery, wishlistFeature]);

  const headerProps = useMemo(() => ({
    activeRoute,
    filters,
    genres: movieDiscovery.genres,
    searchQuery,
    onGenreChange: handleGenreChange,
    onRouteChange: setActiveRoute,
    onSearchChange: setSearchQuery,
    onSortChange: handleSortChange,
  }), [activeRoute, filters, handleGenreChange, handleSortChange, movieDiscovery.genres, searchQuery, setActiveRoute, setSearchQuery]);

  useScrollMemory({ activeRoute, getScrollPosition, saveScrollPosition });

  useInfiniteScroll({
    enabled: activeRoute === ROUTES.DISCOVER,
    sentinelRef,
    loading: movieDiscovery.loading,
    loadingMore: movieDiscovery.loadingMore,
    page: movieDiscovery.page,
    totalPages: movieDiscovery.totalPages,
    onLoadMore: movieDiscovery.loadNextPage,
  });

  return (
    <AppShell headerProps={headerProps}>
      <section className="mb-6 overflow-hidden rounded-md border border-white/80 bg-white/85 p-5 shadow-xl shadow-zinc-900/5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              {activeRoute === ROUTES.WISHLIST ? 'Your saved shelf' : activeGenre?.name || 'Trending now'}
            </p>
            <h2 className="mt-1 text-2xl font-black text-zinc-950">
              {activeRoute === ROUTES.WISHLIST ? `${wishlistFeature.savedWishlist.length} saved titles` : `${sortedMovies.length} movies ready`}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {activeRoute === ROUTES.WISHLIST
                ? 'Only movies saved in MongoDB appear here.'
                : searchQuery.trim()
                  ? `Showing results for "${searchQuery.trim()}".`
                  : 'Use genre chips or the dropdown to shape the feed.'}
            </p>
          </div>
        {activeRoute === ROUTES.DISCOVER && (
          <p className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold uppercase tracking-normal text-white shadow-md shadow-zinc-950/10">
            Source: {movieDiscovery.source}
          </p>
        )}
        </div>
      </section>

      {activeError && <ErrorBlock message={activeError} onRetry={handleRetry} />}
      {isInitialLoading ? (
        <div className="mt-5"><SkeletonGrid /></div>
      ) : sortedMovies.length === 0 ? (
        <EmptyState mode={activeRoute} />
      ) : (
        <MovieGrid
          movies={sortedMovies}
          wishlistIds={wishlistFeature.wishlistIds}
          onToggle={wishlistFeature.handleToggle}
          onOpen={setSelectedMovie}
        />
      )}

      {movieDiscovery.loadingMore && <div className="mt-6"><SkeletonGrid /></div>}
      <div ref={sentinelRef} className="h-12" />

      <DetailPanel
        movie={selectedMovie}
        saved={selectedMovie ? wishlistFeature.wishlistIds.has(selectedMovie.id) : false}
        onClose={handleCloseDetail}
        onToggle={wishlistFeature.handleToggle}
      />
    </AppShell>
  );
};
