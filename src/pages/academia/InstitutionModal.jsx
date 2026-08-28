import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { institutionSchema } from '../../validations/institutionValidation';
import { institutionService } from '../../services/institutionService';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/forms/FormInput';
import { Button } from '../../components/common/Button';

export const InstitutionModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  const { success, error: toastError } = useToast();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(institutionSchema),
    defaultValues: {
      institution_name: '',
      institution_code: '',
      address: '',
      city: '',
      state: '',
      website: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        institution_name: initialData.institution_name || '',
        institution_code: initialData.institution_code || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        website: initialData.website || '',
      });
    } else {
      reset({
        institution_name: '',
        institution_code: '',
        address: '',
        city: '',
        state: '',
        website: '',
      });
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await institutionService.updateInstitution(initialData.institution_id, data);
        success('Institution updated successfully');
      } else {
        await institutionService.createInstitution(data);
        success('Institution added successfully');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Institution' : 'Add New Institution'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Institution Name"
          required
          placeholder="e.g. Apex Institute of Technology"
          error={errors.institution_name?.message}
          {...register('institution_name')}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Institution Code"
            required
            placeholder="e.g. AIT"
            error={errors.institution_code?.message}
            {...register('institution_code')}
          />
          <FormInput
            label="Official Website"
            placeholder="https://example.edu"
            error={errors.website?.message}
            {...register('website')}
          />
        </div>

        <FormInput
          label="Street Address"
          required
          placeholder="100 Innovation Boulevard"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="City"
            required
            placeholder="San Jose"
            error={errors.city?.message}
            {...register('city')}
          />
          <FormInput
            label="State / Province"
            required
            placeholder="California"
            error={errors.state?.message}
            {...register('state')}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Institution'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
