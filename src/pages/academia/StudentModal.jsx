import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema } from '../../validations/studentValidation';
import { studentService } from '../../services/studentService';
import { departmentService } from '../../services/departmentService';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { Button } from '../../components/common/Button';

export const StudentModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [departments, setDepartments] = useState([]);
  const { success, error: toastError } = useToast();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      department_id: '',
      enrollment_no: '',
      name: '',
      email: '',
      phone: '',
      year: 4,
      semester: 7,
      graduation_year: 2026,
      cgpa: 8.5,
      status: 'Active',
    },
  });

  useEffect(() => {
    if (isOpen) {
      departmentService.getDepartments().then(setDepartments);
      if (initialData) {
        reset({
          department_id: initialData.department_id || '',
          enrollment_no: initialData.enrollment_no || '',
          name: initialData.name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          year: initialData.year || 4,
          semester: initialData.semester || 7,
          graduation_year: initialData.graduation_year || 2026,
          cgpa: initialData.cgpa || 8.5,
          status: initialData.status || 'Active',
        });
      } else {
        reset({
          department_id: '',
          enrollment_no: '',
          name: '',
          email: '',
          phone: '',
          year: 4,
          semester: 7,
          graduation_year: 2026,
          cgpa: 8.5,
          status: 'Active',
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await studentService.updateStudent(initialData.student_id, data);
        success('Student profile updated');
      } else {
        await studentService.createStudent(data);
        success('Student registered successfully');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toastError(err.message || 'Failed to save student profile');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Student Details' : 'Register New Student'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Full Name"
            required
            placeholder="Rahul Sharma"
            error={errors.name?.message}
            {...register('name')}
          />
          <FormInput
            label="Enrollment / Roll No"
            required
            placeholder="AIT-2022-CS014"
            error={errors.enrollment_no?.message}
            {...register('enrollment_no')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Institutional Email"
            type="email"
            required
            placeholder="student@institution.edu"
            error={errors.email?.message}
            {...register('email')}
          />
          <FormInput
            label="Phone Number"
            required
            placeholder="+1 (555) 000-0000"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <FormSelect
          label="Academic Department"
          required
          options={departments.map((d) => ({
            value: d.department_id,
            label: `${d.department_name} (${d.institution_name})`,
          }))}
          error={errors.department_id?.message}
          {...register('department_id')}
        />

        <div className="grid grid-cols-4 gap-3">
          <FormInput
            label="Year"
            type="number"
            required
            error={errors.year?.message}
            {...register('year')}
          />
          <FormInput
            label="Semester"
            type="number"
            required
            error={errors.semester?.message}
            {...register('semester')}
          />
          <FormInput
            label="Graduation"
            type="number"
            required
            error={errors.graduation_year?.message}
            {...register('graduation_year')}
          />
          <FormInput
            label="CGPA"
            type="number"
            step="0.01"
            required
            error={errors.cgpa?.message}
            {...register('cgpa')}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Register Student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
