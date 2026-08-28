import { storageService } from './storageService';

export const institutionService = {
  async getInstitutions() {
    const institutions = await storageService.query('institutions');
    const departments = await storageService.query('departments');
    const students = await storageService.query('students');
    const faculty = await storageService.query('faculty');

    return institutions.map((inst) => {
      const deptList = departments.filter((d) => d.institution_id === inst.institution_id);
      const studentCount = students.filter((s) => s.institution_id === inst.institution_id).length;
      const facultyCount = faculty.filter((f) => f.institution_id === inst.institution_id).length;
      return {
        ...inst,
        department_count: deptList.length,
        student_count: studentCount,
        faculty_count: facultyCount,
      };
    });
  },

  async getInstitutionById(id) {
    return storageService.getById('institutions', 'institution_id', id);
  },

  async createInstitution(data) {
    const newInst = {
      ...data,
      institution_id: `inst-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return storageService.insert('institutions', newInst);
  },

  async updateInstitution(id, data) {
    return storageService.update('institutions', 'institution_id', id, data);
  },

  async deleteInstitution(id) {
    return storageService.remove('institutions', 'institution_id', id);
  }
};
