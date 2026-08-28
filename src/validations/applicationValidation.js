import { z } from 'zod';

export const applyOpportunitySchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
  opportunity_id: z.string().min(1, 'Opportunity ID is required'),
  resume_id: z.string().min(1, 'Please select a resume'),
  cover_letter: z.string().min(20, 'Cover letter must be at least 20 characters'),
});

export const updateApplicationStatusSchema = z.object({
  current_status: z.enum(['Applied', 'Shortlisted', 'Assessment', 'Interview', 'Selected', 'Rejected']),
  remarks: z.string().min(3, 'Please provide status remarks / feedback'),
});
