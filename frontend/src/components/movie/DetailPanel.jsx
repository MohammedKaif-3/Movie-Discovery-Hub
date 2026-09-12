import { memo, useCallback } from 'react';
import { MoviePoster } from './MoviePoster.jsx';

export const DetailPanel = memo(({ movie, saved, onClose, onToggle }) => {
  const handleToggle = useCallback(() => onToggle(movie), [movie, onToggle]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-20 bg-zinc-950/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="mx-auto grid max-h-[92vh] max-w-3xl overflow-auto rounded-md bg-white shadow-xl sm:grid-cols-[220px_1fr]">
        <MoviePoster movie={movie} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-950">{movie.title}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {movie.releaseDate} - Rating {Number(movie.rating || 0).toFixed(1)}
              </p>
            </div>
            <button type="button" onClick={onClose} className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold">
              Close
            </button>
          </div>
          <p className="mt-5 text-sm leading-6 text-zinc-700">{movie.overview}</p>
          <button type="button" onClick={handleToggle} className="mt-6 rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700">
            {saved ? 'Remove from wishlist' : 'Add to wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
});

DetailPanel.displayName = 'DetailPanel';
