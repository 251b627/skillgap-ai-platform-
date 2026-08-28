import { z } from 'zod';

export const companySchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  industry_type: z.string().min(2, 'Industry type is required'),
  website: z.string().url('Valid website URL is required').optional().or(z.literal('')),
  email: z.string().email('Valid corporate email is required'),
  phone: z.string().min(8, 'Valid phone is required'),
  location: z.string().min(2, 'Location is required'),
});

export const recruiterSchema = z.object({
  company_id: z.string().min(1, 'Company is required'),
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  designation: z.string().min(2, 'Designation is required'),
  status: z.string().default('Active'),
});

export const opportunitySchema = z.object({
  company_id: z.string().min(1, 'Company selection is required'),
  recruiter_id: z.string().optional(),
  title: z.string().min(3, 'Opportunity title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  opportunity_type: z.enum(['Internship', 'Placement', 'Apprenticeship']),
  location: z.string().min(2, 'Location is required'),
  mode: z.enum(['On-site', 'Remote', 'Hybrid']),
  stipend: z.coerce.number().min(0),
  openings: z.coerce.number().min(1),
  application_deadline: z.string().min(1, 'Application deadline is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  status: z.enum(['Draft', 'Open', 'Closed', 'Expired']).default('Open'),
});
