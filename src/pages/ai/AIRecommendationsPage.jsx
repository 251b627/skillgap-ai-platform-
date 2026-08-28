import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, BookOpen, ArrowRight, Check } from 'lucide-react';
import { recommendationService } from '../../services/recommendationService';
import { studentService } from '../../services/studentService';
import { trainingService } from '../../services/trainingService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { FormSelect } from '../../components/forms/FormSelect';
import { Button } from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

export const AIRecommendationsPage = () => {
  const { user, role } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(user?.student_id || 'stud-1');
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    studentService.getStudents().then((res) => {
      setStudents(res);
      if (!user?.student_id && res.length > 0) {
        setSelectedStudentId(res[0].student_id);
      }
    });
  }, [user]);

  const loadRecs = async (id) => {
    if (!id) return;
    setLoading(true);
    const data = await recommendationService.getRecommendationsForStudent(id);
    setRecs(data);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedStudentId) loadRecs(selectedStudentId);
  }, [selectedStudentId]);

  const handleEnroll = async (rec) => {
    try {
      await trainingService.enrollStudent(selectedStudentId, rec.training_id);
      success(`Successfully enrolled in ${rec.recommended_training}!`);
      loadRecs(selectedStudentId);
    } catch (err) {
      toastError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Training & Upskilling Recommendations"
        subtitle="Automated intelligence matching identified skill deficits with certified training programs"
      />

      {role !== 'STUDENT' && (
        <div className="max-w-md p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <FormSelect
            label="Select Student Profile"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            options={students.map((s) => ({ value: s.student_id, label: `${s.name} (${s.enrollment_no})` }))}
          />
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={3} cols={2} />
      ) : recs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">All Skill Requirements Satisfied!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No critical gaps detected for open positions. The student profile is currently well-aligned with market criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recs.map((rec) => (
            <Card key={rec.recommendation_id} className="p-6 space-y-4 border-brand-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Candidate:</span>
                    <span className="text-xs font-semibold text-slate-800">{rec.student_name}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{rec.recommended_training}</h4>
                  <p className="text-xs text-slate-500">{rec.provider} • {rec.duration_hours} hours total</p>
                </div>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full whitespace-nowrap">
                  {rec.match_score}% Gap Match
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed space-y-1">
                <span className="font-bold text-slate-900 block">AI Reasoning:</span>
                <p>{rec.reason}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">Target Skill: <strong className="text-slate-800">{rec.missing_skill}</strong></span>
                {rec.status === 'Enrolled' ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Enrolled in Schedule
                  </span>
                ) : (
                  <Button variant="primary" size="sm" onClick={() => handleEnroll(rec)} icon={ArrowRight}>
                    1-Click Auto Enroll
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
