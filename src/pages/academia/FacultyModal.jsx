import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { facultySchema } from '../../validations/studentValidation';
import { facultyService } from '../../services/facultyService';
import { departmentService } from '../../services/departmentService';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { Button } from '../../components/common/Button';

export const FacultyModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [departments, setDepartments] = useState([]);
  const { success, error: toastError } = useToast();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      department_id: '',
      name: '',
      email: '',
      designation: '',
      specialization: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      departmentService.getDepartments().then(setDepartments);
      if (initialData) {
        reset({
          department_id: initialData.department_id || '',
          name: initialData.name || '',
          email: initialData.email || '',
          designation: initialData.designation || '',
          specialization: initialData.specialization || '',
        });
      } else {
        reset({ department_id: '', name: '', email: '', designation: '', specialization: '' });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await facultyService.updateFaculty(initialData.faculty_id, data);
        success('Faculty profile updated');
      } else {
        await facultyService.createFaculty(data);
        success('Faculty member added');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Faculty' : 'Add Faculty Member'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Full Name"
          required
          placeholder="Prof. David Miller"
          error={errors.name?.message}
          {...register('name')}
        />

        <FormInput
          label="Email Address"
          type="email"
          required
          placeholder="faculty@institution.edu"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormSelect
          label="Department"
          required
          options={departments.map((d) => ({
            value: d.department_id,
            label: `${d.department_name} (${d.institution_name})`,
          }))}
          error={errors.department_id?.message}
          {...register('department_id')}
        />

        <FormInput
          label="Designation"
          required
          placeholder="e.g. Associate Professor"
          error={errors.designation?.message}
          {...register('designation')}
        />

        <FormInput
          label="Specialization / Research Domain"
          required
          placeholder="e.g. Distributed Systems & Cloud Computing"
          error={errors.specialization?.message}
          {...register('specialization')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Faculty Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
