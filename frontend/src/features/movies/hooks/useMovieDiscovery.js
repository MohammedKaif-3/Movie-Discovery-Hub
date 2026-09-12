import { useCallback, useEffect, useState } from 'react';
import { FALLBACK_GENRES, ROUTES } from '../../../constants/app.js';
import { fetchGenres, fetchMovies } from '../../../services/api.js';
import { useDebounce } from '../../../hooks/useDebounce.js';

export const useMovieDiscovery = ({ activeRoute, filters, searchQuery, setMovies }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [genres, setGenres] = useState(FALLBACK_GENRES);
  const [error, setError] = useState('');
  const [source, setSource] = useState('network');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const genreId = filters.genreId || '';

  const loadMovies = useCallback(async ({ nextPage = 1, append = false } = {}) => {
    const isAppend = append && nextPage > 1;
    setError('');
    isAppend ? setLoadingMore(true) : setLoading(true);
    if (!isAppend) setMovies([]);

    try {
      const payload = await fetchMovies({ genreId, query: debouncedQuery, page: nextPage });
      setMovies((current) => (isAppend ? [...current, ...payload.data] : payload.data));
      setPage(payload.page);
      setTotalPages(payload.totalPages);
      setSource(payload.source);
    } catch (err) {
      setError(err.message);
      if (!isAppend) setMovies([]);
    } finally {
      isAppend ? setLoadingMore(false) : setLoading(false);
    }
  }, [debouncedQuery, genreId, setMovies]);

  const loadNextPage = useCallback((nextPage) => {
    loadMovies({ nextPage, append: true });
  }, [loadMovies]);

  const retry = useCallback(() => {
    loadMovies({ nextPage: 1, append: false });
  }, [loadMovies]);

  useEffect(() => {
    if (activeRoute === ROUTES.DISCOVER) {
      setPage(1);
      loadMovies({ nextPage: 1, append: false });
    }
  }, [activeRoute, debouncedQuery, genreId, loadMovies]);

  useEffect(() => {
    let cancelled = false;

    const loadGenres = async () => {
      try {
        const payload = await fetchGenres();
        if (!cancelled && payload.data?.length) setGenres(payload.data);
      } catch (err) {
        console.warn('Using bundled genre list because TMDB genres failed:', err.message);
      }
    };

    loadGenres();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    error,
    genres,
    loading,
    loadingMore,
    page,
    retry,
    source,
    totalPages,
    loadNextPage,
  };
};
