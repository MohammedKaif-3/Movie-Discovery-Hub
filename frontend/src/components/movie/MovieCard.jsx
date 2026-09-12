import { memo, useCallback } from 'react';
import { MoviePoster } from './MoviePoster.jsx';

export const MovieCard = memo(({ movie, saved, onToggle, onOpen }) => {
  const handleOpen = useCallback(() => onOpen(movie), [movie, onOpen]);
  const handleToggle = useCallback(() => onToggle(movie), [movie, onToggle]);

  return (
    <article className="movie-card group overflow-hidden rounded-md border border-white bg-white/95 shadow-md shadow-zinc-900/5 transition duration-200 hover:-translate-y-1 hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-900/10">
      <button type="button" onClick={handleOpen} className="relative block w-full text-left">
        <MoviePoster movie={movie} />
        <span className="absolute right-2 top-2 rounded-full bg-zinc-950/85 px-2 py-1 text-xs font-bold text-white shadow backdrop-blur">
          {Number(movie.rating || 0).toFixed(1)}
        </span>
      </button>
      <div className="space-y-3 p-3">
        <div>
          <button type="button" onClick={handleOpen} className="line-clamp-2 min-h-10 text-left text-sm font-semibold leading-5 text-zinc-950">
            {movie.title}
          </button>
          <div className="mt-1 flex items-center justify-between text-xs text-zinc-500">
            <span>{movie.releaseDate}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className={`w-full rounded-md border px-3 py-2 text-sm font-semibold transition ${
          saved ? 'border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-700' : 'border-zinc-200 bg-[#f8f6f0] text-zinc-900 hover:border-zinc-900 hover:bg-white'
          }`}
        >
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </article>
  );
});

MovieCard.displayName = 'MovieCard';
