import React, { forwardRef } from 'react';
import { FormFieldWrapper } from './FormFieldWrapper';
import { cn } from '../../utils/cn';

export const FormSelect = forwardRef(({
  label,
  error,
  required,
  helpText,
  options = [],
  placeholder = 'Select an option',
  className = '',
  ...props
}, ref) => {
  return (
    <FormFieldWrapper label={label} error={error} required={required} helpText={helpText}>
      <select
        ref={ref}
        className={cn(
          'block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50',
          error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormFieldWrapper>
  );
});

FormSelect.displayName = 'FormSelect';
