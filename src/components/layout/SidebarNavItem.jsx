import React from 'react';
import { NavLink } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { cn } from '../../utils/cn';

export const SidebarNavItem = ({ item, collapsed = false, onClick }) => {
  const IconComponent = LucideIcons[item.icon] || LucideIcons.Circle;

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group select-none',
          isActive
            ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm border border-brand-200/60'
            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900',
          collapsed && 'justify-center px-2'
        )
      }
      title={collapsed ? item.name : undefined}
    >
      <IconComponent className={cn('w-4 h-4 shrink-0 transition-transform group-hover:scale-110')} />
      {!collapsed && <span className="truncate">{item.name}</span>}
    </NavLink>
  );
};
