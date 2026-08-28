import { storageService } from './storageService';
import { studentService } from './studentService';

export const trainingService = {
  async getTrainingPrograms() {
    const programs = await storageService.query('training_programs');
    const trainingSkills = await storageService.query('training_skills');
    const skills = await storageService.query('skills');
    const enrollments = await storageService.query('training_enrollments');

    return programs.map((p) => {
      const tSkills = trainingSkills.filter((ts) => ts.training_id === p.training_id);
      const skillDetails = tSkills.map((ts) => {
        const s = skills.find((item) => item.skill_id === ts.skill_id);
        return s ? s.skill_name : 'Skill';
      });
      const enrCount = enrollments.filter((e) => e.training_id === p.training_id).length;

      return {
        ...p,
        skills_covered: skillDetails,
        skill_ids: tSkills.map((ts) => ts.skill_id),
        enrollments_count: enrCount,
      };
    });
  },

  async getTrainingProgramById(id) {
    return storageService.getById('training_programs', 'training_id', id);
  },

  async createTrainingProgram(data) {
    const { skill_ids = [], ...rest } = data;
    const newProgId = `trn-${Date.now()}`;
    const newProgram = {
      ...rest,
      training_id: newProgId,
      created_at: new Date().toISOString(),
    };
    await storageService.insert('training_programs', newProgram);

    // Save associated skills
    for (const skillId of skill_ids) {
      await storageService.insert('training_skills', {
        id: `ts-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        training_id: newProgId,
        skill_id: skillId,
      });
    }

    return newProgram;
  },

  async updateTrainingProgram(id, data) {
    return storageService.update('training_programs', 'training_id', id, data);
  },

  async deleteTrainingProgram(id) {
    return storageService.remove('training_programs', 'training_id', id);
  },

  async getEnrollments() {
    const enrollments = await storageService.query('training_enrollments');
    const students = await storageService.query('students');
    const programs = await storageService.query('training_programs');

    return enrollments.map((enr) => {
      const student = students.find((s) => s.student_id === enr.student_id);
      const prog = programs.find((p) => p.training_id === enr.training_id);
      return {
        ...enr,
        student_name: student ? student.name : 'Unknown Student',
        student_email: student ? student.email : '',
        training_name: prog ? prog.training_name : 'Unknown Program',
        provider: prog ? prog.provider : 'Partner',
        duration_hours: prog ? prog.duration_hours : 0,
      };
    });
  },

  async enrollStudent(studentId, trainingId) {
    const enrollments = await storageService.query('training_enrollments');
    const existing = enrollments.find((e) => e.student_id === studentId && e.training_id === trainingId);
    if (existing) {
      throw new Error('Student is already enrolled in this training program.');
    }

    const newEnr = {
      enrollment_id: `enr-${Date.now()}`,
      student_id: studentId,
      training_id: trainingId,
      enrolled_at: new Date().toISOString(),
      completion_percentage: 0,
      completion_status: 'Enrolled',
      score: 0,
      certificate_url: '',
    };

    return storageService.insert('training_enrollments', newEnr);
  },

  async updateEnrollmentProgress(enrollmentId, percentage, score = null) {
    const enr = await storageService.getById('training_enrollments', 'enrollment_id', enrollmentId);
    if (!enr) throw new Error('Enrollment not found');

    const numPct = Math.min(100, Math.max(0, Number(percentage)));
    const status = numPct >= 100 ? 'Completed' : numPct > 0 ? 'In Progress' : 'Enrolled';
    const certUrl = numPct >= 100 ? `https://credentials.skillgap.platform/verify/cert-${enrollmentId}` : enr.certificate_url;

    const updated = await storageService.update('training_enrollments', 'enrollment_id', enrollmentId, {
      completion_percentage: numPct,
      completion_status: status,
      score: score !== null ? Number(score) : enr.score,
      certificate_url: certUrl,
    });

    // If completed, dynamically upskill student proficiency in skills covered by this training!
    if (numPct >= 100) {
      const trainingSkills = await storageService.query('training_skills', (ts) => ts.training_id === enr.training_id);
      const studentSkills = await storageService.query('student_skills', (ss) => ss.student_id === enr.student_id);

      for (const ts of trainingSkills) {
        const existingSkill = studentSkills.find((ss) => ss.skill_id === ts.skill_id);
        const currentLevel = existingSkill ? existingSkill.proficiency_level : 1;
        const newLevel = Math.min(5, currentLevel + 1); // Upskill +1 level!
        await studentService.saveStudentSkill(enr.student_id, ts.skill_id, newLevel);
      }
    }

    return updated;
  }
};
