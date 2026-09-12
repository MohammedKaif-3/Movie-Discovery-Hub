import { useCallback, useEffect, useMemo, useState } from 'react';
import { ROUTES, USER_ID } from '../../../constants/app.js';
import { fetchWishlist, toggleWishlist } from '../../../services/api.js';
import { createWishlistIdSet, normalizeWishlistItems } from '../../../utils/wishlist.js';

export const useWishlist = ({ activeRoute, setWishlist, wishlist }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const savedWishlist = useMemo(() => normalizeWishlistItems(wishlist), [wishlist]);
  const wishlistIds = useMemo(() => createWishlistIdSet(savedWishlist), [savedWishlist]);

  const refreshWishlist = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await fetchWishlist(USER_ID);
      setWishlist(normalizeWishlistItems(payload.data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setWishlist]);

  const handleToggle = useCallback(async (movie) => {
    setError('');
    const movieId = String(movie.id);

    try {
      const payload = await toggleWishlist({ userId: USER_ID, movie });
      if (payload.action === 'removed') {
        setWishlist((current) => current.filter((item) => String(item.movieId) !== movieId));
      } else if (payload.data) {
        setWishlist((current) => [
          payload.data,
          ...current.filter((item) => String(item.movieId) !== movieId),
        ]);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [setWishlist]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  useEffect(() => {
    if (activeRoute === ROUTES.WISHLIST) {
      refreshWishlist();
    }
  }, [activeRoute, refreshWishlist]);

  return {
    error,
    handleToggle,
    loading,
    refreshWishlist,
    savedWishlist,
    wishlistIds,
  };
};
