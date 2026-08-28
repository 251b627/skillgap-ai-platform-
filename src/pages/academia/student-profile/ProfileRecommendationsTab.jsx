import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { recommendationService } from '../../../services/recommendationService';
import { trainingService } from '../../../services/trainingService';
import { useToast } from '../../../hooks/useToast';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';

export const ProfileRecommendationsTab = ({ studentId }) => {
  const [recs, setRecs] = useState([]);
  const { success, error: toastError } = useToast();

  const loadRecs = async () => {
    const list = await recommendationService.getRecommendationsForStudent(studentId);
    setRecs(list);
  };

  useEffect(() => {
    loadRecs();
  }, [studentId]);

  const handleEnroll = async (rec) => {
    try {
      await trainingService.enrollStudent(studentId, rec.training_id);
      success(`Enrolled in ${rec.recommended_training}!`);
      loadRecs();
    } catch (err) {
      toastError(err.message);
    }
  };

  if (recs.length === 0) {
    return <p className="text-xs text-slate-400 text-center py-8">No current skill gaps detected for this student.</p>;
  }

  return (
    <div className="space-y-4">
      {recs.map((rec) => (
        <Card key={rec.recommendation_id} className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-semibold text-slate-900">{rec.recommended_training}</h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{rec.provider} • {rec.duration_hours} hrs</p>
            </div>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
              {rec.match_score}% Gap Match
            </span>
          </div>

          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">{rec.reason}</p>

          <div className="flex justify-end pt-1">
            {rec.status === 'Enrolled' ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Already Enrolled
              </span>
            ) : (
              <Button variant="primary" size="xs" onClick={() => handleEnroll(rec)} icon={ArrowRight}>
                Enroll in Program
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
