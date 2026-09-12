import { memo, useCallback, useMemo } from 'react';
import { ROUTES, SORT_OPTIONS, THEMES } from '../../constants/app.js';
import logoUrl from '../../assets/logo.jpg';

const ROUTE_OPTIONS = [ROUTES.DISCOVER, ROUTES.WISHLIST];

export const Header = memo(({
  activeRoute,
  filters,
  genres,
  searchQuery,
  theme,
  onGenreChange,
  onRouteChange,
  onSearchChange,
  onSortChange,
  onThemeToggle,
}) => {
  const handleGenreChange = useCallback((event) => onGenreChange(event.target.value), [onGenreChange]);
  const handleSearchChange = useCallback((event) => onSearchChange(event.target.value), [onSearchChange]);
  const handleSortChange = useCallback((event) => onSortChange(event.target.value), [onSortChange]);
  const topGenres = useMemo(() => genres.slice(0, 10), [genres]);

  return (
    <header className="glass-header sticky top-0 z-20 border-b backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="brand-mark flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md shadow-2xl">
              <img src={logoUrl} alt="Trackzio Movie Hub logo" className="h-full w-full object-cover" />
            </span>
            <div>
              <p className="accent-text text-xs font-black uppercase tracking-[0.22em]">Trackzio</p>
              <h1 className="text-primary text-3xl font-black tracking-normal sm:text-4xl">Movie Hub</h1>
              <p className="text-muted mt-1 text-sm">A polished discovery desk for finding, filtering, and saving films.</p>
            </div>
          </div>
          <div className="flex flex-row flex-wrap items-center gap-3 lg:flex-nowrap">
            <nav className="route-toggle glass-nav grid flex-1 grid-cols-2 rounded-md border p-1 shadow-inner lg:flex-none" data-active={activeRoute}>
            {ROUTE_OPTIONS.map((route) => (
              <button
                key={route}
                type="button"
                aria-pressed={activeRoute === route}
                onClick={() => onRouteChange(route)}
                className={`route-toggle-option rounded px-4 py-2 text-sm font-bold capitalize transition duration-300 ${
                  activeRoute === route ? 'route-active' : 'text-muted hover:text-primary'
                }`}
              >
                {route}
              </button>
            ))}
            </nav>
            <button type="button" onClick={onThemeToggle} className="interactive-button glass-control h-11 shrink-0 rounded-md border px-4 text-sm font-black transition duration-300 hover:-translate-y-0.5">
              {theme === THEMES.DARK ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
        <div className="grid gap-3 rounded-md border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-2xl md:grid-cols-[1fr_190px_190px]">
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={activeRoute === ROUTES.WISHLIST}
            placeholder="Search movies"
            className="glass-control h-12 rounded-md border px-4 text-sm shadow-lg outline-none transition duration-300 placeholder:text-zinc-400 focus:ring-2 disabled:opacity-60"
          />
          <select
            value={filters.genreId || ''}
            onChange={handleGenreChange}
            disabled={activeRoute === ROUTES.WISHLIST || Boolean(searchQuery.trim())}
            className="glass-control h-12 rounded-md border px-3 text-sm font-semibold shadow-lg outline-none transition duration-300 focus:ring-2 disabled:opacity-60"
          >
            <option value="">All genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="glass-control h-12 rounded-md border px-3 text-sm font-semibold shadow-lg outline-none transition duration-300 focus:ring-2"
          >
            <option value={SORT_OPTIONS.POPULAR}>Popular</option>
            <option value={SORT_OPTIONS.RATING}>Top rated</option>
            <option value={SORT_OPTIONS.RELEASE}>Newest</option>
          </select>
        </div>
        {activeRoute === ROUTES.DISCOVER && !searchQuery.trim() && (
          <div className="scroll-strip hidden gap-2 overflow-x-auto pb-1 sm:flex">
            <button
              type="button"
              onClick={() => onGenreChange('')}
              className={`interactive-button chip-button shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                !filters.genreId ? 'chip-active' : 'chip-idle'
              }`}
            >
              All
            </button>
            {topGenres.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => onGenreChange(String(genre.id))}
                className={`interactive-button chip-button shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  String(filters.genreId || '') === String(genre.id)
                    ? 'chip-active'
                    : 'chip-idle'
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
