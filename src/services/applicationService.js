import { storageService } from './storageService';
import { APPLICATION_STATUS } from '../constants/statusTypes';
import { internshipService } from './internshipService';

export const applicationService = {
  async getApplications() {
    const apps = await storageService.query('applications');
    const students = await storageService.query('students');
    const opportunities = await storageService.query('opportunities');
    const companies = await storageService.query('companies');

    return apps.map((app) => {
      const student = students.find((s) => s.student_id === app.student_id);
      const opp = opportunities.find((o) => o.opportunity_id === app.opportunity_id);
      const comp = opp ? companies.find((c) => c.company_id === opp.company_id) : null;

      return {
        ...app,
        student_name: student ? student.name : 'Unknown Student',
        student_email: student ? student.email : '',
        student_cgpa: student ? student.cgpa : 'N/A',
        opportunity_title: opp ? opp.title : 'Unknown Opportunity',
        opportunity_type: opp ? opp.opportunity_type : 'Internship',
        company_name: comp ? comp.company_name : 'Unknown Company',
        company_id: comp ? comp.company_id : null,
      };
    });
  },

  async getApplicationById(id) {
    const app = await storageService.getById('applications', 'application_id', id);
    if (!app) return null;
    const students = await storageService.query('students');
    const opportunities = await storageService.query('opportunities');
    const companies = await storageService.query('companies');

    const student = students.find((s) => s.student_id === app.student_id);
    const opp = opportunities.find((o) => o.opportunity_id === app.opportunity_id);
    const comp = opp ? companies.find((c) => c.company_id === opp.company_id) : null;

    return {
      ...app,
      student_name: student ? student.name : 'Unknown Student',
      student_email: student ? student.email : '',
      student_phone: student ? student.phone : '',
      student_cgpa: student ? student.cgpa : 'N/A',
      opportunity_title: opp ? opp.title : 'Unknown Opportunity',
      opportunity_type: opp ? opp.opportunity_type : 'Internship',
      company_name: comp ? comp.company_name : 'Unknown Company',
      company_id: comp ? comp.company_id : null,
    };
  },

  async applyOpportunity({ student_id, opportunity_id, resume_id, cover_letter }) {
    const apps = await storageService.query('applications');
    const existing = apps.find((a) => a.student_id === student_id && a.opportunity_id === opportunity_id);
    if (existing) {
      throw new Error('You have already submitted an application for this opportunity.');
    }

    const newAppId = `app-${Date.now()}`;
    const newApp = {
      application_id: newAppId,
      student_id,
      opportunity_id,
      resume_id,
      cover_letter,
      applied_at: new Date().toISOString(),
      current_status: APPLICATION_STATUS.APPLIED,
    };

    await storageService.insert('applications', newApp);

    // Record initial status history
    await storageService.insert('application_history', {
      history_id: `aph-${Date.now()}`,
      application_id: newAppId,
      status: APPLICATION_STATUS.APPLIED,
      changed_at: new Date().toISOString(),
      remarks: 'Application submitted successfully by candidate.',
    });

    return newApp;
  },

  async updateApplicationStatus(applicationId, newStatus, remarks = '') {
    const app = await storageService.getById('applications', 'application_id', applicationId);
    if (!app) throw new Error('Application not found');

    const updated = await storageService.update('applications', 'application_id', applicationId, {
      current_status: newStatus,
    });

    // Record status transition in timeline
    await storageService.insert('application_history', {
      history_id: `aph-${Date.now()}`,
      application_id: applicationId,
      status: newStatus,
      changed_at: new Date().toISOString(),
      remarks: remarks || `Status moved to ${newStatus}`,
    });

    // If candidate is SELECTED, automatically provision Internship/Placement record
    if (newStatus === APPLICATION_STATUS.SELECTED) {
      const opp = await storageService.getById('opportunities', 'opportunity_id', app.opportunity_id);
      await internshipService.createFromApplication(app, opp);
    }

    return updated;
  },

  async getStatusHistory(applicationId) {
    const history = await storageService.query('application_history', (h) => h.application_id === applicationId);
    return history.sort((a, b) => new Date(a.changed_at) - new Date(b.changed_at));
  }
};
