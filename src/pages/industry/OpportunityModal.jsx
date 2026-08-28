import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { opportunitySchema } from '../../validations/opportunityValidation';
import { opportunityService } from '../../services/opportunityService';
import { companyService } from '../../services/companyService';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { FormTextarea } from '../../components/forms/FormTextarea';
import { Button } from '../../components/common/Button';

export const OpportunityModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [companies, setCompanies] = useState([]);
  const { success, error: toastError } = useToast();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      company_id: '',
      title: '',
      description: '',
      opportunity_type: 'Internship',
      location: 'San Francisco, CA',
      mode: 'Hybrid',
      stipend: 4500,
      openings: 2,
      application_deadline: '2026-11-30',
      start_date: '2026-12-15',
      status: 'Open',
    },
  });

  useEffect(() => {
    if (isOpen) {
      companyService.getCompanies().then(setCompanies);
      if (initialData) {
        reset({
          company_id: initialData.company_id || '',
          title: initialData.title || '',
          description: initialData.description || '',
          opportunity_type: initialData.opportunity_type || 'Internship',
          location: initialData.location || '',
          mode: initialData.mode || 'Hybrid',
          stipend: initialData.stipend || 0,
          openings: initialData.openings || 1,
          application_deadline: initialData.application_deadline || '',
          start_date: initialData.start_date || '',
          status: initialData.status || 'Open',
        });
      } else {
        reset({
          company_id: '',
          title: '',
          description: '',
          opportunity_type: 'Internship',
          location: 'San Francisco, CA',
          mode: 'Hybrid',
          stipend: 4500,
          openings: 2,
          application_deadline: '2026-11-30',
          start_date: '2026-12-15',
          status: 'Open',
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await opportunityService.updateOpportunity(initialData.opportunity_id, data);
        success('Opportunity updated');
      } else {
        await opportunityService.createOpportunity(data);
        success('Opportunity posted successfully');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toastError(err.message || 'Failed to save opportunity');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Opportunity' : 'Post New Job / Internship'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Job / Internship Title"
          required
          placeholder="e.g. Full Stack React & Cloud Engineer Intern"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Hiring Company"
            required
            options={companies.map((c) => ({ value: c.company_id, label: c.company_name }))}
            error={errors.company_id?.message}
            {...register('company_id')}
          />
          <FormSelect
            label="Opportunity Type"
            required
            options={[
              { value: 'Internship', label: 'Internship' },
              { value: 'Placement', label: 'Full-time Placement' },
              { value: 'Apprenticeship', label: 'Apprenticeship' },
            ]}
            error={errors.opportunity_type?.message}
            {...register('opportunity_type')}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Location"
            required
            placeholder="San Francisco, CA"
            error={errors.location?.message}
            {...register('location')}
          />
          <FormSelect
            label="Work Mode"
            required
            options={[
              { value: 'Hybrid', label: 'Hybrid' },
              { value: 'Remote', label: 'Remote' },
              { value: 'On-site', label: 'On-site' },
            ]}
            error={errors.mode?.message}
            {...register('mode')}
          />
          <FormInput
            label="Stipend / Salary ($)"
            type="number"
            required
            error={errors.stipend?.message}
            {...register('stipend')}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Open Positions"
            type="number"
            required
            error={errors.openings?.message}
            {...register('openings')}
          />
          <FormInput
            label="Application Deadline"
            type="date"
            required
            error={errors.application_deadline?.message}
            {...register('application_deadline')}
          />
          <FormInput
            label="Estimated Start Date"
            type="date"
            required
            error={errors.start_date?.message}
            {...register('start_date')}
          />
        </div>

        <FormTextarea
          label="Role Description & Scope"
          required
          rows={3}
          placeholder="Describe daily responsibilities, stack requirements, and team culture..."
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Publish Opportunity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
