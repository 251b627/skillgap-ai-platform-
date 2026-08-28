import { storageService } from './storageService';

export const facultyService = {
  async getFaculty() {
    const faculty = await storageService.query('faculty');
    const departments = await storageService.query('departments');
    const institutions = await storageService.query('institutions');

    return faculty.map((f) => {
      const dept = departments.find((d) => d.department_id === f.department_id);
      const inst = institutions.find((i) => i.institution_id === (f.institution_id || (dept && dept.institution_id)));
      return {
        ...f,
        department_name: dept ? dept.department_name : 'N/A',
        department_code: dept ? dept.department_code : 'N/A',
        institution_name: inst ? inst.institution_name : 'N/A',
      };
    });
  },

  async getFacultyById(id) {
    return storageService.getById('faculty', 'faculty_id', id);
  },

  async createFaculty(data) {
    const newFaculty = {
      ...data,
      faculty_id: `fac-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return storageService.insert('faculty', newFaculty);
  },

  async updateFaculty(id, data) {
    return storageService.update('faculty', 'faculty_id', id, data);
  },

  async deleteFaculty(id) {
    return storageService.remove('faculty', 'faculty_id', id);
  },

  async getFacultySkills(facultyId) {
    const facultySkills = await storageService.query('faculty_skills', (fs) => fs.faculty_id === facultyId);
    const skills = await storageService.query('skills');
    const categories = await storageService.query('skill_categories');

    return facultySkills.map((fs) => {
      const skill = skills.find((s) => s.skill_id === fs.skill_id);
      const cat = skill ? categories.find((c) => c.category_id === skill.category_id) : null;
      return {
        ...fs,
        skill_name: skill ? skill.skill_name : 'Unknown Skill',
        category_name: cat ? cat.category_name : 'General',
      };
    });
  },

  async saveFacultySkill(facultyId, skillId, proficiencyLevel) {
    const facultySkills = await storageService.query('faculty_skills');
    const existing = facultySkills.find((fs) => fs.faculty_id === facultyId && fs.skill_id === skillId);

    if (existing) {
      return storageService.update('faculty_skills', 'id', existing.id, { proficiency_level: proficiencyLevel });
    } else {
      const newRec = {
        id: `fs-${Date.now()}`,
        faculty_id: facultyId,
        skill_id: skillId,
        proficiency_level: proficiencyLevel,
      };
      return storageService.insert('faculty_skills', newRec);
    }
  },

  async deleteFacultySkill(id) {
    return storageService.remove('faculty_skills', 'id', id);
  }
};
