/**
 * General application constants including proficiency levels and pagination defaults.
 */
export const PROFICIENCY_LEVELS = [
  { level: 1, label: 'Beginner', description: 'Fundamental awareness and conceptual knowledge' },
  { level: 2, label: 'Basic', description: 'Basic practical knowledge with guidance' },
  { level: 3, label: 'Intermediate', description: 'Independent working ability on standard tasks' },
  { level: 4, label: 'Advanced', description: 'Deep technical competence and problem solving' },
  { level: 5, label: 'Expert', description: 'Mastery, architectural leadership, and mentoring' },
];

export const SKILL_REQUIREMENT_TYPE = {
  MANDATORY: 'Mandatory',
  OPTIONAL: 'Optional',
};

export const SKILL_GAP_PRIORITY = {
  NONE: { key: 'NONE', label: 'No Gap', level: 0, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  LOW: { key: 'LOW', label: 'Low', level: 1, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  MEDIUM: { key: 'MEDIUM', label: 'Medium', level: 2, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  HIGH: { key: 'HIGH', label: 'High', level: 3, color: 'text-rose-700 bg-rose-50 border-rose-200' },
};

export const DEFAULT_PAGE_SIZE = 10;
