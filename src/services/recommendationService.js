import { storageService } from './storageService';
import { skillGapService } from './skillGapService';
import { PROFICIENCY_LEVELS } from '../constants/appConstants';

export const recommendationService = {
  async getRecommendationsForStudent(studentId) {
    const student = await storageService.getById('students', 'student_id', studentId);
    if (!student) return [];

    const studentSkills = await storageService.query('student_skills', (s) => s.student_id === studentId);
    const opportunities = await storageService.query('opportunities', (o) => o.status === 'Open');
    const allOppSkills = await storageService.query('opportunity_skills');
    const skills = await storageService.query('skills');
    const trainingPrograms = await storageService.query('training_programs');
    const trainingSkills = await storageService.query('training_skills');
    const enrollments = await storageService.query('training_enrollments', (e) => e.student_id === studentId);

    const enrolledTrainingIds = new Set(enrollments.map((e) => e.training_id));
    const recommendations = [];

    // Analyze gaps against all relevant open opportunities
    for (const opp of opportunities) {
      const oppSkills = allOppSkills.filter((os) => os.opportunity_id === opp.opportunity_id);

      for (const os of oppSkills) {
        const sSkill = studentSkills.find((s) => s.skill_id === os.skill_id);
        const currentLevel = sSkill ? sSkill.proficiency_level : 0;

        if (currentLevel < os.required_level) {
          const skill = skills.find((s) => s.skill_id === os.skill_id);
          const gapAmount = os.required_level - currentLevel;

          // Find suitable training programs teaching this skill
          const matchingTrainSkills = trainingSkills.filter((ts) => ts.skill_id === os.skill_id);
          for (const mts of matchingTrainSkills) {
            const prog = trainingPrograms.find((tp) => tp.training_id === mts.training_id);
            if (!prog) continue;

            const isEnrolled = enrolledTrainingIds.has(prog.training_id);
            const currentLevelLabel = PROFICIENCY_LEVELS.find((p) => p.level === currentLevel)?.label || 'None';
            const reqLevelLabel = PROFICIENCY_LEVELS.find((p) => p.level === os.required_level)?.label || 'Expert';

            // Recommendation confidence calculation
            const matchScore = Math.min(98, 80 + gapAmount * 5);

            // Avoid duplicate recommendations for the same skill & program
            const exists = recommendations.find(
              (r) => r.skill_id === os.skill_id && r.training_id === prog.training_id
            );

            if (!exists) {
              recommendations.push({
                recommendation_id: `rec-${studentId}-${prog.training_id}-${os.skill_id}`,
                student_id: studentId,
                student_name: student.name,
                missing_skill: skill ? skill.skill_name : 'Required Skill',
                skill_id: os.skill_id,
                current_level: currentLevel,
                required_level: os.required_level,
                training_id: prog.training_id,
                recommended_training: prog.training_name,
                provider: prog.provider,
                duration_hours: prog.duration_hours,
                match_score: matchScore,
                reason: `Student requires ${skill?.skill_name || 'Skill'} Level ${os.required_level} (${reqLevelLabel}) for "${opp.title}" but currently has Level ${currentLevel} (${currentLevelLabel}).`,
                status: isEnrolled ? 'Enrolled' : 'Recommended',
              });
            }
          }
        }
      }
    }

    return recommendations.sort((a, b) => b.match_score - a.match_score);
  }
};
