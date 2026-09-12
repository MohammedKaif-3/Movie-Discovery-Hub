import { SORT_OPTIONS } from '../constants/app.js';

export const sortMovies = (movies, sortBy) => {
  const sortedMovies = [...movies];

  if (sortBy === SORT_OPTIONS.RATING) {
    return sortedMovies.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  }

  if (sortBy === SORT_OPTIONS.RELEASE) {
    return sortedMovies.sort((a, b) => String(b.releaseDate).localeCompare(String(a.releaseDate)));
  }

  return sortedMovies;
};
