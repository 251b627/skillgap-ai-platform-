import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recruiterSchema } from '../../validations/opportunityValidation';
import { recruiterService } from '../../services/recruiterService';
import { companyService } from '../../services/companyService';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { Button } from '../../components/common/Button';

export const RecruiterModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [companies, setCompanies] = useState([]);
  const { success, error: toastError } = useToast();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(recruiterSchema),
    defaultValues: {
      company_id: '',
      name: '',
      email: '',
      designation: '',
      status: 'Active',
    },
  });

  useEffect(() => {
    if (isOpen) {
      companyService.getCompanies().then(setCompanies);
      if (initialData) {
        reset({
          company_id: initialData.company_id || '',
          name: initialData.name || '',
          email: initialData.email || '',
          designation: initialData.designation || '',
          status: initialData.status || 'Active',
        });
      } else {
        reset({ company_id: '', name: '', email: '', designation: '', status: 'Active' });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await recruiterService.updateRecruiter(initialData.recruiter_id, data);
        success('Recruiter profile updated');
      } else {
        await recruiterService.createRecruiter(data);
        success('Recruiter onboarded');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Recruiter' : 'Add Recruiter Lead'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormSelect
          label="Company"
          required
          options={companies.map((c) => ({ value: c.company_id, label: c.company_name }))}
          error={errors.company_id?.message}
          {...register('company_id')}
        />

        <FormInput
          label="Full Name"
          required
          placeholder="Sarah Jenkins"
          error={errors.name?.message}
          {...register('name')}
        />

        <FormInput
          label="Business Email"
          type="email"
          required
          placeholder="sarah.j@company.io"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormInput
          label="Job Title / Designation"
          required
          placeholder="Lead Technical Recruiter"
          error={errors.designation?.message}
          {...register('designation')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Recruiter'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
