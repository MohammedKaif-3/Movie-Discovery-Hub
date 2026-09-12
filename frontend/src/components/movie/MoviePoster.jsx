import { memo } from 'react';

export const MoviePoster = memo(({ movie, className = '' }) => (
  <div className={`aspect-[2/3] overflow-hidden rounded-md bg-stone-200 ${className}`}>
    {movie.posterPath ? (
      <img
        src={movie.posterPath}
        alt={`${movie.title} poster`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#d9e4dd,#f2d0a4)] p-6 text-center text-sm font-semibold text-zinc-700">
        No poster
      </div>
    )}
  </div>
));

MoviePoster.displayName = 'MoviePoster';
