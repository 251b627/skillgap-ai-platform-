import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ROLES } from '../constants/roles';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage';

// Dashboards
import { AdminDashboard } from '../pages/dashboards/AdminDashboard';
import { StudentDashboard } from '../pages/dashboards/StudentDashboard';
import { RecruiterDashboard } from '../pages/dashboards/RecruiterDashboard';
import { FacultyDashboard } from '../pages/dashboards/FacultyDashboard';
import { InstitutionDashboard } from '../pages/dashboards/InstitutionDashboard';

// Academia
import { InstitutionsPage } from '../pages/academia/InstitutionsPage';
import { DepartmentsPage } from '../pages/academia/DepartmentsPage';
import { StudentsPage } from '../pages/academia/StudentsPage';
import { StudentProfilePage } from '../pages/academia/StudentProfilePage';
import { FacultyPage } from '../pages/academia/FacultyPage';
import { StudentSkillsPage } from '../pages/academia/StudentSkillsPage';
import { FacultySkillsPage } from '../pages/academia/FacultySkillsPage';

// Industry
import { CompaniesPage } from '../pages/industry/CompaniesPage';
import { RecruitersPage } from '../pages/industry/RecruitersPage';
import { OpportunitiesPage } from '../pages/industry/OpportunitiesPage';
import { OpportunityDetailsPage } from '../pages/industry/OpportunityDetailsPage';
import { OpportunitySkillsPage } from '../pages/industry/OpportunitySkillsPage';

// Skills
import { SkillCategoriesPage } from '../pages/skills/SkillCategoriesPage';
import { SkillsListPage } from '../pages/skills/SkillsListPage';

// Applications & Resumes
import { ApplicationsPage } from '../pages/applications/ApplicationsPage';
import { MyApplicationsPage } from '../pages/applications/MyApplicationsPage';
import { ApplicationDetailsPage } from '../pages/applications/ApplicationDetailsPage';
import { ResumesPage } from '../pages/resumes/ResumesPage';

// AI & Intelligence
import { SkillAssessmentsPage } from '../pages/ai/SkillAssessmentsPage';
import { SkillGapsPage } from '../pages/ai/SkillGapsPage';
import { AIRecommendationsPage } from '../pages/ai/AIRecommendationsPage';

// Training, Collaborations, Internships
import { TrainingProgramsPage } from '../pages/training/TrainingProgramsPage';
import { TrainingEnrollmentsPage } from '../pages/training/TrainingEnrollmentsPage';
import { CollaborationsPage } from '../pages/collaborations/CollaborationsPage';
import { InternshipsPage } from '../pages/internships/InternshipsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Main Authenticated Platform */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />

        {/* Dashboards */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.ADMIN]}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.RECRUITER, ROLES.ADMIN]}><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="/faculty/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.FACULTY, ROLES.ADMIN]}><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/institution/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.INSTITUTION_ADMIN, ROLES.ADMIN]}><InstitutionDashboard /></ProtectedRoute>} />

        {/* Academia */}
        <Route path="/academia" element={<Navigate to="/academia/institutions" replace />} />
        <Route path="/academia/institutions" element={<InstitutionsPage />} />
        <Route path="/academia/departments" element={<DepartmentsPage />} />
        <Route path="/academia/students" element={<StudentsPage />} />
        <Route path="/academia/students/:studentId" element={<StudentProfilePage />} />
        <Route path="/academia/faculty" element={<FacultyPage />} />
        <Route path="/academia/student-skills" element={<StudentSkillsPage />} />
        <Route path="/academia/faculty-skills" element={<FacultySkillsPage />} />

        {/* Industry */}
        <Route path="/industry" element={<Navigate to="/industry/opportunities" replace />} />
        <Route path="/industry/companies" element={<CompaniesPage />} />
        <Route path="/industry/recruiters" element={<RecruitersPage />} />
        <Route path="/industry/opportunities" element={<OpportunitiesPage />} />
        <Route path="/industry/opportunities/:opportunityId" element={<OpportunityDetailsPage />} />
        <Route path="/industry/opportunity-skills" element={<OpportunitySkillsPage />} />

        {/* Skills */}
        <Route path="/skills" element={<Navigate to="/skills/list" replace />} />
        <Route path="/skills/categories" element={<SkillCategoriesPage />} />
        <Route path="/skills/list" element={<SkillsListPage />} />
        <Route path="/skills/student-skills" element={<StudentSkillsPage />} />
        <Route path="/skills/faculty-skills" element={<FacultySkillsPage />} />

        {/* Applications & Resumes */}
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/applications/my" element={<MyApplicationsPage />} />
        <Route path="/applications/:applicationId" element={<ApplicationDetailsPage />} />
        <Route path="/resumes" element={<ResumesPage />} />
        <Route path="/resumes/:studentId" element={<ResumesPage />} />

        {/* AI & Gap Intelligence */}
        <Route path="/ai" element={<Navigate to="/ai/recommendations" replace />} />
        <Route path="/ai/skill-assessments" element={<SkillAssessmentsPage />} />
        <Route path="/ai/skill-gaps" element={<SkillGapsPage />} />
        <Route path="/ai/recommendations" element={<AIRecommendationsPage />} />

        {/* Training & Partnerships */}
        <Route path="/training" element={<Navigate to="/training/programs" replace />} />
        <Route path="/training/programs" element={<TrainingProgramsPage />} />
        <Route path="/training/enrollments" element={<TrainingEnrollmentsPage />} />
        <Route path="/collaborations" element={<CollaborationsPage />} />
        <Route path="/internships" element={<InternshipsPage />} />
        <Route path="/internships/:internshipId" element={<InternshipsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
