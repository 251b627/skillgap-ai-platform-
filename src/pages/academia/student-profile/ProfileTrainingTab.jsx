import React, { useState, useEffect } from 'react';
import { trainingService } from '../../../services/trainingService';
import { Card } from '../../../components/common/Card';
import { ProgressBar } from '../../../components/common/ProgressBar';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
import { useToast } from '../../../hooks/useToast';

export const ProfileTrainingTab = ({ studentId }) => {
  const [enrollments, setEnrollments] = useState([]);
  const { success } = useToast();

  const loadEnrollments = async () => {
    const list = await trainingService.getEnrollments();
    setEnrollments(list.filter((e) => e.student_id === studentId));
  };

  useEffect(() => {
    loadEnrollments();
  }, [studentId]);

  const handleSimulateProgress = async (id, current) => {
    const nextPct = Math.min(100, current + 35);
    await trainingService.updateEnrollmentProgress(id, nextPct, 92);
    success(nextPct >= 100 ? 'Course completed! Skills updated.' : 'Progress recorded');
    loadEnrollments();
  };

  if (enrollments.length === 0) {
    return <p className="text-xs text-slate-400 text-center py-8">Not currently enrolled in any training programs.</p>;
  }

  return (
    <div className="space-y-4">
      {enrollments.map((enr) => (
        <Card key={enr.enrollment_id} className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">{enr.training_name}</h4>
              <p className="text-xs text-slate-500">{enr.provider} • {enr.duration_hours} Hours</p>
            </div>
            <StatusBadge status={enr.completion_status} />
          </div>

          <ProgressBar value={enr.completion_percentage} variant="brand" />

          {enr.completion_percentage < 100 && (
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="xs"
                onClick={() => handleSimulateProgress(enr.enrollment_id, enr.completion_percentage)}
              >
                Simulate Study Progress (+35%)
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
