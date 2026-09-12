import { memo } from 'react';
import { ROUTES } from '../../constants/app.js';

export const EmptyState = memo(({ mode }) => (
  <div className="glass-panel animate-scale-in mx-auto flex max-w-xl flex-col items-center rounded-md border px-8 py-16 text-center shadow-2xl">
    <svg viewBox="0 0 240 160" role="img" aria-label="Empty movie shelf" className="mb-6 h-36 w-56">
      <rect x="26" y="36" width="188" height="96" rx="8" fill="#eef2f0" />
      <rect x="44" y="54" width="34" height="54" rx="4" fill="#2f4f4f" />
      <rect x="88" y="48" width="34" height="66" rx="4" fill="#d97706" />
      <rect x="132" y="61" width="34" height="47" rx="4" fill="#607d8b" />
      <path d="M188 55l18 18-18 18-18-18z" fill="#7c3aed" opacity="0.82" />
      <rect x="34" y="121" width="172" height="8" rx="4" fill="#cbd5d1" />
    </svg>
    <h2 className="text-primary text-2xl font-black">
      {mode === ROUTES.WISHLIST ? 'Your wishlist is waiting.' : 'No titles found.'}
    </h2>
    <p className="text-muted mt-3 text-sm leading-6">
      {mode === ROUTES.WISHLIST
        ? 'Save movies from discovery and they will stay synced here across browser sessions.'
        : 'Try another title, shorter wording, or clear the search to return to trending movies.'}
    </p>
  </div>
));

EmptyState.displayName = 'EmptyState';
