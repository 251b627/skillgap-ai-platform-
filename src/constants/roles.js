/**
 * Role definitions supported by the platform.
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  INSTITUTION_ADMIN: 'INSTITUTION_ADMIN',
  FACULTY: 'FACULTY',
  STUDENT: 'STUDENT',
  RECRUITER: 'RECRUITER',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Platform Administrator',
  [ROLES.INSTITUTION_ADMIN]: 'Institution Administrator',
  [ROLES.FACULTY]: 'Academic Faculty',
  [ROLES.STUDENT]: 'Student',
  [ROLES.RECRUITER]: 'Industry Recruiter',
};

export const ROLE_DASHBOARDS = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.INSTITUTION_ADMIN]: '/institution/dashboard',
  [ROLES.FACULTY]: '/faculty/dashboard',
  [ROLES.STUDENT]: '/student/dashboard',
  [ROLES.RECRUITER]: '/recruiter/dashboard',
};
