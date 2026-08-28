import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, Shield, UserCheck, ArrowRight } from 'lucide-react';
import { loginSchema } from '../../validations/authValidation';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { ROLES, ROLE_LABELS, ROLE_DASHBOARDS } from '../../constants/roles';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { Button } from '../../components/common/Button';

export const LoginPage = () => {
  const [activeTabRole, setActiveTabRole] = useState(ROLES.STUDENT);
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'rahul.sharma@apextech.edu',
      password: 'password123',
      role: ROLES.STUDENT,
    },
  });

  const handleRoleQuickSelect = (r) => {
    setActiveTabRole(r);
    setValue('role', r);
    const demoEmails = {
      [ROLES.ADMIN]: 'admin@platform.com',
      [ROLES.INSTITUTION_ADMIN]: 'dean@apextech.edu',
      [ROLES.FACULTY]: 'miller@apextech.edu',
      [ROLES.STUDENT]: 'rahul.sharma@apextech.edu',
      [ROLES.RECRUITER]: 'sarah.j@novasoft.io',
    };
    setValue('email', demoEmails[r] || 'user@example.com');
  };

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password, data.role);
      success(`Welcome back, ${user.name}!`);
      const targetDashboard = ROLE_DASHBOARDS[user.role] || '/student/dashboard';
      navigate(location.state?.from?.pathname || targetDashboard, { replace: true });
    } catch (err) {
      toastError(err.message || 'Invalid credentials');
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900">Sign in to your account</h3>
        <p className="text-xs text-slate-500 mt-1">Select your platform role to sign in or test drive demo personas</p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 p-1 bg-slate-100 rounded-xl mb-6">
        {Object.keys(ROLES).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => handleRoleQuickSelect(r)}
            className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-all truncate ${
              activeTabRole === r
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {r === ROLES.INSTITUTION_ADMIN ? 'Inst Admin' : ROLE_LABELS[r].split(' ')[0]}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormSelect
          label="Account Role"
          required
          options={Object.keys(ROLES).map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
          error={errors.role?.message}
          {...register('role')}
        />

        <FormInput
          label="Email Address"
          type="email"
          required
          icon={Mail}
          placeholder="name@institution.edu"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormInput
          label="Password"
          type="password"
          required
          icon={Lock}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="pt-2">
          <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting} icon={ArrowRight}>
            Sign In as {ROLE_LABELS[activeTabRole]}
          </Button>
        </div>
      </form>
    </div>
  );
};
