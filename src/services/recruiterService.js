import { storageService } from './storageService';

export const recruiterService = {
  async getRecruiters() {
    const recruiters = await storageService.query('recruiters');
    const companies = await storageService.query('companies');

    return recruiters.map((r) => {
      const comp = companies.find((c) => c.company_id === r.company_id);
      return {
        ...r,
        company_name: comp ? comp.company_name : 'Unassigned',
      };
    });
  },

  async getRecruiterById(id) {
    return storageService.getById('recruiters', 'recruiter_id', id);
  },

  async createRecruiter(data) {
    const newRec = {
      ...data,
      recruiter_id: `rec-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return storageService.insert('recruiters', newRec);
  },

  async updateRecruiter(id, data) {
    return storageService.update('recruiters', 'recruiter_id', id, data);
  },

  async deleteRecruiter(id) {
    return storageService.remove('recruiters', 'recruiter_id', id);
  }
};
