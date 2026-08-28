import React from 'react';
import { cn } from '../../utils/cn';

export const FormFieldWrapper = ({
  label,
  error,
  required = false,
  helpText,
  children,
  className = '',
}) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {helpText && !error && <p className="text-xs text-slate-400">{helpText}</p>}
      {error && <p className="text-xs font-medium text-rose-600 animate-in fade-in">{error}</p>}
    </div>
  );
};
