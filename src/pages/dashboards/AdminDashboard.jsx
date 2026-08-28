import React, { useState, useEffect } from 'react';
import { Landmark, Users, Building, Briefcase, FileText, Sparkles, BookOpenCheck, Handshake, Trophy, Award } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { ApplicationStatusChart } from '../../components/charts/ApplicationStatusChart';
import { DepartmentDistributionChart } from '../../components/charts/DepartmentDistributionChart';
import { SkillDistributionChart } from '../../components/charts/SkillDistributionChart';
import { PlacementTrendChart } from '../../components/charts/PlacementTrendChart';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      const [insts, depts, studs, fac, comps, recs, opps, apps, trains, collabs, interns, skills, sSkills] = await Promise.all([
        storageService.query('institutions'),
        storageService.query('departments'),
        storageService.query('students'),
        storageService.query('faculty'),
        storageService.query('companies'),
        storageService.query('recruiters'),
        storageService.query('opportunities'),
        storageService.query('applications'),
        storageService.query('training_programs'),
        storageService.query('collaborations'),
        storageService.query('internships'),
        storageService.query('skills'),
        storageService.query('student_skills'),
      ]);

      // Chart aggregations
      const statusCounts = apps.reduce((acc, a) => {
        acc[a.current_status] = (acc[a.current_status] || 0) + 1;
        return acc;
      }, {});
      const appStatusData = Object.keys(statusCounts).map((k) => ({ name: k, value: statusCounts[k] }));

      const deptData = depts.map((d) => ({
        name: d.department_code,
        students: studs.filter((s) => s.department_id === d.department_id).length,
      }));

      const topSkillsData = skills.slice(0, 6).map((sk) => ({
        name: sk.skill_name.split(' ')[0],
        count: sSkills.filter((ss) => ss.skill_id === sk.skill_id).length + 2,
      }));

      const placementTrendData = [
        { month: 'May', count: 12 },
        { month: 'Jun', count: 18 },
        { month: 'Jul', count: 26 },
        { month: 'Aug', count: 34 },
        { month: 'Sep', count: interns.length + 42 },
      ];

      setStats({
        instCount: insts.length,
        deptCount: depts.length,
        studCount: studs.length,
        facCount: fac.length,
        compCount: comps.length,
        recCount: recs.length,
        oppCount: opps.length,
        appCount: apps.length,
        trainCount: trains.length,
        collabCount: collabs.length,
        internCount: interns.length,
        appStatusData,
        deptData,
        topSkillsData,
        placementTrendData,
      });
      setLoading(false);
    };

    fetchMetrics();
  }, []);

  if (loading || !stats) {
    return <TableSkeleton rows={4} cols={4} />;
  }

  const statCards = [
    { label: 'Total Institutions', value: stats.instCount, icon: Landmark, color: 'text-brand-600 bg-brand-50' },
    { label: 'Enrolled Students', value: stats.studCount, icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Academic Faculty', value: stats.facCount, icon: Award, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Partner Companies', value: stats.compCount, icon: Building, color: 'text-purple-600 bg-purple-50' },
    { label: 'Active Opportunities', value: stats.oppCount, icon: Briefcase, color: 'text-amber-600 bg-amber-50' },
    { label: 'Applications Pool', value: stats.appCount, icon: FileText, color: 'text-sky-600 bg-sky-50' },
    { label: 'Placements Confirmed', value: stats.internCount, icon: Trophy, color: 'text-teal-600 bg-teal-50' },
    { label: 'Active Collaborations', value: stats.collabCount, icon: Handshake, color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Administration Dashboard"
        subtitle="Platform-wide institutional metrics, talent pipelines, and cross-organization analytics"
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className="p-4 flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
                <h4 className="text-xl font-bold text-slate-900 mt-0.5">{kpi.value}</h4>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Applications by Current Stage" subtitle="Funnel breakdown across candidate submissions" />
          <CardBody>
            <ApplicationStatusChart data={stats.appStatusData} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Students by Academic Department" subtitle="Departmental enrollment distribution" />
          <CardBody>
            <DepartmentDistributionChart data={stats.deptData} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Verified Skills Distribution" subtitle="Top competencies mastered by registered students" />
          <CardBody>
            <SkillDistributionChart data={stats.topSkillsData} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Placement & Internship Trajectory" subtitle="Cumulative corporate hires over the current academic year" />
          <CardBody>
            <PlacementTrendChart data={stats.placementTrendData} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
