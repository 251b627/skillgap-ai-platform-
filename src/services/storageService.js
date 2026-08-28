import { initialInstitutions } from '../data/initialInstitutions';
import { initialDepartments } from '../data/initialDepartments';
import { initialUsers } from '../data/initialUsers';
import { initialStudents } from '../data/initialStudents';
import { initialFaculty } from '../data/initialFaculty';
import { initialSkillCategories, initialSkills, initialStudentSkills, initialFacultySkills } from '../data/initialSkills';
import { initialCompanies, initialRecruiters } from '../data/initialCompanies';
import { initialOpportunities, initialOpportunitySkills } from '../data/initialOpportunities';
import { initialApplications, initialApplicationHistory } from '../data/initialApplications';
import { initialTrainingPrograms, initialTrainingSkills, initialTrainingEnrollments } from '../data/initialTraining';
import { initialCollaborations } from '../data/initialCollaborations';
import { initialInternships } from '../data/initialInternships';
import { initialResumes } from '../data/initialResumes';

/**
 * Storage Service: Manages in-memory and localStorage persistence.
 * Initializes default dataset on first load and simulates async REST calls.
 */
const STORAGE_PREFIX = 'skillgap_db_';

const SEED_DATA_MAP = {
  institutions: initialInstitutions,
  departments: initialDepartments,
  users: initialUsers,
  students: initialStudents,
  faculty: initialFaculty,
  skill_categories: initialSkillCategories,
  skills: initialSkills,
  student_skills: initialStudentSkills,
  faculty_skills: initialFacultySkills,
  companies: initialCompanies,
  recruiters: initialRecruiters,
  opportunities: initialOpportunities,
  opportunity_skills: initialOpportunitySkills,
  applications: initialApplications,
  application_history: initialApplicationHistory,
  training_programs: initialTrainingPrograms,
  training_skills: initialTrainingSkills,
  training_enrollments: initialTrainingEnrollments,
  collaborations: initialCollaborations,
  internships: initialInternships,
  resumes: initialResumes,
};

export const storageService = {
  // Initialize storage with seeds if missing
  init() {
    Object.keys(SEED_DATA_MAP).forEach((key) => {
      const storageKey = STORAGE_PREFIX + key;
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, JSON.stringify(SEED_DATA_MAP[key]));
      }
    });
  },

  // Reset to initial seeds
  resetAll() {
    Object.keys(SEED_DATA_MAP).forEach((key) => {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(SEED_DATA_MAP[key]));
    });
  },

  // Retrieve table records
  getCollection(table) {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + table);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Save table records
  saveCollection(table, items) {
    localStorage.setItem(STORAGE_PREFIX + table, JSON.stringify(items));
    return items;
  },

  // Async wrapper with simulated latency
  async query(table, filterFn = null, delayMs = 60) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    const items = this.getCollection(table);
    return filterFn ? items.filter(filterFn) : items;
  },

  async getById(table, idKey, idValue, delayMs = 60) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    const items = this.getCollection(table);
    return items.find((item) => String(item[idKey]) === String(idValue)) || null;
  },

  async insert(table, record, delayMs = 80) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    const items = this.getCollection(table);
    const updated = [record, ...items];
    this.saveCollection(table, updated);
    return record;
  },

  async update(table, idKey, idValue, updates, delayMs = 80) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    const items = this.getCollection(table);
    let found = null;
    const updated = items.map((item) => {
      if (String(item[idKey]) === String(idValue)) {
        found = { ...item, ...updates, updated_at: new Date().toISOString() };
        return found;
      }
      return item;
    });
    this.saveCollection(table, updated);
    return found;
  },

  async remove(table, idKey, idValue, delayMs = 80) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    const items = this.getCollection(table);
    const filtered = items.filter((item) => String(item[idKey]) !== String(idValue));
    this.saveCollection(table, filtered);
    return true;
  }
};
