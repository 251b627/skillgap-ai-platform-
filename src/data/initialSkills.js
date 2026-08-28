export const initialSkillCategories = [
  { category_id: 'cat-1', category_name: 'Programming', description: 'Core programming languages and algorithm implementations' },
  { category_id: 'cat-2', category_name: 'Web Development', description: 'Modern client and server web engineering technologies' },
  { category_id: 'cat-3', category_name: 'AI / Machine Learning', description: 'Data modeling, neural networks, LLMs, and analytics' },
  { category_id: 'cat-4', category_name: 'Databases & Big Data', description: 'Relational, NoSQL, and high-throughput data stores' },
  { category_id: 'cat-5', category_name: 'Cloud & DevOps', description: 'Containerization, cloud infrastructure, and CI/CD pipelines' },
  { category_id: 'cat-6', category_name: 'Communication & Leadership', description: 'Professional collaboration, agile workflow, and leadership' },
];

export const initialSkills = [
  { skill_id: 'sk-1', category_id: 'cat-1', skill_name: 'Python', description: 'General purpose scripting, backend, data science' },
  { skill_id: 'sk-2', category_id: 'cat-1', skill_name: 'JavaScript / TypeScript', description: 'Modern typed frontend and backend runtime code' },
  { skill_id: 'sk-3', category_id: 'cat-1', skill_name: 'Java', description: 'Enterprise backend architecture and OOP patterns' },
  { skill_id: 'sk-4', category_id: 'cat-2', skill_name: 'React.js', description: 'Component-based single page applications and state hooks' },
  { skill_id: 'sk-5', category_id: 'cat-2', skill_name: 'Node.js', description: 'Event-driven asynchronous server-side Javascript' },
  { skill_id: 'sk-6', category_id: 'cat-3', skill_name: 'Machine Learning', description: 'Supervised/unsupervised algorithms, scikit-learn, PyTorch' },
  { skill_id: 'sk-7', category_id: 'cat-3', skill_name: 'Natural Language Processing', description: 'Tokenization, transformers, embeddings, and LLM tuning' },
  { skill_id: 'sk-8', category_id: 'cat-4', skill_name: 'SQL & Relational DBs', description: 'PostgreSQL, MySQL, query optimization, indexing' },
  { skill_id: 'sk-9', category_id: 'cat-5', skill_name: 'Docker & Kubernetes', description: 'Container packaging, deployment manifests, pod orchestration' },
  { skill_id: 'sk-10', category_id: 'cat-5', skill_name: 'AWS Cloud', description: 'EC2, S3, Lambda, IAM, ECS, and CloudFormation' },
  { skill_id: 'sk-11', category_id: 'cat-6', skill_name: 'Agile & Scrum Practices', description: 'Sprint planning, Jira, sprint reviews, team collaboration' },
];

export const initialStudentSkills = [
  // Rahul Sharma (stud-1)
  { id: 'ss-1', student_id: 'stud-1', skill_id: 'sk-1', proficiency_level: 2 }, // Python: Beginner/Basic
  { id: 'ss-2', student_id: 'stud-1', skill_id: 'sk-2', proficiency_level: 4 }, // JS/TS: Advanced
  { id: 'ss-3', student_id: 'stud-1', skill_id: 'sk-4', proficiency_level: 4 }, // React: Advanced
  { id: 'ss-4', student_id: 'stud-1', skill_id: 'sk-5', proficiency_level: 3 }, // Node: Intermediate
  { id: 'ss-5', student_id: 'stud-1', skill_id: 'sk-8', proficiency_level: 3 }, // SQL: Intermediate
  { id: 'ss-6', student_id: 'stud-1', skill_id: 'sk-9', proficiency_level: 1 }, // Docker: Beginner

  // Priya Patel (stud-2)
  { id: 'ss-7', student_id: 'stud-2', skill_id: 'sk-1', proficiency_level: 5 }, // Python: Expert
  { id: 'ss-8', student_id: 'stud-2', skill_id: 'sk-6', proficiency_level: 4 }, // ML: Advanced
  { id: 'ss-9', student_id: 'stud-2', skill_id: 'sk-7', proficiency_level: 4 }, // NLP: Advanced
  { id: 'ss-10', student_id: 'stud-2', skill_id: 'sk-8', proficiency_level: 3 }, // SQL: Intermediate
];

export const initialFacultySkills = [
  { id: 'fs-1', faculty_id: 'fac-1', skill_id: 'sk-9', proficiency_level: 5 },
  { id: 'fs-2', faculty_id: 'fac-1', skill_id: 'sk-10', proficiency_level: 5 },
  { id: 'fs-3', faculty_id: 'fac-2', skill_id: 'sk-1', proficiency_level: 5 },
  { id: 'fs-4', faculty_id: 'fac-2', skill_id: 'sk-6', proficiency_level: 5 },
  { id: 'fs-5', faculty_id: 'fac-2', skill_id: 'sk-7', proficiency_level: 4 },
];
