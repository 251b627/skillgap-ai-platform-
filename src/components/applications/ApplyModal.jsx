import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applyOpportunitySchema } from '../../validations/applicationValidation';
import { resumeService } from '../../services/resumeService';
import { applicationService } from '../../services/applicationService';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../common/Modal';
import { FormSelect } from '../forms/FormSelect';
import { FormTextarea } from '../forms/FormTextarea';
import { Button } from '../common/Button';

export const ApplyModal = ({ isOpen, onClose, opportunity, studentId, onSuccess }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { success, error: toastError } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(applyOpportunitySchema),
    defaultValues: {
      student_id: studentId || '',
      opportunity_id: opportunity?.opportunity_id || '',
      resume_id: '',
      cover_letter: '',
    },
  });

  useEffect(() => {
    if (isOpen && studentId) {
      setValue('student_id', studentId);
      setValue('opportunity_id', opportunity?.opportunity_id || '');
      resumeService.getResumesByStudent(studentId).then((list) => {
        setResumes(list);
        const active = list.find((r) => r.is_active) || list[0];
        if (active) setValue('resume_id', active.resume_id);
      });
    }
  }, [isOpen, studentId, opportunity, setValue]);

  const onSubmit = async (data) => {
    try {
      await applicationService.applyOpportunity(data);
      success('Application submitted successfully!');
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      toastError(err.message || 'Failed to submit application');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply for ${opportunity?.title || 'Position'}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-xs text-brand-800">
          <p className="font-semibold">{opportunity?.company_name}</p>
          <p className="text-brand-600 mt-0.5">{opportunity?.location} • {opportunity?.opportunity_type}</p>
        </div>

        <FormSelect
          label="Select Resume / Portfolio Document"
          required
          options={resumes.map((r) => ({
            value: r.resume_id,
            label: `${r.file_name} ${r.is_active ? '(Active)' : ''}`,
          }))}
          error={errors.resume_id?.message}
          {...register('resume_id')}
        />

        <FormTextarea
          label="Cover Letter / Statement of Interest"
          required
          rows={4}
          placeholder="Explain your relevant project experience, enthusiasm for the position, and what makes you a strong candidate..."
          error={errors.cover_letter?.message}
          {...register('cover_letter')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};
