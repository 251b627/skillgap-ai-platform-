import { z } from 'zod';

export const studentSchema = z.object({
  department_id: z.string().min(1, 'Department is required'),
  enrollment_no: z.string().min(3, 'Enrollment number is required'),
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  year: z.coerce.number().min(1).max(5),
  semester: z.coerce.number().min(1).max(10),
  graduation_year: z.coerce.number().min(2020).max(2035),
  cgpa: z.coerce.number().min(0.0).max(10.0),
  status: z.string().default('Active'),
});

export const facultySchema = z.object({
  department_id: z.string().min(1, 'Department is required'),
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email address is required'),
  designation: z.string().min(2, 'Designation is required'),
  specialization: z.string().min(2, 'Specialization is required'),
});
