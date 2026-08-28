import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Star, Sparkles } from 'lucide-react';
import { studentService } from '../../../services/studentService';
import { skillService } from '../../../services/skillService';
import { useToast } from '../../../hooks/useToast';
import { Card, CardHeader, CardBody } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { FormSelect } from '../../../components/forms/FormSelect';
import { ProficiencySelector } from '../../../components/skills/ProficiencySelector';
import { PROFICIENCY_LEVELS } from '../../../constants/appConstants';

export const ProfileSkillsTab = ({ studentId }) => {
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [level, setLevel] = useState(3);
  const { success, error: toastError } = useToast();

  const loadSkills = async () => {
    setLoading(true);
    const [sSkills, available] = await Promise.all([
      studentService.getStudentSkills(studentId),
      skillService.getSkills(),
    ]);
    setSkills(sSkills);
    setAllSkills(available);
    setLoading(false);
  };

  useEffect(() => {
    loadSkills();
  }, [studentId]);

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!selectedSkillId) return;
    try {
      await studentService.saveStudentSkill(studentId, selectedSkillId, Number(level));
      success('Skill recorded successfully');
      setIsAddOpen(false);
      setSelectedSkillId('');
      loadSkills();
    } catch (err) {
      toastError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await studentService.deleteStudentSkill(id);
      success('Skill removed');
      loadSkills();
    } catch (err) {
      toastError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-slate-900">Verified Technical Competencies</h3>
          <p className="text-xs text-slate-500">Skills evaluated and verified across coursework and project submissions</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)} icon={Plus}>
          Add Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skills.map((s) => {
          const prof = PROFICIENCY_LEVELS.find((p) => p.level === s.proficiency_level) || PROFICIENCY_LEVELS[0];
          return (
            <Card key={s.id} className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-800">{s.skill_name}</h4>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{s.category_name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Level {s.proficiency_level} • {prof.label}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Student Technical Skill">
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <FormSelect
            label="Skill"
            required
            value={selectedSkillId}
            onChange={(e) => setSelectedSkillId(e.target.value)}
            options={allSkills.map((sk) => ({ value: sk.skill_id, label: `${sk.skill_name} (${sk.category_name})` }))}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Proficiency Level (1 - 5)</label>
            <ProficiencySelector value={level} onChange={setLevel} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Skill</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
