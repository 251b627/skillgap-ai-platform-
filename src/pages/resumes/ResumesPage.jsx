import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle, Star } from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const ResumesPage = () => {
  const { user } = useAuth();
  const studentId = user?.student_id || 'stud-1';
  const [resumes, setResumes] = useState([]);
  const { success } = useToast();

  const loadResumes = async () => {
    const list = await resumeService.getResumesByStudent(studentId);
    setResumes(list);
  };

  useEffect(() => {
    loadResumes();
  }, [studentId]);

  const handleSetActive = async (id) => {
    await resumeService.setActiveResume(studentId, id);
    success('Active default resume updated');
    loadResumes();
  };

  const handleUploadNew = async () => {
    await resumeService.uploadResume({
      student_id: studentId,
      file_name: `Resume_Portfolio_v${resumes.length + 1}.pdf`,
      file_size_kb: 460,
      summary: 'Parsed candidate portfolio with verified achievements in React, PyTorch, and Docker.',
      parsed_skills: ['React.js', 'Python', 'Machine Learning', 'Docker & Kubernetes'],
    });
    success('Resume uploaded & parsed successfully');
    loadResumes();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume & Portfolio Management"
        subtitle="Upload and manage verified versions of your professional CV"
        action={
          <Button variant="primary" size="sm" onClick={handleUploadNew} icon={UploadCloud}>
            Upload Resume
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resumes.map((r) => (
          <Card key={r.resume_id} className={`p-5 space-y-4 ${r.is_active ? 'border-brand-500 ring-1 ring-brand-500/20' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{r.file_name}</h4>
                  <p className="text-xs text-slate-400">{r.file_size_kb} KB • Uploaded {r.uploaded_at?.split('T')[0]}</p>
                </div>
              </div>
              {r.is_active && <Badge variant="brand" size="sm">Active Default</Badge>}
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">{r.summary}</p>

            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">AI Parsed Skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {r.parsed_skills?.map((sk, idx) => (
                  <Badge key={idx} variant="slate" size="sm">{sk}</Badge>
                ))}
              </div>
            </div>

            {!r.is_active && (
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <Button variant="outline" size="xs" onClick={() => handleSetActive(r.resume_id)} icon={CheckCircle}>
                  Set as Active Resume
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
