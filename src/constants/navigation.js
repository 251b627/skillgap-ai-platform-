import { ROLES } from './roles';

/**
 * Sidebar navigation definitions filtered by role.
 */
export const NAV_ITEMS = [
  {
    title: 'Dashboards',
    items: [
      { name: 'Admin Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard', roles: [ROLES.ADMIN] },
      { name: 'Institution Dashboard', path: '/institution/dashboard', icon: 'Building2', roles: [ROLES.INSTITUTION_ADMIN] },
      { name: 'Faculty Dashboard', path: '/faculty/dashboard', icon: 'GraduationCap', roles: [ROLES.FACULTY] },
      { name: 'Student Dashboard', path: '/student/dashboard', icon: 'UserCheck', roles: [ROLES.STUDENT] },
      { name: 'Recruiter Dashboard', path: '/recruiter/dashboard', icon: 'Briefcase', roles: [ROLES.RECRUITER] },
    ]
  },
  {
    title: 'Academia',
    roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.FACULTY],
    items: [
      { name: 'Institutions', path: '/academia/institutions', icon: 'Landmark', roles: [ROLES.ADMIN] },
      { name: 'Departments', path: '/academia/departments', icon: 'Network', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN] },
      { name: 'Students', path: '/academia/students', icon: 'Users', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.FACULTY] },
      { name: 'Faculty Members', path: '/academia/faculty', icon: 'Award', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN] },
      { name: 'Student Skills', path: '/academia/student-skills', icon: 'Sparkles', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.FACULTY] },
      { name: 'Faculty Skills', path: '/academia/faculty-skills', icon: 'CheckCircle2', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.FACULTY] },
    ]
  },
  {
    title: 'Industry & Jobs',
    items: [
      { name: 'Companies', path: '/industry/companies', icon: 'Building', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.RECRUITER] },
      { name: 'Recruiters', path: '/industry/recruiters', icon: 'UserSquare2', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN] },
      { name: 'Opportunities', path: '/industry/opportunities', icon: 'Compass', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.FACULTY, ROLES.STUDENT, ROLES.RECRUITER] },
      { name: 'Opportunity Skills', path: '/industry/opportunity-skills', icon: 'ListChecks', roles: [ROLES.ADMIN, ROLES.RECRUITER] },
    ]
  },
  {
    title: 'Skills & Taxonomy',
    items: [
      { name: 'Skill Categories', path: '/skills/categories', icon: 'Boxes', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.FACULTY] },
      { name: 'Skills Library', path: '/skills/list', icon: 'Cpu', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.FACULTY, ROLES.STUDENT, ROLES.RECRUITER] },
    ]
  },
  {
    title: 'Applications & Careers',
    items: [
      { name: 'Applications Pool', path: '/applications', icon: 'FileText', roles: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.FACULTY, ROLES.INSTITUTION_ADMIN] },
      { name: 'My Applications', path: '/applications/my', icon: 'Send', roles: [ROLES.STUDENT] },
      { name: 'Resumes & Profiles', path: '/resumes', icon: 'FileCode2', roles: [ROLES.STUDENT, ROLES.ADMIN, ROLES.RECRUITER] },
      { name: 'Internships / Placements', path: '/internships', icon: 'Trophy', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.FACULTY, ROLES.STUDENT, ROLES.RECRUITER] },
    ]
  },
  {
    title: 'AI & Intelligence',
    items: [
      { name: 'Skill Assessments', path: '/ai/skill-assessments', icon: 'Target', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.FACULTY, ROLES.STUDENT, ROLES.RECRUITER] },
      { name: 'Skill Gaps', path: '/ai/skill-gaps', icon: 'AlertTriangle', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.FACULTY, ROLES.STUDENT, ROLES.RECRUITER] },
      { name: 'AI Recommendations', path: '/ai/recommendations', icon: 'Bot', roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT] },
    ]
  },
  {
    title: 'Development & Partnerships',
    items: [
      { name: 'Training Programs', path: '/training/programs', icon: 'BookOpenCheck', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.FACULTY, ROLES.STUDENT] },
      { name: 'Training Enrollments', path: '/training/enrollments', icon: 'Layers', roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT] },
      { name: 'Collaborations', path: '/collaborations', icon: 'Handshake', roles: [ROLES.ADMIN, ROLES.INSTITUTION_ADMIN, ROLES.RECRUITER] },
    ]
  }
];
