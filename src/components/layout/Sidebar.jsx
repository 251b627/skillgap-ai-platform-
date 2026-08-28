import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NAV_ITEMS } from '../../constants/navigation';
import { SidebarNavItem } from './SidebarNavItem';
import { cn } from '../../utils/cn';

export const Sidebar = ({ isMobileOpen, onMobileClose, isCollapsed, onToggleCollapse }) => {
  const { role } = useAuth();
  const location = useLocation();

  // Filter navigation items by active user role
  const filteredNav = NAV_ITEMS.map((section) => {
    if (section.roles && !section.roles.includes(role)) return null;
    const items = section.items.filter((item) => !item.roles || item.roles.includes(role));
    if (items.length === 0) return null;
    return { ...section, items };
  }).filter(Boolean);

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-sm tracking-tight leading-none">
                  SkillGap<span className="text-brand-600">.AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-0.5">
                  Academia–Industry Hub
                </span>
              </div>
            )}
          </div>

          {/* Close on mobile */}
          <button
            onClick={onMobileClose}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {filteredNav.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && section.title && (
                <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarNavItem
                    key={item.path}
                    item={item}
                    collapsed={isCollapsed}
                    onClick={onMobileClose}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Collapse button for desktop */}
      <div className="hidden md:block p-3 border-t border-slate-100">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-slate-500 hover:bg-slate-100 text-xs font-medium transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:block fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
