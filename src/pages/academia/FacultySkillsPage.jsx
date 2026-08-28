import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { facultyService } from '../../services/facultyService';
import { skillService } from '../../services/skillService';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FormSelect } from '../../components/forms/FormSelect';
import { ProficiencySelector } from '../../components/skills/ProficiencySelector';

export const FacultySkillsPage = () => {
  const [faculty, setFaculty] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSkillId, setNewSkillId] = useState('');
  const [level, setLevel] = useState(5);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    facultyService.getFaculty().then((res) => {
      setFaculty(res);
      if (res.length > 0) setSelectedFacultyId(res[0].faculty_id);
    });
    skillService.getSkills().then(setAllSkills);
  }, []);

  const loadFacultySkills = async (id) => {
    if (!id) return;
    const res = await facultyService.getFacultySkills(id);
    setSkills(res);
  };

  useEffect(() => {
    if (selectedFacultyId) loadFacultySkills(selectedFacultyId);
  }, [selectedFacultyId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newSkillId) return;
    try {
      await facultyService.saveFacultySkill(selectedFacultyId, newSkillId, Number(level));
      success('Faculty skill recorded');
      setIsAddOpen(false);
      setNewSkillId('');
      loadFacultySkills(selectedFacultyId);
    } catch (err) {
      toastError(err.message);
    }
  };

  const handleDelete = async (id) => {
    await facultyService.deleteFacultySkill(id);
    success('Skill removed');
    loadFacultySkills(selectedFacultyId);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Technical Competency Matrix"
        subtitle="Manage faculty subject matter expertise and training capabilities"
        action={
          <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)} icon={Plus}>
            Assign Faculty Skill
          </Button>
        }
      />

      <div className="max-w-md">
        <FormSelect
          label="Select Faculty Member"
          value={selectedFacultyId}
          onChange={(e) => setSelectedFacultyId(e.target.value)}
          options={faculty.map((f) => ({ value: f.faculty_id, label: `${f.name} (${f.designation})` }))}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((s) => (
          <Card key={s.id} className="p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">{s.skill_name}</h4>
              <p className="text-xs text-slate-400">{s.category_name}</p>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 mt-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Level {s.proficiency_level} / 5</span>
              </div>
            </div>
            <button onClick={() => handleDelete(s.id)} className="text-slate-300 hover:text-rose-600 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </Card>
        ))}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Assign Faculty Technical Skill">
        <form onSubmit={handleSave} className="space-y-4">
          <FormSelect
            label="Skill"
            required
            value={newSkillId}
            onChange={(e) => setNewSkillId(e.target.value)}
            options={allSkills.map((sk) => ({ value: sk.skill_id, label: sk.skill_name }))}
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Proficiency Level</label>
            <ProficiencySelector value={level} onChange={setLevel} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
