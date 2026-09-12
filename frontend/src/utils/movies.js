export const mergeUniqueMovies = (currentMovies = [], incomingMovies = []) => {
  const moviesById = new Map();

  [...currentMovies, ...incomingMovies].forEach((movie) => {
    if (!movie?.id) return;
    moviesById.set(String(movie.id), movie);
  });

  return Array.from(moviesById.values());
};
