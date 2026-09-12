import { memo, useCallback } from 'react';
import { MoviePoster } from './MoviePoster.jsx';

export const MovieCard = memo(({ movie, saved, onToggle, onOpen, index = 0 }) => {
  const handleOpen = useCallback(() => onOpen(movie), [movie, onOpen]);
  const handleToggle = useCallback(() => onToggle(movie), [movie, onToggle]);
  const primaryGenre = movie.genres?.[0] || 'Movie';

  return (
    <article className="movie-card glass-card card-enter group overflow-hidden rounded-md border transition duration-500 hover:-translate-y-2" style={{ '--card-delay': `${Math.min(index, 18) * 35}ms` }}>
      <button type="button" onClick={handleOpen} className="relative block w-full overflow-hidden text-left">
        <MoviePoster movie={movie} />
        <div className="poster-vignette absolute inset-0 opacity-80 transition duration-500 group-hover:opacity-95" />
        <span className="rating-badge absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-black shadow-xl backdrop-blur">
          {Number(movie.rating || 0).toFixed(1)}
        </span>
        <span className="genre-badge absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] rounded-full px-3 py-1 text-xs font-bold shadow-xl backdrop-blur">
          {primaryGenre}
        </span>
      </button>
      <div className="space-y-4 p-4">
        <div>
          <button type="button" onClick={handleOpen} className="text-primary line-clamp-2 min-h-11 text-left text-base font-black leading-5 transition group-hover:opacity-90">
            {movie.title}
          </button>
          <div className="text-muted mt-2 flex items-center justify-between text-xs font-semibold">
            <span>{movie.releaseDate}</span>
            <span>{movie.genres?.slice(0, 2).join(' / ') || 'Cinema'}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className={`interactive-button w-full rounded-md border px-3 py-2.5 text-sm font-black transition duration-300 ${
          saved ? 'button-saved' : 'button-ghost'
          }`}
        >
          {saved ? 'Saved to Wishlist' : 'Add to Wishlist'}
        </button>
      </div>
    </article>
  );
});

MovieCard.displayName = 'MovieCard';
