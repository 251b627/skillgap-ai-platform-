import { storageService } from './storageService';
import { initialUsers } from '../data/initialUsers';

/**
 * Authentication service handling credentials, mock sessions, role assignment, and tokens.
 */
export const authService = {
  async login(email, password, role) {
    const users = await storageService.query('users');
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Fallback matching by role for demo convenience
      user = users.find((u) => u.role === role) || initialUsers.find((u) => u.role === role);
    }

    if (!user) {
      throw new Error('Invalid email or selected role credentials');
    }

    // Set mock JWT session
    const mockToken = `jwt_demo_${user.user_id}_${Date.now()}`;
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('auth_user', JSON.stringify(user));
    return { token: mockToken, user };
  },

  async logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    return true;
  },

  getCurrentUser() {
    try {
      const u = localStorage.getItem('auth_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  async refreshSession() {
    const user = this.getCurrentUser();
    if (!user) throw new Error('No active session');
    return user;
  },

  async switchRoleDemo(role) {
    const users = await storageService.query('users');
    const targetUser = users.find((u) => u.role === role) || initialUsers.find((u) => u.role === role);
    if (!targetUser) throw new Error('Demo user not found for role ' + role);
    
    const mockToken = `jwt_demo_${targetUser.user_id}_${Date.now()}`;
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('auth_user', JSON.stringify(targetUser));
    return targetUser;
  }
};
