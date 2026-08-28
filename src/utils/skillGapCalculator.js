import { SKILL_GAP_PRIORITY } from '../constants/appConstants';

/**
 * Calculates gap between student proficiency and required level.
 * gap = required_level - student_level
 * Priority: gap <= 0 -> None, 1 -> Low, 2 -> Medium, 3+ -> High
 */
export function calculateSkillGap(studentLevel = 0, requiredLevel = 0) {
  const current = Number(studentLevel) || 0;
  const required = Number(requiredLevel) || 0;
  const gap = Math.max(0, required - current);

  let priority = SKILL_GAP_PRIORITY.NONE;
  if (gap === 1) priority = SKILL_GAP_PRIORITY.LOW;
  else if (gap === 2) priority = SKILL_GAP_PRIORITY.MEDIUM;
  else if (gap >= 3) priority = SKILL_GAP_PRIORITY.HIGH;

  return {
    studentLevel: current,
    requiredLevel: required,
    gap,
    hasGap: gap > 0,
    priority,
  };
}

/**
 * Calculates overall match / readiness percentage for a student against opportunity requirements.
 */
export function calculateOpportunityMatch(studentSkills = [], requiredSkills = []) {
  if (!requiredSkills || requiredSkills.length === 0) return 100;

  let totalRequiredWeight = 0;
  let totalMatchedWeight = 0;

  const gaps = requiredSkills.map((req) => {
    const studentSkill = studentSkills.find((s) => s.skill_id === req.skill_id);
    const studentLevel = studentSkill ? studentSkill.proficiency_level : 0;
    const gapResult = calculateSkillGap(studentLevel, req.required_level);
    
    const weight = req.requirement_type === 'Mandatory' ? 2 : 1;
    totalRequiredWeight += weight * req.required_level;
    totalMatchedWeight += weight * Math.min(studentLevel, req.required_level);

    return {
      skill_id: req.skill_id,
      skill_name: req.skill_name,
      requirement_type: req.requirement_type || 'Mandatory',
      ...gapResult,
    };
  });

  const matchPercentage = totalRequiredWeight > 0 
    ? Math.round((totalMatchedWeight / totalRequiredWeight) * 100) 
    : 100;

  return {
    matchPercentage,
    gaps,
    hasCriticalGaps: gaps.some((g) => g.hasGap && g.requirement_type === 'Mandatory'),
  };
}
