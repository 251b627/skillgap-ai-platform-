import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, Compass, Send } from 'lucide-react';
import { opportunityService } from '../../services/opportunityService';
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchBar } from '../../components/tables/SearchBar';
import { FilterPanel } from '../../components/tables/FilterPanel';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { OpportunityModal } from './OpportunityModal';
import { ApplyModal } from '../../components/applications/ApplyModal';
import { formatCurrency } from '../../utils/formatters';
import { filterBySearchTerm } from '../../utils/searchUtils';

export const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ opportunity_type: 'all', mode: 'all' });
  const { user, role } = useAuth();
  const modal = useModal();
  const deleteDialog = useModal();
  const applyModal = useModal();
  const { success, error: toastError } = useToast();

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const data = await opportunityService.getOpportunities();
      setOpportunities(data);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.modalData) return;
    try {
      await opportunityService.deleteOpportunity(deleteDialog.modalData.opportunity_id);
      success('Opportunity deleted');
      deleteDialog.close();
      loadOpportunities();
    } catch (err) {
      toastError(err.message);
    }
  };

  const filtered = useMemo(() => {
    let result = filterBySearchTerm(opportunities, search, ['title', 'company_name', 'location']);
    if (filters.opportunity_type !== 'all') {
      result = result.filter((o) => o.opportunity_type === filters.opportunity_type);
    }
    if (filters.mode !== 'all') {
      result = result.filter((o) => o.mode === filters.mode);
    }
    return result;
  }, [opportunities, search, filters]);

  const filterOptions = [
    {
      key: 'opportunity_type',
      label: 'Type',
      options: [
        { value: 'Internship', label: 'Internship' },
        { value: 'Placement', label: 'Placement' },
        { value: 'Apprenticeship', label: 'Apprenticeship' },
      ],
    },
    {
      key: 'mode',
      label: 'Mode',
      options: [
        { value: 'Remote', label: 'Remote' },
        { value: 'Hybrid', label: 'Hybrid' },
        { value: 'On-site', label: 'On-site' },
      ],
    },
  ];

  const columns = [
    {
      key: 'title',
      label: 'Opportunity',
      render: (val, row) => (
        <div>
          <Link to={`/industry/opportunities/${row.opportunity_id}`} className="font-semibold text-brand-600 hover:underline">
            {val}
          </Link>
          <span className="text-xs text-slate-500 block">{row.company_name} • {row.location}</span>
        </div>
      ),
    },
    {
      key: 'opportunity_type',
      label: 'Type & Mode',
      render: (val, row) => (
        <div className="flex items-center gap-1.5">
          <Badge variant="brand" size="sm">{val}</Badge>
          <span className="text-xs text-slate-500">({row.mode})</span>
        </div>
      ),
    },
    {
      key: 'stipend',
      label: 'Compensation',
      render: (val) => <span className="text-xs font-semibold text-slate-800">{formatCurrency(val)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link to={`/industry/opportunities/${row.opportunity_id}`}>
            <Button variant="ghost" size="xs" icon={Eye}>Details</Button>
          </Link>
          {role === 'STUDENT' ? (
            <Button variant="primary" size="xs" onClick={() => applyModal.open(row)} icon={Send}>
              Apply
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="xs" onClick={() => modal.open(row)} icon={Edit2}>Edit</Button>
              <Button variant="ghost" size="xs" className="text-rose-600 hover:bg-rose-50" onClick={() => deleteDialog.open(row)} icon={Trash2}>
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunities & Job Openings"
        subtitle="Explore active internships, campus placements, and technical apprenticeships"
        action={
          role !== 'STUDENT' && (
            <Button variant="primary" size="sm" onClick={() => modal.open(null)} icon={Plus}>
              Post Opportunity
            </Button>
          )
        }
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search positions, tech, company..." />
        <FilterPanel
          filters={filterOptions}
          activeFilters={filters}
          onFilterChange={(k, v) => setFilters((prev) => ({ ...prev, [k]: v }))}
          onReset={() => setFilters({ opportunity_type: 'all', mode: 'all' })}
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyTitle="No open positions"
      />

      <OpportunityModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        initialData={modal.modalData}
        onSuccess={loadOpportunities}
      />

      <ApplyModal
        isOpen={applyModal.isOpen}
        onClose={applyModal.close}
        opportunity={applyModal.modalData}
        studentId={user?.student_id || 'stud-1'}
        onSuccess={loadOpportunities}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Delete Opportunity"
        message={`Are you sure you want to remove ${deleteDialog.modalData?.title}?`}
      />
    </div>
  );
};
