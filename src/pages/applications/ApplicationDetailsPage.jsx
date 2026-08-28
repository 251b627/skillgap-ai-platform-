import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit3, User, Briefcase, FileText, CheckCircle2 } from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../hooks/useModal';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { ApplicationTimeline } from '../../components/applications/ApplicationTimeline';
import { ApplicationStatusModal } from '../../components/applications/ApplicationStatusModal';
import { formatDate } from '../../utils/formatters';

export const ApplicationDetailsPage = () => {
  const { applicationId } = useParams();
  const { role } = useAuth();
  const [app, setApp] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const statusModal = useModal();

  const loadData = async () => {
    setLoading(true);
    const [appData, histData] = await Promise.all([
      applicationService.getApplicationById(applicationId),
      applicationService.getStatusHistory(applicationId),
    ]);
    setApp(appData);
    setHistory(histData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [applicationId]);

  if (loading || !app) return <TableSkeleton rows={5} cols={3} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to={role === 'STUDENT' ? '/applications/my' : '/applications'}>
          <Button variant="ghost" size="sm" icon={ArrowLeft}>Back to Applications</Button>
        </Link>
        {role !== 'STUDENT' && (
          <Button variant="primary" size="sm" onClick={() => statusModal.open(app)} icon={Edit3}>
            Update Status / Stage
          </Button>
        )}
      </div>

      {/* Main Details Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">{app.opportunity_title}</h2>
              <StatusBadge status={app.current_status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Candidate: <strong className="text-slate-700">{app.student_name}</strong> • Organization: <strong className="text-slate-700">{app.company_name}</strong>
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Applied on: <span className="font-semibold text-slate-700">{formatDate(app.applied_at)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Stage Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Application Progress & Audit Timeline"
              subtitle="Step-by-step verified transition records"
            />
            <CardBody>
              <ApplicationTimeline currentStatus={app.current_status} history={history} />
            </CardBody>
          </Card>
        </div>

        {/* Right: Candidate Cover Letter & Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Candidate Statement / Cover Letter" />
            <CardBody>
              <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                "{app.cover_letter}"
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Candidate Contact" />
            <CardBody className="space-y-2 text-xs text-slate-600">
              <p>Email: <strong className="text-slate-800">{app.student_email}</strong></p>
              <p>Academic CGPA: <strong className="text-emerald-700">{app.student_cgpa}</strong></p>
              <div className="pt-2">
                <Link to={`/academia/students/${app.student_id}`}>
                  <Button variant="outline" size="xs">View Full Student Dossier</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {statusModal.isOpen && (
        <ApplicationStatusModal
          isOpen={statusModal.isOpen}
          onClose={statusModal.close}
          application={statusModal.modalData}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};
