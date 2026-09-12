import { memo } from 'react';
import { MovieCard } from './MovieCard.jsx';

export const MovieGrid = memo(({ movies, wishlistIds, onToggle, onOpen }) => (
  <div className="movie-grid mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
    {movies.map((movie, index) => (
      <MovieCard
        key={movie.id}
        movie={movie}
        saved={wishlistIds.has(movie.id)}
        onToggle={onToggle}
        onOpen={onOpen}
        index={index}
      />
    ))}
  </div>
));

MovieGrid.displayName = 'MovieGrid';
