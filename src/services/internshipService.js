import { storageService } from './storageService';

export const internshipService = {
  async getInternships() {
    const internships = await storageService.query('internships');
    const students = await storageService.query('students');
    const companies = await storageService.query('companies');
    const opportunities = await storageService.query('opportunities');

    return internships.map((item) => {
      const s = students.find((stud) => stud.student_id === item.student_id);
      const comp = companies.find((c) => c.company_id === item.company_id);
      const opp = opportunities.find((o) => o.opportunity_id === item.opportunity_id);

      return {
        ...item,
        student_name: s ? s.name : 'Unknown Student',
        student_email: s ? s.email : '',
        company_name: comp ? comp.company_name : 'Unknown Company',
        opportunity_title: opp ? opp.title : 'Placement Offer',
        opportunity_type: opp ? opp.opportunity_type : 'Internship',
      };
    });
  },

  async getInternshipById(id) {
    return storageService.getById('internships', 'internship_id', id);
  },

  async createFromApplication(application, opportunity) {
    const internships = await storageService.query('internships');
    const existing = internships.find((i) => i.application_id === application.application_id);
    if (existing) return existing;

    const newInternship = {
      internship_id: `int-${Date.now()}`,
      application_id: application.application_id,
      student_id: application.student_id,
      company_id: opportunity ? opportunity.company_id : 'comp-1',
      opportunity_id: application.opportunity_id,
      start_date: opportunity ? opportunity.start_date : new Date().toISOString().split('T')[0],
      end_date: opportunity ? opportunity.end_date : null,
      status: 'Active',
      mentor_name: 'Assigned Engineering Mentor',
      final_evaluation: 'Candidate successfully selected and enrolled into corporate program.',
      created_at: new Date().toISOString(),
    };

    return storageService.insert('internships', newInternship);
  },

  async updateInternship(id, data) {
    return storageService.update('internships', 'internship_id', id, data);
  }
};
