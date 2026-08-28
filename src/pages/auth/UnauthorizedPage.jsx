import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_DASHBOARDS } from '../../constants/roles';
import { Button } from '../../components/common/Button';

export const UnauthorizedPage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  const handleReturn = () => {
    const defaultRoute = role ? ROLE_DASHBOARDS[role] : '/login';
    navigate(defaultRoute);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-inner">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Access Restricted</h2>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">
        Your current role does not have authorization to view this module. Use the role switcher in the top bar to preview other persona views.
      </p>
      <Button variant="primary" onClick={handleReturn} icon={ArrowLeft}>
        Return to My Dashboard
      </Button>
    </div>
  );
};
