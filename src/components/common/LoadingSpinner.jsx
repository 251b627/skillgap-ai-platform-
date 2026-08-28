import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const LoadingSpinner = ({ size = 'md', text = 'Loading data...', fullPage = false, className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <Loader2 className={cn('animate-spin text-brand-600', sizes[size])} />
      {text && <p className="text-sm text-slate-500 font-medium mt-3">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
