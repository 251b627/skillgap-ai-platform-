import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import { ROLES } from '../constants/roles';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    const current = authService.getCurrentUser();
    if (current) {
      setUser(current);
    } else {
      // Default to demo admin session on fresh visit if none exists
      authService.switchRoleDemo(ROLES.ADMIN).then((demoUser) => {
        setUser(demoUser);
      }).catch(() => {});
    }
    setLoading(false);

    // Global unauthorized listener
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password, role) => {
    const res = await authService.login(email, password, role);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const switchRole = async (targetRole) => {
    const updatedUser = await authService.switchRoleDemo(targetRole);
    setUser(updatedUser);
    return updatedUser;
  };

  const hasRole = (allowedRoles) => {
    if (!user) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        switchRole,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
