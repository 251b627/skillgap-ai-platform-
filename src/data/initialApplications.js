export const initialApplications = [
  {
    application_id: 'app-1',
    student_id: 'stud-1',
    opportunity_id: 'opp-1',
    resume_id: 'res-1',
    applied_at: '2025-01-20T14:00:00.000Z',
    current_status: 'Shortlisted',
    cover_letter: 'I have built multiple React and Node.js production web apps and would love to contribute to NovaSoft cloud platform tools.',
  },
  {
    application_id: 'app-2',
    student_id: 'stud-2',
    opportunity_id: 'opp-2',
    resume_id: 'res-2',
    applied_at: '2025-01-21T09:30:00.000Z',
    current_status: 'Interview',
    cover_letter: 'My published NLP research and strong Python PyTorch foundation make me an ideal candidate for Synthetix generative models team.',
  }
];

export const initialApplicationHistory = [
  {
    history_id: 'aph-1',
    application_id: 'app-1',
    status: 'Applied',
    changed_at: '2025-01-20T14:00:00.000Z',
    remarks: 'Application received via university portal.',
  },
  {
    history_id: 'aph-2',
    application_id: 'app-1',
    status: 'Shortlisted',
    changed_at: '2025-01-22T11:00:00.000Z',
    remarks: 'Profile matches core React & TypeScript requirements. Moved to preliminary review.',
  },
  {
    history_id: 'aph-3',
    application_id: 'app-2',
    status: 'Applied',
    changed_at: '2025-01-21T09:30:00.000Z',
    remarks: 'Candidate applied with 9.20 CGPA and AI specialization.',
  },
  {
    history_id: 'aph-4',
    application_id: 'app-2',
    status: 'Shortlisted',
    changed_at: '2025-01-22T16:00:00.000Z',
    remarks: 'Strong alignment on Python & PyTorch metrics.',
  },
  {
    history_id: 'aph-5',
    application_id: 'app-2',
    status: 'Assessment',
    changed_at: '2025-01-24T10:00:00.000Z',
    remarks: 'Completed technical coding challenge with 95% test suite coverage.',
  },
  {
    history_id: 'aph-6',
    application_id: 'app-2',
    status: 'Interview',
    changed_at: '2025-01-26T15:00:00.000Z',
    remarks: 'Scheduled technical architecture discussion with Lead AI Researcher.',
  }
];
