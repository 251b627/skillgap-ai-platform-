import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Send } from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { formatDate } from '../../utils/formatters';

export const MyApplicationsPage = () => {
  const { user } = useAuth();
  const studentId = user?.student_id || 'stud-1';
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getApplications().then((list) => {
      setApps(list.filter((a) => a.student_id === studentId));
      setLoading(false);
    });
  }, [studentId]);

  if (loading) return <TableSkeleton rows={3} cols={3} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Opportunity Applications"
        subtitle="Track the real-time status of your internship and placement submissions"
        action={
          <Link to="/industry/opportunities">
            <Button variant="primary" size="sm" icon={Compass}>Browse New Openings</Button>
          </Link>
        }
      />

      {apps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <Send className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No applications yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore verified industry opportunities matching your technical skills and submit your resume.
          </p>
          <Link to="/industry/opportunities">
            <Button variant="primary" size="sm">Explore Openings</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apps.map((app) => (
            <Card key={app.application_id} className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{app.opportunity_title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{app.company_name} • {app.opportunity_type}</p>
                </div>
                <StatusBadge status={app.current_status} />
              </div>

              <div className="text-xs text-slate-500 py-2 border-y border-slate-100 flex justify-between">
                <span>Submitted on {formatDate(app.applied_at)}</span>
                <span className="font-medium text-slate-700">Stage: {app.current_status}</span>
              </div>

              <div className="flex justify-end">
                <Link to={`/applications/${app.application_id}`}>
                  <Button variant="outline" size="sm" icon={ArrowRight}>View Detailed Timeline</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
