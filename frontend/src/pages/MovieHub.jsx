import { useCallback, useMemo, useRef } from 'react';
import { AppShell } from '../components/layout/AppShell.jsx';
import { DetailPanel } from '../components/movie/DetailPanel.jsx';
import { EmptyState } from '../components/feedback/EmptyState.jsx';
import { ErrorBlock } from '../components/feedback/ErrorBlock.jsx';
import { MovieGrid } from '../components/movie/MovieGrid.jsx';
import { ROUTES, THEMES } from '../constants/app.js';
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
    setTheme,
    setWishlist,
    theme,
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

  const handleThemeToggle = useCallback(() => {
    setTheme((current) => (current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
  }, [setTheme]);

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
    theme,
    onGenreChange: handleGenreChange,
    onRouteChange: setActiveRoute,
    onSearchChange: setSearchQuery,
    onSortChange: handleSortChange,
    onThemeToggle: handleThemeToggle,
  }), [activeRoute, filters, handleGenreChange, handleSortChange, handleThemeToggle, movieDiscovery.genres, searchQuery, setActiveRoute, setSearchQuery, theme]);

  useScrollMemory({ activeRoute, getScrollPosition, saveScrollPosition });

  useInfiniteScroll({
    enabled: activeRoute === ROUTES.DISCOVER,
    sentinelRef,
    loading: movieDiscovery.loading,
    loadingMore: movieDiscovery.loadingMore,
    page: movieDiscovery.page,
    resetKey: `${activeRoute}:${filters.genreId || 'all'}:${searchQuery.trim().toLowerCase()}`,
    totalPages: movieDiscovery.totalPages,
    onLoadMore: movieDiscovery.loadNextPage,
  });

  return (
    <AppShell headerProps={headerProps}>
      <section className="hero-panel animate-slide-in mb-6 overflow-hidden rounded-md border p-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="accent-text text-xs font-black uppercase tracking-[0.22em]">
              {activeRoute === ROUTES.WISHLIST ? 'Your saved shelf' : activeGenre?.name || 'Trending now'}
            </p>
            <h2 className="text-primary mt-2 max-w-2xl text-4xl font-black tracking-normal sm:text-5xl">
              {activeRoute === ROUTES.WISHLIST ? `${wishlistFeature.savedWishlist.length} saved titles` : `${sortedMovies.length} movies ready`}
            </h2>
            <p className="text-muted mt-3 max-w-2xl text-sm leading-6">
              {activeRoute === ROUTES.WISHLIST
                ? 'Only movies saved in MongoDB appear here.'
                : searchQuery.trim()
                  ? `Showing results for "${searchQuery.trim()}".`
                  : 'A cinematic workspace with cached discovery, genre browsing, and persistent saves.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="metric-pill rounded-md border px-4 py-3">
              <p className="text-muted text-xs font-bold uppercase tracking-[0.16em]">Source</p>
              <p className="text-primary mt-1 text-sm font-black">{activeRoute === ROUTES.DISCOVER ? movieDiscovery.source : 'MongoDB'}</p>
            </div>
            <div className="metric-pill rounded-md border px-4 py-3">
              <p className="text-muted text-xs font-bold uppercase tracking-[0.16em]">Mode</p>
              <p className="text-primary mt-1 text-sm font-black">{activeRoute}</p>
            </div>
          </div>
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
      <div ref={sentinelRef} className="scroll-sentinel h-16" />

      <DetailPanel
        movie={selectedMovie}
        saved={selectedMovie ? wishlistFeature.wishlistIds.has(selectedMovie.id) : false}
        onClose={handleCloseDetail}
        onToggle={wishlistFeature.handleToggle}
      />
    </AppShell>
  );
};
