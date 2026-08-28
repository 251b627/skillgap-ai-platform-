import { storageService } from './storageService';

export const studentService = {
  async getStudents() {
    const students = await storageService.query('students');
    const departments = await storageService.query('departments');
    const institutions = await storageService.query('institutions');

    return students.map((s) => {
      const dept = departments.find((d) => d.department_id === s.department_id);
      const inst = institutions.find((i) => i.institution_id === (s.institution_id || (dept && dept.institution_id)));
      return {
        ...s,
        department_name: dept ? dept.department_name : 'N/A',
        department_code: dept ? dept.department_code : 'N/A',
        institution_name: inst ? inst.institution_name : 'N/A',
      };
    });
  },

  async getStudentById(id) {
    const student = await storageService.getById('students', 'student_id', id);
    if (!student) return null;
    const departments = await storageService.query('departments');
    const institutions = await storageService.query('institutions');
    const dept = departments.find((d) => d.department_id === student.department_id);
    const inst = institutions.find((i) => i.institution_id === (student.institution_id || (dept && dept.institution_id)));
    return {
      ...student,
      department_name: dept ? dept.department_name : 'N/A',
      department_code: dept ? dept.department_code : 'N/A',
      institution_name: inst ? inst.institution_name : 'N/A',
    };
  },

  async createStudent(data) {
    const newStudent = {
      ...data,
      student_id: `stud-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return storageService.insert('students', newStudent);
  },

  async updateStudent(id, data) {
    return storageService.update('students', 'student_id', id, data);
  },

  async deleteStudent(id) {
    return storageService.remove('students', 'student_id', id);
  },

  async getStudentSkills(studentId) {
    const studentSkills = await storageService.query('student_skills', (ss) => ss.student_id === studentId);
    const skills = await storageService.query('skills');
    const categories = await storageService.query('skill_categories');

    return studentSkills.map((ss) => {
      const skill = skills.find((s) => s.skill_id === ss.skill_id);
      const cat = skill ? categories.find((c) => c.category_id === skill.category_id) : null;
      return {
        ...ss,
        skill_name: skill ? skill.skill_name : 'Unknown Skill',
        description: skill ? skill.description : '',
        category_name: cat ? cat.category_name : 'General',
      };
    });
  },

  async saveStudentSkill(studentId, skillId, proficiencyLevel) {
    const studentSkills = await storageService.query('student_skills');
    const existing = studentSkills.find((ss) => ss.student_id === studentId && ss.skill_id === skillId);

    if (existing) {
      return storageService.update('student_skills', 'id', existing.id, { proficiency_level: proficiencyLevel });
    } else {
      const newRec = {
        id: `ss-${Date.now()}`,
        student_id: studentId,
        skill_id: skillId,
        proficiency_level: proficiencyLevel,
      };
      return storageService.insert('student_skills', newRec);
    }
  },

  async deleteStudentSkill(id) {
    return storageService.remove('student_skills', 'id', id);
  }
};
