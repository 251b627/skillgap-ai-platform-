import { storageService } from './storageService';
import { calculateSkillGap, calculateOpportunityMatch } from '../utils/skillGapCalculator';

export const skillGapService = {
  async assessStudentForOpportunity(studentId, opportunityId) {
    const studentSkills = await storageService.query('student_skills', (s) => s.student_id === studentId);
    const oppSkills = await storageService.query('opportunity_skills', (o) => o.opportunity_id === opportunityId);
    const skills = await storageService.query('skills');

    const enrichedReqSkills = oppSkills.map((os) => {
      const s = skills.find((item) => item.skill_id === os.skill_id);
      return {
        ...os,
        skill_name: s ? s.skill_name : 'Unknown Skill',
      };
    });

    const matchAnalysis = calculateOpportunityMatch(studentSkills, enrichedReqSkills);
    return matchAnalysis;
  },

  async getAllGapsForActiveApplications() {
    const applications = await storageService.query('applications');
    const students = await storageService.query('students');
    const opportunities = await storageService.query('opportunities');
    const allStudentSkills = await storageService.query('student_skills');
    const allOppSkills = await storageService.query('opportunity_skills');
    const skills = await storageService.query('skills');

    const results = [];

    for (const app of applications) {
      const student = students.find((s) => s.student_id === app.student_id);
      const opp = opportunities.find((o) => o.opportunity_id === app.opportunity_id);
      if (!student || !opp) continue;

      const studentSkills = allStudentSkills.filter((s) => s.student_id === student.student_id);
      const oppSkills = allOppSkills.filter((o) => o.opportunity_id === opp.opportunity_id);

      oppSkills.forEach((os) => {
        const skill = skills.find((s) => s.skill_id === os.skill_id);
        const sSkill = studentSkills.find((s) => s.skill_id === os.skill_id);
        const currentLevel = sSkill ? sSkill.proficiency_level : 0;
        const gapInfo = calculateSkillGap(currentLevel, os.required_level);

        results.push({
          assessment_id: `gap-${app.application_id}-${os.skill_id}`,
          student_id: student.student_id,
          student_name: student.name,
          opportunity_id: opp.opportunity_id,
          opportunity_title: opp.title,
          skill_id: os.skill_id,
          skill_name: skill ? skill.skill_name : 'Unknown Skill',
          student_level: currentLevel,
          required_level: os.required_level,
          gap: gapInfo.gap,
          priority: gapInfo.priority,
          hasGap: gapInfo.hasGap,
          requirement_type: os.requirement_type || 'Mandatory',
        });
      });
    }

    return results;
  }
};
