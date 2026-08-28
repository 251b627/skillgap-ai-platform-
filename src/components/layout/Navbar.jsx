import React, { useState } from 'react';
import { Menu, Search, Bell, Sparkles, Shield, Compass } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, ROLE_LABELS, ROLE_DASHBOARDS } from '../../constants/roles';
import { UserMenu } from './UserMenu';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onMobileMenuToggle, isSidebarCollapsed }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { role, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleQuickSwitch = async (e) => {
    const target = e.target.value;
    await switchRole(target);
    navigate(ROLE_DASHBOARDS[target]);
  };

  return (
    <>
      <header className={`fixed top-0 right-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:left-20' : 'md:left-64'
      } left-0`}>
        <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Left section */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMobileMenuToggle}
              className="md:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global search trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-500 rounded-xl text-xs font-medium transition-colors border border-slate-200/60 shadow-inner"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search platform...</span>
              <kbd className="ml-4 px-1.5 py-0.5 bg-white rounded border border-slate-200 text-[10px] text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Role Selector Dropdown */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
              <Shield className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="text-[11px] font-semibold text-slate-500">Role:</span>
              <select
                value={role || ROLES.ADMIN}
                onChange={handleRoleQuickSwitch}
                className="bg-transparent text-xs font-semibold text-brand-700 focus:outline-none cursor-pointer"
              >
                {Object.keys(ROLES).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications mock */}
            <button
              onClick={() => {}}
              className="relative p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full ring-2 ring-white" />
            </button>

            {/* User Profile */}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
