import { memo, useCallback } from 'react';
import { MoviePoster } from './MoviePoster.jsx';

export const DetailPanel = memo(({ movie, saved, onClose, onToggle }) => {
  const handleToggle = useCallback(() => onToggle(movie), [movie, onToggle]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-zinc-950/60 p-2 backdrop-blur-2xl sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="detail-panel glass-panel animate-scale-in mx-auto grid max-h-[94dvh] w-full max-w-4xl overflow-hidden rounded-md border shadow-2xl sm:grid-cols-[280px_1fr]">
        <MoviePoster movie={movie} className="detail-poster" />
        <div className="max-h-[calc(94dvh-14rem)] overflow-y-auto p-5 sm:max-h-[92vh] sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="accent-text text-xs font-black uppercase tracking-[0.2em]">{movie.genres?.slice(0, 3).join(' / ') || 'Featured Film'}</p>
              <h2 className="text-primary mt-2 text-2xl font-black leading-tight sm:text-3xl">{movie.title}</h2>
              <p className="text-muted mt-2 text-sm font-semibold">
                {movie.releaseDate} - Rating {Number(movie.rating || 0).toFixed(1)}
              </p>
            </div>
            <button type="button" onClick={onClose} className="interactive-button button-ghost shrink-0 rounded-md border px-3 py-2 text-sm font-bold">
              Close
            </button>
          </div>
          <p className="text-body mt-6 text-sm leading-7">{movie.overview}</p>
          <button type="button" onClick={handleToggle} className="interactive-button button-saved mt-7 w-full rounded-md border px-5 py-3 text-sm font-black shadow-xl sm:w-auto">
            {saved ? 'Remove from wishlist' : 'Add to wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
});

DetailPanel.displayName = 'DetailPanel';
