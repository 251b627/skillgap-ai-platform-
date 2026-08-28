export const initialOpportunities = [
  {
    opportunity_id: 'opp-1',
    company_id: 'comp-1',
    recruiter_id: 'rec-1',
    title: 'Full Stack React & Cloud Engineer Intern',
    description: 'Join our flagship product engineering squad building real-time collaboration dashboards and scalable microservices.',
    opportunity_type: 'Internship',
    location: 'San Francisco, CA',
    mode: 'Hybrid',
    stipend: 4500,
    openings: 3,
    application_deadline: '2026-10-31',
    start_date: '2026-11-15',
    end_date: '2027-05-15',
    status: 'Open',
    created_at: '2025-01-15T09:00:00.000Z',
  },
  {
    opportunity_id: 'opp-2',
    company_id: 'comp-2',
    recruiter_id: 'rec-2',
    title: 'Junior Machine Learning & NLP Engineer',
    description: 'Develop fine-tuning pipelines and evaluate generative models for domain-specific knowledge reasoning.',
    opportunity_type: 'Placement',
    location: 'Austin, TX',
    mode: 'Remote',
    stipend: 95000,
    openings: 2,
    application_deadline: '2026-11-15',
    start_date: '2026-12-01',
    end_date: '2027-12-01',
    status: 'Open',
    created_at: '2025-01-16T10:00:00.000Z',
  },
  {
    opportunity_id: 'opp-3',
    company_id: 'comp-3',
    recruiter_id: 'rec-3',
    title: 'Cloud DevOps & Systems Apprentice',
    description: 'Work alongside principal infrastructure engineers deploying Kubernetes clusters across multi-region hybrid clouds.',
    opportunity_type: 'Apprenticeship',
    location: 'New York, NY',
    mode: 'On-site',
    stipend: 3800,
    openings: 4,
    application_deadline: '2026-10-20',
    start_date: '2026-11-01',
    end_date: '2027-04-30',
    status: 'Open',
    created_at: '2025-01-18T11:00:00.000Z',
  }
];

export const initialOpportunitySkills = [
  // opp-1: Full Stack React & Cloud (NovaSoft)
  { id: 'ops-1', opportunity_id: 'opp-1', skill_id: 'sk-4', required_level: 4, requirement_type: 'Mandatory' }, // React Level 4
  { id: 'ops-2', opportunity_id: 'opp-1', skill_id: 'sk-2', required_level: 3, requirement_type: 'Mandatory' }, // JS/TS Level 3
  { id: 'ops-3', opportunity_id: 'opp-1', skill_id: 'sk-5', required_level: 3, requirement_type: 'Mandatory' }, // Node Level 3
  { id: 'ops-4', opportunity_id: 'opp-1', skill_id: 'sk-9', required_level: 3, requirement_type: 'Optional' },  // Docker Level 3

  // opp-2: Junior ML & NLP Engineer (Synthetix AI)
  { id: 'ops-5', opportunity_id: 'opp-2', skill_id: 'sk-1', required_level: 4, requirement_type: 'Mandatory' }, // Python Level 4 (Notice Rahul has level 2!)
  { id: 'ops-6', opportunity_id: 'opp-2', skill_id: 'sk-6', required_level: 4, requirement_type: 'Mandatory' }, // ML Level 4
  { id: 'ops-7', opportunity_id: 'opp-2', skill_id: 'sk-7', required_level: 3, requirement_type: 'Mandatory' }, // NLP Level 3
  { id: 'ops-8', opportunity_id: 'opp-2', skill_id: 'sk-8', required_level: 3, requirement_type: 'Optional' },  // SQL Level 3

  // opp-3: Cloud DevOps Apprentice
  { id: 'ops-9', opportunity_id: 'opp-3', skill_id: 'sk-9', required_level: 3, requirement_type: 'Mandatory' },  // Docker/K8s Level 3
  { id: 'ops-10', opportunity_id: 'opp-3', skill_id: 'sk-10', required_level: 3, requirement_type: 'Mandatory' }, // AWS Level 3
  { id: 'ops-11', opportunity_id: 'opp-3', skill_id: 'sk-1', required_level: 2, requirement_type: 'Optional' },   // Python Level 2
];
