import { memo } from 'react';

export const ErrorBlock = memo(({ message, onRetry }) => (
  <div className="animate-slide-in rounded-md border border-red-300/50 bg-red-500/10 p-4 text-red-900 shadow-2xl backdrop-blur-2xl">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-bold">{message}</p>
      <button type="button" onClick={onRetry} className="interactive-button rounded-md bg-red-950 px-4 py-2 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-800">
        Retry
      </button>
    </div>
  </div>
));

ErrorBlock.displayName = 'ErrorBlock';
