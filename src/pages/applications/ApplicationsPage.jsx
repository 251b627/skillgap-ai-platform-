import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, CheckCircle, Clock } from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { opportunityService } from '../../services/opportunityService';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchBar } from '../../components/tables/SearchBar';
import { FilterPanel } from '../../components/tables/FilterPanel';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { ApplicationStatusModal } from '../../components/applications/ApplicationStatusModal';
import { filterBySearchTerm } from '../../utils/searchUtils';
import { formatDate } from '../../utils/formatters';

export const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [oppFilter, setOppFilter] = useState('all');
  const statusModal = useModal();
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    const [apps, opps] = await Promise.all([
      applicationService.getApplications(),
      opportunityService.getOpportunities(),
    ]);
    setApplications(apps);
    setOpportunities(opps);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    let result = filterBySearchTerm(applications, search, ['student_name', 'student_email', 'opportunity_title', 'company_name']);
    if (statusFilter !== 'all') {
      result = result.filter((a) => a.current_status === statusFilter);
    }
    if (oppFilter !== 'all') {
      result = result.filter((a) => a.opportunity_id === oppFilter);
    }
    return result;
  }, [applications, search, statusFilter, oppFilter]);

  const filterOptions = [
    {
      key: 'status',
      label: 'Stage',
      options: [
        { value: 'Applied', label: 'Applied' },
        { value: 'Shortlisted', label: 'Shortlisted' },
        { value: 'Assessment', label: 'Assessment' },
        { value: 'Interview', label: 'Interview' },
        { value: 'Selected', label: 'Selected' },
        { value: 'Rejected', label: 'Rejected' },
      ],
    },
    {
      key: 'opp',
      label: 'Opportunity',
      options: opportunities.map((o) => ({ value: o.opportunity_id, label: o.title })),
    },
  ];

  const columns = [
    {
      key: 'student_name',
      label: 'Candidate',
      render: (val, row) => (
        <div>
          <Link to={`/academia/students/${row.student_id}`} className="font-semibold text-brand-600 hover:underline">
            {val}
          </Link>
          <span className="text-xs text-slate-400 block">{row.student_email} • CGPA {row.student_cgpa}</span>
        </div>
      ),
    },
    {
      key: 'opportunity_title',
      label: 'Target Position',
      render: (val, row) => (
        <div>
          <span className="font-medium text-slate-800">{val}</span>
          <span className="text-xs text-slate-400 block">{row.company_name}</span>
        </div>
      ),
    },
    {
      key: 'applied_at',
      label: 'Date Submitted',
      render: (val) => <span className="text-xs text-slate-500">{formatDate(val)}</span>,
    },
    {
      key: 'current_status',
      label: 'Application Stage',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link to={`/applications/${row.application_id}`}>
            <Button variant="ghost" size="xs" icon={Eye}>Timeline</Button>
          </Link>
          <Button variant="outline" size="xs" onClick={() => statusModal.open(row)} icon={Edit3}>
            Update Stage
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Application Pipeline"
        subtitle="Review student submissions, evaluate skill alignments, and advance hiring stages"
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search candidate or position..." />
        <FilterPanel
          filters={filterOptions}
          activeFilters={{ status: statusFilter, opp: oppFilter }}
          onFilterChange={(k, v) => (k === 'status' ? setStatusFilter(v) : setOppFilter(v))}
          onReset={() => { setStatusFilter('all'); setOppFilter('all'); }}
        />
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} />

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
