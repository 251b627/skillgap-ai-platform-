import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, Award, Play } from 'lucide-react';
import { trainingService } from '../../services/trainingService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

export const TrainingEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();
  const { success } = useToast();

  const loadEnrollments = async () => {
    setLoading(true);
    const data = await trainingService.getEnrollments();
    if (role === 'STUDENT') {
      setEnrollments(data.filter((e) => e.student_id === (user?.student_id || 'stud-1')));
    } else {
      setEnrollments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEnrollments();
  }, [user, role]);

  const handleSimulateProgress = async (id, current) => {
    const nextPct = Math.min(100, current + 35);
    await trainingService.updateEnrollmentProgress(id, nextPct, 95);
    success(nextPct >= 100 ? 'Course completed! Target technical skill proficiencies have been dynamically updated!' : 'Progress updated');
    loadEnrollments();
  };

  if (loading) return <TableSkeleton rows={3} cols={3} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Enrollments & Progress"
        subtitle="Track active student coursework completion and automated competency upskilling"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enrollments.map((enr) => (
          <Card key={enr.enrollment_id} className="p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Student: {enr.student_name}</span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">{enr.training_name}</h4>
                <p className="text-xs text-slate-500">{enr.provider} • {enr.duration_hours} hours total</p>
              </div>
              <StatusBadge status={enr.completion_status} />
            </div>

            <ProgressBar value={enr.completion_percentage} variant="brand" />

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Enrolled: {enr.enrolled_at?.split('T')[0]}
              </span>
              {enr.completion_percentage < 100 ? (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleSimulateProgress(enr.enrollment_id, enr.completion_percentage)}
                  icon={Play}
                >
                  Simulate Study Session (+35%)
                </Button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Certified (Score: {enr.score}%)
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
