import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_FILTERS } from '../constants/app.js';
import { AppContext } from './AppContextCore.js';

const STORAGE_KEY = 'trackzio.movieHub.context.v1';

const defaultState = {
  searchQuery: '',
  filters: DEFAULT_FILTERS,
  scrollPositions: {},
  activeRoute: 'discover',
  wishlist: [],
};

const readInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const parsedState = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsedState,
      // Wishlist is server-owned data. Keeping old wishlist rows in browser
      // storage can make removed movies reappear after refresh or tab changes.
      wishlist: [],
    };
  } catch {
    return defaultState;
  }
};

export const AppProvider = ({ children }) => {
  const initialState = useMemo(readInitialState, []);
  const scrollPositionsRef = useRef(initialState.scrollPositions);
  const [searchQuery, setSearchQuery] = useState(initialState.searchQuery);
  const [filters, setFilters] = useState(initialState.filters);
  const [activeRoute, setActiveRoute] = useState(initialState.activeRoute);
  const [wishlist, setWishlist] = useState(initialState.wishlist);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const persistState = useCallback((statePatch = {}) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      searchQuery,
      filters,
      scrollPositions: scrollPositionsRef.current,
      activeRoute,
      ...statePatch,
    }));
  }, [activeRoute, filters, searchQuery]);

  const getScrollPosition = useCallback((route) => scrollPositionsRef.current[route] || 0, []);

  const saveScrollPosition = useCallback((route, top) => {
    scrollPositionsRef.current = {
      ...scrollPositionsRef.current,
      [route]: top,
    };
  }, []);

  useEffect(() => {
    persistState();
  }, [persistState]);

  useEffect(() => {
    const persistBeforeExit = () => persistState();
    window.addEventListener('pagehide', persistBeforeExit);
    return () => window.removeEventListener('pagehide', persistBeforeExit);
  }, [persistState]);

  const value = useMemo(() => ({
    activeRoute,
    filters,
    getScrollPosition,
    movies,
    saveScrollPosition,
    searchQuery,
    selectedMovie,
    wishlist,
    setActiveRoute,
    setFilters,
    setMovies,
    setSearchQuery,
    setSelectedMovie,
    setWishlist,
  }), [activeRoute, filters, getScrollPosition, movies, saveScrollPosition, searchQuery, selectedMovie, wishlist]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
