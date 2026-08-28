import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, UploadCloud, Trash2 } from 'lucide-react';
import { resumeService } from '../../../services/resumeService';
import { useToast } from '../../../hooks/useToast';
import { Card, CardHeader, CardBody } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';

export const ProfileResumeTab = ({ studentId }) => {
  const [resumes, setResumes] = useState([]);
  const { success, error: toastError } = useToast();

  const loadResumes = async () => {
    const list = await resumeService.getResumesByStudent(studentId);
    setResumes(list);
  };

  useEffect(() => {
    loadResumes();
  }, [studentId]);

  const handleSetActive = async (id) => {
    await resumeService.setActiveResume(studentId, id);
    success('Active resume updated');
    loadResumes();
  };

  const handleUploadNew = async () => {
    await resumeService.uploadResume({
      student_id: studentId,
      file_name: `Resume_v${resumes.length + 1}_2026.pdf`,
      file_size_kb: 480,
      summary: 'Updated profile highlighting newly completed AI training certifications and microservices experience.',
      parsed_skills: ['Python', 'Machine Learning', 'React.js', 'Docker & Kubernetes'],
    });
    success('New resume uploaded and parsed');
    loadResumes();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-slate-900">Resume & Portfolio Documents</h3>
          <p className="text-xs text-slate-500">Manage uploaded CVs used for job and internship applications</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleUploadNew} icon={UploadCloud}>
          Upload New Version
        </Button>
      </div>

      <div className="space-y-4">
        {resumes.map((r) => (
          <Card key={r.resume_id} className={`p-4 ${r.is_active ? 'border-brand-500 ring-1 ring-brand-500/20' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-800">{r.file_name}</h4>
                    {r.is_active && <Badge variant="brand" size="sm">Active Default</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{r.file_size_kb} KB • Uploaded {r.uploaded_at?.split('T')[0]}</p>
                  <p className="text-xs text-slate-600 mt-2">{r.summary}</p>
                </div>
              </div>

              {!r.is_active && (
                <Button variant="outline" size="xs" onClick={() => handleSetActive(r.resume_id)} icon={CheckCircle2}>
                  Set as Active
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
