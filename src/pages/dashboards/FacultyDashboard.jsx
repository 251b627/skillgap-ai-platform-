import React, { useState, useEffect } from 'react';
import { Users, Sparkles, AlertTriangle, BookOpen, Trophy } from 'lucide-react';
import { studentService } from '../../services/studentService';
import { skillGapService } from '../../services/skillGapService';
import { trainingService } from '../../services/trainingService';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { SkillDistributionChart } from '../../components/charts/SkillDistributionChart';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

export const FacultyDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacultyData = async () => {
      setLoading(true);
      const [students, gaps, enrollments] = await Promise.all([
        studentService.getStudents(),
        skillGapService.getAllGapsForActiveApplications(),
        trainingService.getEnrollments(),
      ]);

      const highPriorityGaps = gaps.filter((g) => g.priority.key === 'HIGH');

      const skillFrequencies = gaps.reduce((acc, g) => {
        acc[g.skill_name] = (acc[g.skill_name] || 0) + 1;
        return acc;
      }, {});
      const gapChartData = Object.keys(skillFrequencies).map((k) => ({
        name: k.split(' ')[0],
        count: skillFrequencies[k],
      }));

      setMetrics({
        totalStudents: students.length,
        totalGaps: gaps.length,
        criticalGaps: highPriorityGaps.length,
        activeEnrollments: enrollments.length,
        gapChartData,
      });
      setLoading(false);
    };

    fetchFacultyData();
  }, []);

  if (loading || !metrics) return <TableSkeleton rows={4} cols={3} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Academic & Skill Dashboard"
        subtitle="Department student competency tracking, detected curriculum gaps, and training progress"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-medium">Department Students</p>
          <h4 className="text-2xl font-bold text-slate-900 mt-1">{metrics.totalStudents}</h4>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-medium">Identified Skill Gaps</p>
          <h4 className="text-2xl font-bold text-amber-600 mt-1">{metrics.totalGaps}</h4>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-medium">High Priority Gaps</p>
          <h4 className="text-2xl font-bold text-rose-600 mt-1">{metrics.criticalGaps}</h4>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-medium">Active Training Enrollments</p>
          <h4 className="text-2xl font-bold text-brand-600 mt-1">{metrics.activeEnrollments}</h4>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Most Prevalent Industry Skill Gaps"
          subtitle="Top missing technical competencies identified across current internship postings"
        />
        <CardBody>
          <SkillDistributionChart data={metrics.gapChartData} />
        </CardBody>
      </Card>
    </div>
  );
};
