import { storageService } from './storageService';

export const skillService = {
  // Categories
  async getCategories() {
    const categories = await storageService.query('skill_categories');
    const skills = await storageService.query('skills');
    return categories.map((cat) => ({
      ...cat,
      skill_count: skills.filter((s) => s.category_id === cat.category_id).length,
    }));
  },

  async createCategory(data) {
    const newCat = {
      ...data,
      category_id: `cat-${Date.now()}`,
    };
    return storageService.insert('skill_categories', newCat);
  },

  async updateCategory(id, data) {
    return storageService.update('skill_categories', 'category_id', id, data);
  },

  async deleteCategory(id) {
    return storageService.remove('skill_categories', 'category_id', id);
  },

  // Skills
  async getSkills() {
    const skills = await storageService.query('skills');
    const categories = await storageService.query('skill_categories');
    return skills.map((s) => {
      const cat = categories.find((c) => c.category_id === s.category_id);
      return {
        ...s,
        category_name: cat ? cat.category_name : 'Uncategorized',
      };
    });
  },

  async getSkillById(id) {
    return storageService.getById('skills', 'skill_id', id);
  },

  async createSkill(data) {
    const newSkill = {
      ...data,
      skill_id: `sk-${Date.now()}`,
    };
    return storageService.insert('skills', newSkill);
  },

  async updateSkill(id, data) {
    return storageService.update('skills', 'skill_id', id, data);
  },

  async deleteSkill(id) {
    return storageService.remove('skills', 'skill_id', id);
  }
};
