import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, UserCheck, Calendar, Plus, ArrowRight } from 'lucide-react';
import { opportunityService } from '../../services/opportunityService';
import { applicationService } from '../../services/applicationService';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { ApplicationStatusChart } from '../../components/charts/ApplicationStatusChart';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

export const RecruiterDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      setLoading(true);
      const [opps, apps] = await Promise.all([
        opportunityService.getOpportunities(),
        applicationService.getApplications(),
      ]);

      const statusMap = apps.reduce((acc, a) => {
        acc[a.current_status] = (acc[a.current_status] || 0) + 1;
        return acc;
      }, {});
      const funnelData = Object.keys(statusMap).map((k) => ({ name: k, value: statusMap[k] }));

      setData({
        opportunities: opps,
        applications: apps,
        funnelData,
        totalApplicants: apps.length,
        shortlisted: apps.filter((a) => a.current_status === 'Shortlisted').length,
        interviews: apps.filter((a) => a.current_status === 'Interview').length,
        selected: apps.filter((a) => a.current_status === 'Selected').length,
      });
      setLoading(false);
    };

    fetchRecruiterData();
  }, []);

  if (loading || !data) return <TableSkeleton rows={4} cols={3} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Industry Recruiter Dashboard"
        subtitle="Manage postings, screen student applicants, and track recruitment pipelines"
        action={
          <Link to="/industry/opportunities">
            <Button variant="primary" size="sm" icon={Plus}>Post New Opportunity</Button>
          </Link>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-medium">Active Postings</p>
          <h4 className="text-2xl font-bold text-slate-900 mt-1">{data.opportunities.length}</h4>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-medium">Total Applicants</p>
          <h4 className="text-2xl font-bold text-brand-600 mt-1">{data.totalApplicants}</h4>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-medium">In Interview Round</p>
          <h4 className="text-2xl font-bold text-purple-600 mt-1">{data.interviews}</h4>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-medium">Offers Confirmed</p>
          <h4 className="text-2xl font-bold text-emerald-600 mt-1">{data.selected}</h4>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Recent Candidate Submissions"
              subtitle="Incoming applications with verified academic credentials"
              action={<Link to="/applications" className="text-xs font-semibold text-brand-600 hover:underline">View All</Link>}
            />
            <CardBody className="divide-y divide-slate-100 p-0">
              {data.applications.map((app) => (
                <div key={app.application_id} className="p-4 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-semibold text-slate-800">{app.student_name}</h5>
                    <p className="text-xs text-slate-500">{app.opportunity_title} • CGPA: {app.student_cgpa}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.current_status} />
                    <Link to={`/applications/${app.application_id}`}>
                      <Button variant="ghost" size="xs" icon={ArrowRight}>Review</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader title="Applicant Stage Distribution" subtitle="Pipeline conversion ratios" />
            <CardBody>
              <ApplicationStatusChart data={data.funnelData} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
