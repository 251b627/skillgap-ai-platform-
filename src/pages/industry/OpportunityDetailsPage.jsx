import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, DollarSign, Users, Calendar, Send, Star, CheckCircle2 } from 'lucide-react';
import { opportunityService } from '../../services/opportunityService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../hooks/useModal';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { ApplyModal } from '../../components/applications/ApplyModal';
import { formatCurrency } from '../../utils/formatters';

export const OpportunityDetailsPage = () => {
  const { opportunityId } = useParams();
  const { user, role } = useAuth();
  const [opp, setOpp] = useState(null);
  const [reqSkills, setReqSkills] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const applyModal = useModal();

  const loadDetails = async () => {
    setLoading(true);
    const [oppData, sData, appData] = await Promise.all([
      opportunityService.getOpportunityById(opportunityId),
      opportunityService.getOpportunitySkills(opportunityId),
      applicationService.getApplications(),
    ]);
    setOpp(oppData);
    setReqSkills(sData);
    setApps(appData.filter((a) => a.opportunity_id === opportunityId));
    setLoading(false);
  };

  useEffect(() => {
    loadDetails();
  }, [opportunityId]);

  if (loading || !opp) return <TableSkeleton rows={5} cols={3} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/industry/opportunities">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>Back to Opportunities</Button>
        </Link>
        {role === 'STUDENT' && (
          <Button variant="primary" size="md" onClick={() => applyModal.open(opp)} icon={Send}>
            Apply for this Role
          </Button>
        )}
      </div>

      {/* Hero Header */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{opp.title}</h2>
              <StatusBadge status={opp.status} />
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1">{opp.company_name} • {opp.company_location}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Stipend / Package</span>
            <span className="text-xl font-bold text-slate-900">{formatCurrency(opp.stipend)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block">Position Type</span>
            <span className="font-semibold text-slate-800">{opp.opportunity_type} ({opp.mode})</span>
          </div>
          <div>
            <span className="text-slate-400 block">Available Openings</span>
            <span className="font-semibold text-slate-800">{opp.openings} positions</span>
          </div>
          <div>
            <span className="text-slate-400 block">Application Deadline</span>
            <span className="font-semibold text-slate-800">{opp.application_deadline}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Start Date</span>
            <span className="font-semibold text-slate-800">{opp.start_date}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Description & Skills */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Role Overview & Technical Scope" />
            <CardBody>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{opp.description}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Required Technical Competencies" subtitle="Target skill proficiency criteria" />
            <CardBody className="divide-y divide-slate-100 p-0">
              {reqSkills.map((sk) => (
                <div key={sk.id} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sm text-slate-800">{sk.skill_name}</span>
                    <span className="text-xs text-slate-400 block">{sk.category_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={sk.requirement_type === 'Mandatory' ? 'rose' : 'slate'} size="sm">
                      {sk.requirement_type}
                    </Badge>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      Level {sk.required_level} / 5
                    </span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Right: Company & Recruiter info */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="About Employer" />
            <CardBody className="space-y-3 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block">Organization</span>
                <span className="font-semibold text-slate-800 text-sm">{opp.company_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Recruiting Contact</span>
                <span className="font-medium text-slate-700">{opp.recruiter_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Applicants</span>
                <span className="font-bold text-brand-600 text-sm">{apps.length} candidates applied</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <ApplyModal
        isOpen={applyModal.isOpen}
        onClose={applyModal.close}
        opportunity={opp}
        studentId={user?.student_id || 'stud-1'}
        onSuccess={loadDetails}
      />
    </div>
  );
};
