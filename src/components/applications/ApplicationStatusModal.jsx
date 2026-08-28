import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateApplicationStatusSchema } from '../../validations/applicationValidation';
import { applicationService } from '../../services/applicationService';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../common/Modal';
import { FormSelect } from '../forms/FormSelect';
import { FormTextarea } from '../forms/FormTextarea';
import { Button } from '../common/Button';
import { APPLICATION_STATUS } from '../../constants/statusTypes';

export const ApplicationStatusModal = ({ isOpen, onClose, application, onSuccess }) => {
  const { success, error: toastError } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateApplicationStatusSchema),
    defaultValues: {
      current_status: application?.current_status || APPLICATION_STATUS.SHORTLISTED,
      remarks: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await applicationService.updateApplicationStatus(
        application.application_id,
        data.current_status,
        data.remarks
      );
      success(`Application status updated to ${data.current_status}`);
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      toastError(err.message || 'Failed to update status');
    }
  };

  const statusOptions = Object.values(APPLICATION_STATUS).map((s) => ({
    value: s,
    label: s,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Candidate Stage">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
          <p className="font-semibold text-slate-800">Candidate: {application?.student_name}</p>
          <p className="text-slate-500">Position: {application?.opportunity_title}</p>
          <p className="text-slate-500">Current Status: <strong className="text-brand-600">{application?.current_status}</strong></p>
        </div>

        <FormSelect
          label="Next Stage / Decision"
          required
          options={statusOptions}
          error={errors.current_status?.message}
          {...register('current_status')}
        />

        <FormTextarea
          label="Evaluation Notes & Remarks"
          required
          rows={3}
          placeholder="Provide context for this status transition (e.g. Cleared round 1 technical interview with 90% score)..."
          error={errors.remarks?.message}
          {...register('remarks')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Confirm Transition
          </Button>
        </div>
      </form>
    </Modal>
  );
};
