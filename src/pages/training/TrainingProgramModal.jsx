import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trainingProgramSchema } from '../../validations/trainingValidation';
import { trainingService } from '../../services/trainingService';
import { skillService } from '../../services/skillService';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { FormTextarea } from '../../components/forms/FormTextarea';
import { Button } from '../../components/common/Button';

export const TrainingProgramModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [skills, setSkills] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const { success, error: toastError } = useToast();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(trainingProgramSchema),
    defaultValues: {
      training_name: '',
      provider: '',
      description: '',
      duration_hours: 40,
      mode: 'Online',
      start_date: '2026-09-01',
      end_date: '2026-10-15',
      status: 'Upcoming',
      skill_ids: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      skillService.getSkills().then(setSkills);
      if (initialData) {
        reset({
          training_name: initialData.training_name || '',
          provider: initialData.provider || '',
          description: initialData.description || '',
          duration_hours: initialData.duration_hours || 40,
          mode: initialData.mode || 'Online',
          start_date: initialData.start_date || '',
          end_date: initialData.end_date || '',
          status: initialData.status || 'Upcoming',
          skill_ids: initialData.skill_ids || [],
        });
        setSelectedSkillIds(initialData.skill_ids || []);
      } else {
        reset({
          training_name: '',
          provider: '',
          description: '',
          duration_hours: 40,
          mode: 'Online',
          start_date: '2026-09-01',
          end_date: '2026-10-15',
          status: 'Upcoming',
          skill_ids: [],
        });
        setSelectedSkillIds([]);
      }
    }
  }, [isOpen, initialData, reset]);

  const handleToggleSkill = (skillId) => {
    const updated = selectedSkillIds.includes(skillId)
      ? selectedSkillIds.filter((id) => id !== skillId)
      : [...selectedSkillIds, skillId];
    setSelectedSkillIds(updated);
    setValue('skill_ids', updated, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await trainingService.updateTrainingProgram(initialData.training_id, data);
        success('Training program updated');
      } else {
        await trainingService.createTrainingProgram(data);
        success('Training program created');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Training Program' : 'Create Training Program'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Training Course Title"
          required
          placeholder="e.g. Advanced Python for Machine Learning"
          error={errors.training_name?.message}
          {...register('training_name')}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Training Partner / Provider"
            required
            placeholder="e.g. DeepLearning.AI"
            error={errors.provider?.message}
            {...register('provider')}
          />
          <FormSelect
            label="Delivery Mode"
            required
            options={[
              { value: 'Online', label: 'Online' },
              { value: 'Offline', label: 'Offline / Classroom' },
              { value: 'Hybrid', label: 'Hybrid' },
            ]}
            error={errors.mode?.message}
            {...register('mode')}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Duration (Hours)"
            type="number"
            required
            error={errors.duration_hours?.message}
            {...register('duration_hours')}
          />
          <FormInput
            label="Start Date"
            type="date"
            required
            error={errors.start_date?.message}
            {...register('start_date')}
          />
          <FormInput
            label="End Date"
            type="date"
            required
            error={errors.end_date?.message}
            {...register('end_date')}
          />
        </div>

        <FormTextarea
          label="Curriculum Overview & Syllabus"
          required
          rows={3}
          placeholder="Topics covered, lab assignments, and project requirements..."
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Targeted Skills Multi-select Chips */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Targeted Technical Skills <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-32 overflow-y-auto">
            {skills.map((sk) => {
              const isSelected = selectedSkillIds.includes(sk.skill_id);
              return (
                <button
                  key={sk.skill_id}
                  type="button"
                  onClick={() => handleToggleSkill(sk.skill_id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {sk.skill_name}
                </button>
              );
            })}
          </div>
          {errors.skill_ids && <p className="text-xs font-medium text-rose-600 mt-1">{errors.skill_ids.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Publish Training'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
