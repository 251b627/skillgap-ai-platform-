import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ children, className = '', hoverEffect = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden',
        hoverEffect && 'transition-all duration-200 hover:shadow-md hover:border-slate-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={cn('p-5 border-b border-slate-100 flex items-center justify-between gap-4', className)}>
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export const CardBody = ({ children, className = '' }) => {
  return <div className={cn('p-5', className)}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return <div className={cn('px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between', className)}>{children}</div>;
};
