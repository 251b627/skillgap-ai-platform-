import { ROLES } from '../constants/roles';

export const initialUsers = [
  {
    user_id: 'usr-admin',
    name: 'Dr. Arthur Vance',
    email: 'admin@platform.com',
    role: ROLES.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Platform System Admin',
  },
  {
    user_id: 'usr-inst-admin',
    name: 'Elena Rostova',
    email: 'dean@apextech.edu',
    role: ROLES.INSTITUTION_ADMIN,
    institution_id: 'inst-1',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'Dean of Academic Affairs (Apex Tech)',
  },
  {
    user_id: 'usr-faculty',
    name: 'Prof. David Miller',
    email: 'miller@apextech.edu',
    role: ROLES.FACULTY,
    faculty_id: 'fac-1',
    department_id: 'dept-1',
    institution_id: 'inst-1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Associate Professor & Placement Coordinator',
  },
  {
    user_id: 'usr-student',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@apextech.edu',
    role: ROLES.STUDENT,
    student_id: 'stud-1',
    department_id: 'dept-1',
    institution_id: 'inst-1',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    title: 'Final Year CSE Student',
  },
  {
    user_id: 'usr-recruiter',
    name: 'Sarah Jenkins',
    email: 'sarah.j@novasoft.io',
    role: ROLES.RECRUITER,
    recruiter_id: 'rec-1',
    company_id: 'comp-1',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Senior University Talent Acquisition Lead',
  }
];
