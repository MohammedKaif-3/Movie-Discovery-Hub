import { memo } from 'react';
import { MovieCard } from './MovieCard.jsx';

export const MovieGrid = memo(({ movies, wishlistIds, onToggle, onOpen }) => (
  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
    {movies.map((movie) => (
      <MovieCard
        key={movie.id}
        movie={movie}
        saved={wishlistIds.has(movie.id)}
        onToggle={onToggle}
        onOpen={onOpen}
      />
    ))}
  </div>
));

MovieGrid.displayName = 'MovieGrid';
