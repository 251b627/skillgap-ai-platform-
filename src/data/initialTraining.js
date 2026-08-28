export const initialTrainingPrograms = [
  {
    training_id: 'trn-1',
    training_name: 'Advanced Python for Machine Learning & Data Pipelines',
    provider: 'DeepLearning.AI & Industry Consortium',
    description: 'Master advanced Python paradigms, async IO, NumPy vectorization, PyTorch model pipelines, and memory optimization.',
    duration_hours: 40,
    mode: 'Online',
    start_date: '2026-09-01',
    end_date: '2026-10-15',
    status: 'Ongoing',
    created_at: '2025-01-05T08:00:00.000Z',
  },
  {
    training_id: 'trn-2',
    training_name: 'Production Kubernetes & Cloud Architecture Bootcamp',
    provider: 'Cloud Native Computing Foundation (CNCF)',
    description: 'Hands-on enterprise container orchestration, Helm charts, ingress controllers, CI/CD automation, and cloud security.',
    duration_hours: 36,
    mode: 'Hybrid',
    start_date: '2026-09-10',
    end_date: '2026-10-25',
    status: 'Upcoming',
    created_at: '2025-01-08T09:00:00.000Z',
  },
  {
    training_id: 'trn-3',
    training_name: 'Modern Full-Stack React 19 & Next.js Masterclass',
    provider: 'TechSkills Academy',
    description: 'Server actions, React Server Components, Tailwind CSS design systems, and edge data fetching patterns.',
    duration_hours: 30,
    mode: 'Online',
    start_date: '2026-08-15',
    end_date: '2026-09-20',
    status: 'Ongoing',
    created_at: '2025-01-09T10:00:00.000Z',
  }
];

export const initialTrainingSkills = [
  // trn-1: Advanced Python for ML
  { id: 'ts-1', training_id: 'trn-1', skill_id: 'sk-1' }, // Python
  { id: 'ts-2', training_id: 'trn-1', skill_id: 'sk-6' }, // Machine Learning

  // trn-2: Kubernetes & Cloud
  { id: 'ts-3', training_id: 'trn-2', skill_id: 'sk-9' },  // Docker & K8s
  { id: 'ts-4', training_id: 'trn-2', skill_id: 'sk-10' }, // AWS Cloud

  // trn-3: React & Next.js
  { id: 'ts-5', training_id: 'trn-3', skill_id: 'sk-4' }, // React
  { id: 'ts-6', training_id: 'trn-3', skill_id: 'sk-2' }, // JS/TS
  { id: 'ts-7', training_id: 'trn-3', skill_id: 'sk-5' }, // Node.js
];

export const initialTrainingEnrollments = [
  {
    enrollment_id: 'enr-1',
    student_id: 'stud-1',
    training_id: 'trn-1',
    enrolled_at: '2025-01-25T10:00:00.000Z',
    completion_percentage: 65,
    completion_status: 'In Progress',
    score: 88,
    certificate_url: 'https://credentials.skillgap.platform/verify/cert-enr-1',
  },
  {
    enrollment_id: 'enr-2',
    student_id: 'stud-1',
    training_id: 'trn-3',
    enrolled_at: '2025-01-15T08:00:00.000Z',
    completion_percentage: 100,
    completion_status: 'Completed',
    score: 96,
    certificate_url: 'https://credentials.skillgap.platform/verify/cert-enr-2',
  }
];
