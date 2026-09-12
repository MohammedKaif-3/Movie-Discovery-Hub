import { memo, useCallback, useMemo } from 'react';
import { ROUTES, SORT_OPTIONS } from '../../constants/app.js';

const ROUTE_OPTIONS = [ROUTES.DISCOVER, ROUTES.WISHLIST];

export const Header = memo(({
  activeRoute,
  filters,
  genres,
  searchQuery,
  onGenreChange,
  onRouteChange,
  onSearchChange,
  onSortChange,
}) => {
  const handleGenreChange = useCallback((event) => onGenreChange(event.target.value), [onGenreChange]);
  const handleSearchChange = useCallback((event) => onSearchChange(event.target.value), [onSearchChange]);
  const handleSortChange = useCallback((event) => onSortChange(event.target.value), [onSortChange]);
  const topGenres = useMemo(() => genres.slice(0, 10), [genres]);

  return (
    <header className="sticky top-0 z-10 border-b border-white/70 bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-950 text-lg font-black text-white shadow-lg shadow-zinc-950/15">
                T
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Trackzio</p>
                <h1 className="text-2xl font-black tracking-normal text-zinc-950 sm:text-3xl">Movie Hub</h1>
              </div>
            </div>
            <p className="mt-2 text-sm text-zinc-600">Discover, filter, and save movies without losing your place.</p>
          </div>
          <nav className="flex rounded-md border border-zinc-200 bg-zinc-100 p-1 shadow-inner">
            {ROUTE_OPTIONS.map((route) => (
              <button
                key={route}
                type="button"
                onClick={() => onRouteChange(route)}
                className={`rounded px-4 py-2 text-sm font-semibold capitalize ${
                  activeRoute === route ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {route}
              </button>
            ))}
          </nav>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={activeRoute === ROUTES.WISHLIST}
            placeholder="Search movies"
            className="h-12 rounded-md border border-zinc-200 bg-white px-4 text-sm shadow-sm outline-none ring-zinc-900 transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 disabled:bg-zinc-100"
          />
          <select
            value={filters.genreId || ''}
            onChange={handleGenreChange}
            disabled={activeRoute === ROUTES.WISHLIST || Boolean(searchQuery.trim())}
            className="h-12 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium shadow-sm outline-none ring-zinc-900 focus:border-zinc-900 focus:ring-2 disabled:bg-zinc-100"
          >
            <option value="">All genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="h-12 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium shadow-sm outline-none ring-zinc-900 focus:border-zinc-900 focus:ring-2"
          >
            <option value={SORT_OPTIONS.POPULAR}>Popular</option>
            <option value={SORT_OPTIONS.RATING}>Top rated</option>
            <option value={SORT_OPTIONS.RELEASE}>Newest</option>
          </select>
        </div>
        {activeRoute === ROUTES.DISCOVER && !searchQuery.trim() && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => onGenreChange('')}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                !filters.genreId ? 'border-zinc-950 bg-zinc-950 text-white shadow-md shadow-zinc-950/10' : 'border-zinc-200 bg-white text-zinc-700 shadow-sm hover:border-zinc-950 hover:text-zinc-950'
              }`}
            >
              All
            </button>
            {topGenres.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => onGenreChange(String(genre.id))}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  String(filters.genreId || '') === String(genre.id)
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-md shadow-zinc-950/10'
                    : 'border-zinc-200 bg-white text-zinc-700 shadow-sm hover:border-zinc-950 hover:text-zinc-950'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';
