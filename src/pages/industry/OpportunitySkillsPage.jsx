import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Star, ListChecks } from 'lucide-react';
import { opportunityService } from '../../services/opportunityService';
import { skillService } from '../../services/skillService';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FormSelect } from '../../components/forms/FormSelect';
import { ProficiencySelector } from '../../components/skills/ProficiencySelector';
import { Badge } from '../../components/common/Badge';

export const OpportunitySkillsPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState('');
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSkillId, setNewSkillId] = useState('');
  const [level, setLevel] = useState(4);
  const [reqType, setReqType] = useState('Mandatory');
  const { success, error: toastError } = useToast();

  useEffect(() => {
    opportunityService.getOpportunities().then((res) => {
      setOpportunities(res);
      if (res.length > 0) setSelectedOppId(res[0].opportunity_id);
    });
    skillService.getSkills().then(setAllSkills);
  }, []);

  const loadOppSkills = async (id) => {
    if (!id) return;
    const res = await opportunityService.getOpportunitySkills(id);
    setSkills(res);
  };

  useEffect(() => {
    if (selectedOppId) loadOppSkills(selectedOppId);
  }, [selectedOppId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newSkillId) return;
    try {
      await opportunityService.addOpportunitySkill(selectedOppId, newSkillId, Number(level), reqType);
      success('Required skill requirement saved');
      setIsAddOpen(false);
      setNewSkillId('');
      loadOppSkills(selectedOppId);
    } catch (err) {
      toastError(err.message);
    }
  };

  const handleDelete = async (id) => {
    await opportunityService.deleteOpportunitySkill(id);
    success('Requirement removed');
    loadOppSkills(selectedOppId);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunity Skill Requirements Matrix"
        subtitle="Specify mandatory and optional technical competencies for job and internship postings"
        action={
          <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)} icon={Plus}>
            Add Skill Requirement
          </Button>
        }
      />

      <div className="max-w-md">
        <FormSelect
          label="Select Job / Internship Opportunity"
          value={selectedOppId}
          onChange={(e) => setSelectedOppId(e.target.value)}
          options={opportunities.map((o) => ({ value: o.opportunity_id, label: `${o.title} (${o.company_name})` }))}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((s) => (
          <Card key={s.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-slate-800">{s.skill_name}</h4>
                <Badge variant={s.requirement_type === 'Mandatory' ? 'rose' : 'slate'} size="sm">
                  {s.requirement_type}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 mt-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Required Level {s.required_level} / 5</span>
              </div>
            </div>
            <button onClick={() => handleDelete(s.id)} className="text-slate-300 hover:text-rose-600 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </Card>
        ))}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Required Skill Criteria">
        <form onSubmit={handleSave} className="space-y-4">
          <FormSelect
            label="Skill"
            required
            value={newSkillId}
            onChange={(e) => setNewSkillId(e.target.value)}
            options={allSkills.map((sk) => ({ value: sk.skill_id, label: sk.skill_name }))}
          />

          <FormSelect
            label="Requirement Type"
            required
            value={reqType}
            onChange={(e) => setReqType(e.target.value)}
            options={[
              { value: 'Mandatory', label: 'Mandatory (Must Have)' },
              { value: 'Optional', label: 'Optional (Nice to Have)' },
            ]}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Required Proficiency Level (1 - 5)</label>
            <ProficiencySelector value={level} onChange={setLevel} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Requirement</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
