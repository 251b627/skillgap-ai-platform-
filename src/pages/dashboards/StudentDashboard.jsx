import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, Compass, BookOpen, Send, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { studentService } from '../../services/studentService';
import { opportunityService } from '../../services/opportunityService';
import { applicationService } from '../../services/applicationService';
import { recommendationService } from '../../services/recommendationService';
import { trainingService } from '../../services/trainingService';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Button } from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const studentId = user?.student_id || 'stud-1';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      const [skills, opps, apps, recs, enrollments] = await Promise.all([
        studentService.getStudentSkills(studentId),
        opportunityService.getOpportunities(),
        applicationService.getApplications(),
        recommendationService.getRecommendationsForStudent(studentId),
        trainingService.getEnrollments(),
      ]);

      const myApps = apps.filter((a) => a.student_id === studentId);
      const myEnrollments = enrollments.filter((e) => e.student_id === studentId);

      setData({
        skills,
        openOpportunities: opps.slice(0, 3),
        myApps,
        recommendations: recs.slice(0, 2),
        myEnrollments,
        readinessScore: 78,
      });
      setLoading(false);
    };

    fetchDashboard();
  }, [studentId]);

  if (loading || !data) return <TableSkeleton rows={4} cols={3} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name || 'Student'}`}
        subtitle="Track your academic readiness score, active job applications, and recommended training programs"
        action={
          <Link to="/industry/opportunities">
            <Button variant="primary" size="sm" icon={Compass}>Explore Opportunities</Button>
          </Link>
        }
      />

      {/* AI Readiness Banner */}
      <div className="p-6 bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-800 rounded-2xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Skill Assessment Score
          </div>
          <h3 className="text-xl font-bold">Overall Industry Readiness: {data.readinessScore}%</h3>
          <p className="text-xs text-brand-100 leading-relaxed">
            Your profile meets 78% of verified industry requirements for full-stack and cloud internships. Complete your enrolled Python ML training to boost your score to 94%.
          </p>
        </div>
        <div className="w-full md:w-64 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20">
          <ProgressBar value={data.readinessScore} variant="emerald" size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Applications */}
        <Card>
          <CardHeader
            title="My Applications"
            subtitle="Track live interview and hiring progress"
            action={<Link to="/applications/my" className="text-xs font-semibold text-brand-600 hover:underline">View All</Link>}
          />
          <CardBody className="divide-y divide-slate-100 p-0">
            {data.myApps.length === 0 ? (
              <p className="p-5 text-xs text-slate-400 text-center">You have not submitted any applications yet.</p>
            ) : (
              data.myApps.map((app) => (
                <div key={app.application_id} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{app.opportunity_title}</h4>
                    <p className="text-xs text-slate-500">{app.company_name} • Applied {app.applied_at?.split('T')[0]}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.current_status} />
                    <Link to={`/applications/${app.application_id}`}>
                      <Button variant="ghost" size="xs" icon={ArrowRight}>Details</Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* AI Recommendations */}
        <Card>
          <CardHeader
            title="AI Recommended Upskilling"
            subtitle="Targeted courses to bridge your exact job skill gaps"
            action={<Link to="/ai/recommendations" className="text-xs font-semibold text-brand-600 hover:underline">See All</Link>}
          />
          <CardBody className="p-4 space-y-3">
            {data.recommendations.map((rec) => (
              <div key={rec.recommendation_id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{rec.recommended_training}</span>
                  <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                    {rec.match_score}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-600">{rec.reason}</p>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Enrolled Training Programs */}
        <Card>
          <CardHeader
            title="My Active Trainings"
            subtitle="Upskilling modules currently in progress"
            action={<Link to="/training/enrollments" className="text-xs font-semibold text-brand-600 hover:underline">Manage</Link>}
          />
          <CardBody className="p-4 space-y-4">
            {data.myEnrollments.map((enr) => (
              <div key={enr.enrollment_id} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-800">{enr.training_name}</span>
                  <StatusBadge status={enr.completion_status} size="sm" />
                </div>
                <ProgressBar value={enr.completion_percentage} variant="brand" size="sm" />
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Recommended Opportunities */}
        <Card>
          <CardHeader
            title="Top Matched Opportunities"
            subtitle="Job postings aligned with your technical skillset"
          />
          <CardBody className="divide-y divide-slate-100 p-0">
            {data.openOpportunities.map((opp) => (
              <div key={opp.opportunity_id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{opp.title}</h4>
                  <p className="text-xs text-slate-500">{opp.company_name} • {opp.location} • {opp.mode}</p>
                </div>
                <Link to={`/industry/opportunities/${opp.opportunity_id}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
