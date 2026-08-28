import React from 'react';
import { cn } from '../../utils/cn';

export const SkeletonLine = ({ className = '' }) => {
  return <div className={cn('bg-slate-200 rounded animate-pulse h-4', className)} />;
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
      <div className="px-6 py-4 bg-slate-50 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonLine key={i} className="h-5 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="px-6 py-4 flex items-center gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonLine key={c} className={cn('h-4 flex-1', c === 0 ? 'w-1/3' : 'w-full')} />
          ))}
        </div>
      ))}
    </div>
  );
};
