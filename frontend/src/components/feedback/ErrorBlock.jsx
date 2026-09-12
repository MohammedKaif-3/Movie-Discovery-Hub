import { memo } from 'react';

export const ErrorBlock = memo(({ message, onRetry }) => (
  <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-900">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium">{message}</p>
      <button type="button" onClick={onRetry} className="rounded-md bg-red-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800">
        Retry
      </button>
    </div>
  </div>
));

ErrorBlock.displayName = 'ErrorBlock';
