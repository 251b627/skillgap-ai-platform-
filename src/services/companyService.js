import { storageService } from './storageService';

export const companyService = {
  async getCompanies() {
    const companies = await storageService.query('companies');
    const opportunities = await storageService.query('opportunities');
    const recruiters = await storageService.query('recruiters');

    return companies.map((c) => ({
      ...c,
      active_opportunities_count: opportunities.filter((o) => o.company_id === c.company_id && o.status === 'Open').length,
      recruiters_count: recruiters.filter((r) => r.company_id === c.company_id).length,
    }));
  },

  async getCompanyById(id) {
    return storageService.getById('companies', 'company_id', id);
  },

  async createCompany(data) {
    const newComp = {
      ...data,
      company_id: `comp-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return storageService.insert('companies', newComp);
  },

  async updateCompany(id, data) {
    return storageService.update('companies', 'company_id', id, data);
  },

  async deleteCompany(id) {
    return storageService.remove('companies', 'company_id', id);
  }
};
