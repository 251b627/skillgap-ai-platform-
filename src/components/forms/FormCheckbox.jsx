import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const FormCheckbox = forwardRef(({
  label,
  description,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500',
            className
          )}
          {...props}
        />
      </div>
      <div>
        {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
        {description && <p className="text-xs text-slate-400">{description}</p>}
        {error && <p className="text-xs font-medium text-rose-600 mt-1">{error}</p>}
      </div>
    </div>
  );
});

FormCheckbox.displayName = 'FormCheckbox';
