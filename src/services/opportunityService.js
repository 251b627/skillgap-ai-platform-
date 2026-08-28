import { storageService } from './storageService';

export const opportunityService = {
  async getOpportunities() {
    const opportunities = await storageService.query('opportunities');
    const companies = await storageService.query('companies');
    const recruiters = await storageService.query('recruiters');
    const oppSkills = await storageService.query('opportunity_skills');
    const applications = await storageService.query('applications');

    return opportunities.map((opp) => {
      const comp = companies.find((c) => c.company_id === opp.company_id);
      const rec = recruiters.find((r) => r.recruiter_id === opp.recruiter_id);
      const skillsCount = oppSkills.filter((s) => s.opportunity_id === opp.opportunity_id).length;
      const appCount = applications.filter((a) => a.opportunity_id === opp.opportunity_id).length;
      return {
        ...opp,
        company_name: comp ? comp.company_name : 'Unknown Company',
        company_location: comp ? comp.location : '',
        recruiter_name: rec ? rec.name : 'Talent Team',
        skills_count: skillsCount,
        applications_count: appCount,
      };
    });
  },

  async getOpportunityById(id) {
    const opp = await storageService.getById('opportunities', 'opportunity_id', id);
    if (!opp) return null;
    const companies = await storageService.query('companies');
    const recruiters = await storageService.query('recruiters');
    const comp = companies.find((c) => c.company_id === opp.company_id);
    const rec = recruiters.find((r) => r.recruiter_id === opp.recruiter_id);

    return {
      ...opp,
      company_name: comp ? comp.company_name : 'Unknown Company',
      company_website: comp ? comp.website : '',
      company_location: comp ? comp.location : '',
      recruiter_name: rec ? rec.name : 'Talent Team',
      recruiter_email: rec ? rec.email : '',
    };
  },

  async createOpportunity(data) {
    const newOpp = {
      ...data,
      opportunity_id: `opp-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return storageService.insert('opportunities', newOpp);
  },

  async updateOpportunity(id, data) {
    return storageService.update('opportunities', 'opportunity_id', id, data);
  },

  async deleteOpportunity(id) {
    return storageService.remove('opportunities', 'opportunity_id', id);
  },

  async getOpportunitySkills(opportunityId) {
    const oppSkills = await storageService.query('opportunity_skills', (os) => os.opportunity_id === opportunityId);
    const skills = await storageService.query('skills');
    const categories = await storageService.query('skill_categories');

    return oppSkills.map((os) => {
      const skill = skills.find((s) => s.skill_id === os.skill_id);
      const cat = skill ? categories.find((c) => c.category_id === skill.category_id) : null;
      return {
        ...os,
        skill_name: skill ? skill.skill_name : 'Unknown Skill',
        category_name: cat ? cat.category_name : 'General',
      };
    });
  },

  async addOpportunitySkill(opportunityId, skillId, requiredLevel, requirementType = 'Mandatory') {
    const oppSkills = await storageService.query('opportunity_skills');
    const existing = oppSkills.find((os) => os.opportunity_id === opportunityId && os.skill_id === skillId);

    if (existing) {
      return storageService.update('opportunity_skills', 'id', existing.id, {
        required_level: requiredLevel,
        requirement_type: requirementType,
      });
    } else {
      const newRec = {
        id: `ops-${Date.now()}`,
        opportunity_id: opportunityId,
        skill_id: skillId,
        required_level: requiredLevel,
        requirement_type: requirementType,
      };
      return storageService.insert('opportunity_skills', newRec);
    }
  },

  async deleteOpportunitySkill(id) {
    return storageService.remove('opportunity_skills', 'id', id);
  }
};
