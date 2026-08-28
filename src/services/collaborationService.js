import { storageService } from './storageService';

export const collaborationService = {
  async getCollaborations() {
    const collabs = await storageService.query('collaborations');
    const companies = await storageService.query('companies');
    const institutions = await storageService.query('institutions');

    return collabs.map((c) => {
      const comp = companies.find((co) => co.company_id === c.company_id);
      const inst = institutions.find((i) => i.institution_id === c.institution_id);
      return {
        ...c,
        company_name: comp ? comp.company_name : 'Unknown Company',
        institution_name: inst ? inst.institution_name : 'Unknown Institution',
      };
    });
  },

  async createCollaboration(data) {
    const newCollab = {
      ...data,
      collaboration_id: `collab-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return storageService.insert('collaborations', newCollab);
  },

  async updateCollaboration(id, data) {
    return storageService.update('collaborations', 'collaboration_id', id, data);
  },

  async deleteCollaboration(id) {
    return storageService.remove('collaborations', 'collaboration_id', id);
  }
};
