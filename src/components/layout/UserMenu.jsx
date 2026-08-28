import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Check, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, ROLE_LABELS, ROLE_DASHBOARDS } from '../../constants/roles';
import { Badge } from '../common/Badge';

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, logout, switchRole } = useAuth();
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = async (targetRole) => {
    await switchRole(targetRole);
    setIsOpen(false);
    navigate(ROLE_DASHBOARDS[targetRole]);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
      >
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
        />
        <div className="hidden lg:flex flex-col text-left">
          <span className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</span>
          <span className="text-[10px] text-slate-400 leading-tight">{ROLE_LABELS[role]}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2">
          {/* User Info */}
          <div className="px-4 py-3">
            <p className="text-xs font-bold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            <div className="mt-2">
              <Badge variant="brand" size="sm">{ROLE_LABELS[role]}</Badge>
            </div>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="py-2 px-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-brand-600" /> Switch Demo Persona
            </p>
            {Object.keys(ROLES).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  role === r ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{ROLE_LABELS[r]}</span>
                {role === r && <Check className="w-3.5 h-3.5 text-brand-600" />}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="pt-1 px-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
