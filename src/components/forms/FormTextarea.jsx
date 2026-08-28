import React, { forwardRef } from 'react';
import { FormFieldWrapper } from './FormFieldWrapper';
import { cn } from '../../utils/cn';

export const FormTextarea = forwardRef(({
  label,
  error,
  required,
  helpText,
  rows = 3,
  className = '',
  ...props
}, ref) => {
  return (
    <FormFieldWrapper label={label} error={error} required={required} helpText={helpText}>
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50',
          error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20',
          className
        )}
        {...props}
      />
    </FormFieldWrapper>
  );
});

FormTextarea.displayName = 'FormTextarea';
