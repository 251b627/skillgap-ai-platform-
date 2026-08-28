import { storageService } from './storageService';

export const departmentService = {
  async getDepartments() {
    const departments = await storageService.query('departments');
    const institutions = await storageService.query('institutions');
    const students = await storageService.query('students');
    const faculty = await storageService.query('faculty');

    return departments.map((dept) => {
      const inst = institutions.find((i) => i.institution_id === dept.institution_id);
      const studentCount = students.filter((s) => s.department_id === dept.department_id).length;
      const facultyCount = faculty.filter((f) => f.department_id === dept.department_id).length;
      return {
        ...dept,
        institution_name: inst ? inst.institution_name : 'Unknown Institution',
        student_count: studentCount,
        faculty_count: facultyCount,
      };
    });
  },

  async getDepartmentById(id) {
    return storageService.getById('departments', 'department_id', id);
  },

  async createDepartment(data) {
    const newDept = {
      ...data,
      department_id: `dept-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return storageService.insert('departments', newDept);
  },

  async updateDepartment(id, data) {
    return storageService.update('departments', 'department_id', id, data);
  },

  async deleteDepartment(id) {
    return storageService.remove('departments', 'department_id', id);
  }
};
