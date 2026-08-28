import React, { useState, useEffect } from 'react';
import { Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { studentService } from '../../services/studentService';
import { opportunityService } from '../../services/opportunityService';
import { skillGapService } from '../../services/skillGapService';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { FormSelect } from '../../components/forms/FormSelect';
import { ProgressBar } from '../../components/common/ProgressBar';
import { SkillMeter } from '../../components/skills/SkillMeter';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

export const SkillAssessmentsPage = () => {
  const [students, setStudents] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedOppId, setSelectedOppId] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([studentService.getStudents(), opportunityService.getOpportunities()]).then(([sData, oData]) => {
      setStudents(sData);
      setOpportunities(oData);
      if (sData.length > 0) setSelectedStudentId(sData[0].student_id);
      if (oData.length > 0) setSelectedOppId(oData[0].opportunity_id);
    });
  }, []);

  useEffect(() => {
    if (selectedStudentId && selectedOppId) {
      setLoading(true);
      skillGapService.assessStudentForOpportunity(selectedStudentId, selectedOppId).then((res) => {
        setAssessment(res);
        setLoading(false);
      });
    }
  }, [selectedStudentId, selectedOppId]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Skill Assessment Matrix"
        subtitle="Benchmark student technical levels directly against opportunity job criteria"
      />

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <FormSelect
          label="Select Student"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          options={students.map((s) => ({ value: s.student_id, label: `${s.name} (${s.enrollment_no})` }))}
        />
        <FormSelect
          label="Select Target Opportunity"
          value={selectedOppId}
          onChange={(e) => setSelectedOppId(e.target.value)}
          options={opportunities.map((o) => ({ value: o.opportunity_id, label: `${o.title} (${o.company_name})` }))}
        />
      </div>

      {loading || !assessment ? (
        <TableSkeleton rows={3} cols={2} />
      ) : (
        <div className="space-y-6">
          {/* Overall Match Summary */}
          <div className="p-6 bg-gradient-to-r from-brand-600 to-indigo-700 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-200 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-300" /> Overall Candidate Alignment
              </div>
              <h3 className="text-2xl font-bold">Readiness Match: {assessment.matchPercentage}%</h3>
              <p className="text-xs text-brand-100 mt-1">
                {assessment.hasCriticalGaps
                  ? 'Candidate has missing mandatory requirements. Upskilling recommended.'
                  : 'Candidate satisfies key mandatory skill requirements!'}
              </p>
            </div>
            <div className="w-full sm:w-64 bg-white/10 p-4 rounded-xl border border-white/20">
              <ProgressBar value={assessment.matchPercentage} variant="emerald" size="lg" />
            </div>
          </div>

          {/* Individual Skills Gap Meter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessment.gaps.map((item) => (
              <SkillMeter
                key={item.skill_id}
                skillName={item.skill_name}
                currentLevel={item.studentLevel}
                requiredLevel={item.requiredLevel}
                priority={item.priority}
                requirementType={item.requirement_type}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
