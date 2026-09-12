import { memo } from 'react';

export const SkeletonGrid = memo(() => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
    {Array.from({ length: 12 }).map((_, index) => (
      <div key={index} className="overflow-hidden rounded-md border border-zinc-200 bg-white">
        <div className="skeleton aspect-[2/3]" />
        <div className="space-y-3 p-3">
          <div className="skeleton h-4 w-4/5 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
    ))}
  </div>
));

SkeletonGrid.displayName = 'SkeletonGrid';
