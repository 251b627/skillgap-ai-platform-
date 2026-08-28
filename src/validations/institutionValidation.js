import { z } from 'zod';

export const institutionSchema = z.object({
  institution_name: z.string().min(3, 'Institution name must be at least 3 characters'),
  institution_code: z.string().min(2, 'Institution code is required (e.g. MIT, STAN)'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export const departmentSchema = z.object({
  institution_id: z.string().min(1, 'Please select an institution'),
  department_name: z.string().min(3, 'Department name is required'),
  department_code: z.string().min(2, 'Department code is required (e.g. CS, EE)'),
});
