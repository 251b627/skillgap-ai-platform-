import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Sparkles, FileText, Send, BookOpen, Bot, Trophy } from 'lucide-react';
import { studentService } from '../../services/studentService';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { ProfileOverviewTab } from './student-profile/ProfileOverviewTab';
import { ProfileSkillsTab } from './student-profile/ProfileSkillsTab';
import { ProfileResumeTab } from './student-profile/ProfileResumeTab';
import { ProfileApplicationsTab } from './student-profile/ProfileApplicationsTab';
import { ProfileTrainingTab } from './student-profile/ProfileTrainingTab';
import { ProfileRecommendationsTab } from './student-profile/ProfileRecommendationsTab';
import { ProfileInternshipsTab } from './student-profile/ProfileInternshipsTab';

const TABS = [
  { key: 'overview', label: 'Overview', icon: User },
  { key: 'skills', label: 'Skills', icon: Sparkles },
  { key: 'resume', label: 'Resume', icon: FileText },
  { key: 'applications', label: 'Applications', icon: Send },
  { key: 'training', label: 'Training', icon: BookOpen },
  { key: 'recommendations', label: 'Recommendations', icon: Bot },
  { key: 'internships', label: 'Internships', icon: Trophy },
];

export const StudentProfilePage = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getStudentById(studentId).then((res) => {
      setStudent(res);
      setLoading(false);
    });
  }, [studentId]);

  if (loading || !student) return <TableSkeleton rows={5} cols={3} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/academia/students">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>Back to Roster</Button>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
            {student.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
            <p className="text-xs text-slate-500">{student.enrollment_no} • {student.department_name}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white border-t border-x border-slate-200 text-brand-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'overview' && <ProfileOverviewTab student={student} />}
        {activeTab === 'skills' && <ProfileSkillsTab studentId={studentId} />}
        {activeTab === 'resume' && <ProfileResumeTab studentId={studentId} />}
        {activeTab === 'applications' && <ProfileApplicationsTab studentId={studentId} />}
        {activeTab === 'training' && <ProfileTrainingTab studentId={studentId} />}
        {activeTab === 'recommendations' && <ProfileRecommendationsTab studentId={studentId} />}
        {activeTab === 'internships' && <ProfileInternshipsTab studentId={studentId} />}
      </div>
    </div>
  );
};
