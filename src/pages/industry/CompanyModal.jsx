import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companySchema } from '../../validations/opportunityValidation';
import { companyService } from '../../services/companyService';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/forms/FormInput';
import { FormTextarea } from '../../components/forms/FormTextarea';
import { Button } from '../../components/common/Button';

export const CompanyModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  const { success, error: toastError } = useToast();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      company_name: '',
      industry_type: '',
      website: '',
      email: '',
      phone: '',
      location: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        company_name: initialData.company_name || '',
        industry_type: initialData.industry_type || '',
        website: initialData.website || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        location: initialData.location || '',
      });
    } else {
      reset({
        company_name: '',
        industry_type: '',
        website: '',
        email: '',
        phone: '',
        location: '',
      });
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await companyService.updateCompany(initialData.company_id, data);
        success('Company updated');
      } else {
        await companyService.createCompany(data);
        success('Company registered successfully');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Company Profile' : 'Register Partner Company'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Company Name"
          required
          placeholder="NovaSoft Technologies"
          error={errors.company_name?.message}
          {...register('company_name')}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Industry Domain"
            required
            placeholder="Enterprise Cloud & AI"
            error={errors.industry_type?.message}
            {...register('industry_type')}
          />
          <FormInput
            label="Headquarters Location"
            required
            placeholder="San Francisco, CA"
            error={errors.location?.message}
            {...register('location')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Corporate Email"
            type="email"
            required
            placeholder="talent@company.io"
            error={errors.email?.message}
            {...register('email')}
          />
          <FormInput
            label="Phone"
            required
            placeholder="+1 (800) 555-0100"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <FormInput
          label="Official Website"
          placeholder="https://novasoft.io"
          error={errors.website?.message}
          {...register('website')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Register Company'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
