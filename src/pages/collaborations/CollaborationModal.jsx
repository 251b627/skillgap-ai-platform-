import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { collaborationSchema } from '../../validations/trainingValidation';
import { collaborationService } from '../../services/collaborationService';
import { companyService } from '../../services/companyService';
import { institutionService } from '../../services/institutionService';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { FormTextarea } from '../../components/forms/FormTextarea';
import { Button } from '../../components/common/Button';

export const CollaborationModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [companies, setCompanies] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const { success, error: toastError } = useToast();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(collaborationSchema),
    defaultValues: {
      company_id: '',
      institution_id: '',
      collaboration_type: 'Campus Placement & R&D Lab',
      start_date: '2025-01-01',
      end_date: '2027-12-31',
      status: 'Active',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      Promise.all([companyService.getCompanies(), institutionService.getInstitutions()]).then(([c, i]) => {
        setCompanies(c);
        setInstitutions(i);
      });
      if (initialData) {
        reset({
          company_id: initialData.company_id || '',
          institution_id: initialData.institution_id || '',
          collaboration_type: initialData.collaboration_type || '',
          start_date: initialData.start_date || '',
          end_date: initialData.end_date || '',
          status: initialData.status || 'Active',
          description: initialData.description || '',
        });
      } else {
        reset({
          company_id: '',
          institution_id: '',
          collaboration_type: 'Campus Placement & R&D Lab',
          start_date: '2025-01-01',
          end_date: '2027-12-31',
          status: 'Active',
          description: '',
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await collaborationService.updateCollaboration(initialData.collaboration_id, data);
        success('Collaboration agreement updated');
      } else {
        await collaborationService.createCollaboration(data);
        success('MOU partnership created');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Partnership MOU' : 'Establish Institutional Partnership'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Corporate Partner"
            required
            options={companies.map((c) => ({ value: c.company_id, label: c.company_name }))}
            error={errors.company_id?.message}
            {...register('company_id')}
          />
          <FormSelect
            label="Academic Institution"
            required
            options={institutions.map((i) => ({ value: i.institution_id, label: i.institution_name }))}
            error={errors.institution_id?.message}
            {...register('institution_id')}
          />
        </div>

        <FormInput
          label="Collaboration Scope / Title"
          required
          placeholder="e.g. Joint AI Research Lab & Campus Recruitment Drive"
          error={errors.collaboration_type?.message}
          {...register('collaboration_type')}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Effective Start Date"
            type="date"
            required
            error={errors.start_date?.message}
            {...register('start_date')}
          />
          <FormInput
            label="Agreement Expiration"
            type="date"
            error={errors.end_date?.message}
            {...register('end_date')}
          />
        </div>

        <FormTextarea
          label="Partnership Goals & Joint Commitments"
          required
          rows={3}
          placeholder="Describe research objectives, annual student placement quotas, faculty exchange, etc."
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Establish MOU'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
