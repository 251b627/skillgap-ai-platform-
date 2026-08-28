import React, { forwardRef } from 'react';
import { FormFieldWrapper } from './FormFieldWrapper';
import { cn } from '../../utils/cn';

export const FormInput = forwardRef(({
  label,
  error,
  required,
  helpText,
  icon: Icon,
  type = 'text',
  className = '',
  ...props
}, ref) => {
  return (
    <FormFieldWrapper label={label} error={error} required={required} helpText={helpText}>
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50 disabled:text-slate-500',
            Icon && 'pl-9',
            error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          {...props}
        />
      </div>
    </FormFieldWrapper>
  );
});

FormInput.displayName = 'FormInput';
