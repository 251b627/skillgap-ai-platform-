import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { departmentSchema } from '../../validations/institutionValidation';
import { departmentService } from '../../services/departmentService';
import { institutionService } from '../../services/institutionService';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { Button } from '../../components/common/Button';

export const DepartmentModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [institutions, setInstitutions] = useState([]);
  const { success, error: toastError } = useToast();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      institution_id: '',
      department_name: '',
      department_code: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      institutionService.getInstitutions().then(setInstitutions);
      if (initialData) {
        reset({
          institution_id: initialData.institution_id || '',
          department_name: initialData.department_name || '',
          department_code: initialData.department_code || '',
        });
      } else {
        reset({ institution_id: '', department_name: '', department_code: '' });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await departmentService.updateDepartment(initialData.department_id, data);
        success('Department updated successfully');
      } else {
        await departmentService.createDepartment(data);
        success('Department created successfully');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toastError(err.message || 'Failed to save department');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Department' : 'Add New Department'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormSelect
          label="Affiliated Institution"
          required
          options={institutions.map((i) => ({ value: i.institution_id, label: i.institution_name }))}
          error={errors.institution_id?.message}
          {...register('institution_id')}
        />

        <FormInput
          label="Department Name"
          required
          placeholder="e.g. Computer Science & Engineering"
          error={errors.department_name?.message}
          {...register('department_name')}
        />

        <FormInput
          label="Department Code"
          required
          placeholder="e.g. CSE or AIDS"
          error={errors.department_code?.message}
          {...register('department_code')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Department'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
