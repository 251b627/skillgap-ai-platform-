import { z } from 'zod';

export const trainingProgramSchema = z.object({
  training_name: z.string().min(3, 'Training title is required'),
  provider: z.string().min(2, 'Training provider/partner is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration_hours: z.coerce.number().min(1, 'Duration must be at least 1 hour'),
  mode: z.enum(['Online', 'Offline', 'Hybrid']),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  status: z.enum(['Upcoming', 'Ongoing', 'Completed']).default('Upcoming'),
  skill_ids: z.array(z.string()).min(1, 'Please select at least one skill targeted by this program'),
});

export const collaborationSchema = z.object({
  company_id: z.string().min(1, 'Company selection is required'),
  institution_id: z.string().min(1, 'Institution selection is required'),
  collaboration_type: z.string().min(2, 'Collaboration type is required (e.g. Research, Placement Drive)'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  status: z.enum(['Active', 'Pending', 'Completed', 'Terminated']).default('Active'),
  description: z.string().min(5, 'Description is required'),
});
