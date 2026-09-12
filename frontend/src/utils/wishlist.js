export const normalizeWishlistItems = (items = []) => {
  const uniqueItems = new Map();

  items.forEach((item) => {
    const movieId = Number(item.movieId);
    const movie = item.movie;

    if (!Number.isFinite(movieId) || !movie || Number(movie.id) !== movieId) return;
    uniqueItems.set(movieId, { ...item, movie: { ...movie, id: movieId } });
  });

  return Array.from(uniqueItems.values());
};

export const createWishlistIdSet = (wishlistItems) => new Set(wishlistItems.map((item) => item.movieId));
