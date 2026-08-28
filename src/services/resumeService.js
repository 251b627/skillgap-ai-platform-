import { storageService } from './storageService';

export const resumeService = {
  async getResumesByStudent(studentId) {
    return storageService.query('resumes', (r) => r.student_id === studentId);
  },

  async uploadResume({ student_id, file_name, file_size_kb, summary, parsed_skills = [] }) {
    const resumes = await storageService.query('resumes', (r) => r.student_id === student_id);
    const isFirst = resumes.length === 0;

    const newResume = {
      resume_id: `res-${Date.now()}`,
      student_id,
      file_name: file_name || 'Resume_Document.pdf',
      file_size_kb: file_size_kb || 350,
      is_active: isFirst,
      uploaded_at: new Date().toISOString(),
      summary: summary || 'Uploaded resume portfolio with verified engineering competencies.',
      parsed_skills,
    };

    return storageService.insert('resumes', newResume);
  },

  async setActiveResume(studentId, resumeId) {
    const resumes = await storageService.query('resumes', (r) => r.student_id === studentId);
    for (const r of resumes) {
      await storageService.update('resumes', 'resume_id', r.resume_id, {
        is_active: r.resume_id === resumeId,
      });
    }
    return true;
  },

  async deleteResume(resumeId) {
    return storageService.remove('resumes', 'resume_id', resumeId);
  }
};
