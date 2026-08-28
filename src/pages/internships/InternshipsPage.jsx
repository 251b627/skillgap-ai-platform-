import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Building, UserCheck } from 'lucide-react';
import { internshipService } from '../../services/internshipService';
import { PageHeader } from '../../components/layout/PageHeader';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/tables/SearchBar';
import { filterBySearchTerm } from '../../utils/searchUtils';

export const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    internshipService.getInternships().then((res) => {
      setInternships(res);
      setLoading(false);
    });
  }, []);

  const filtered = filterBySearchTerm(internships, search, ['student_name', 'company_name', 'opportunity_title', 'mentor_name']);

  const columns = [
    {
      key: 'student_name',
      label: 'Selected Student',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">{val}</span>
          <span className="text-xs text-slate-400 block">{row.student_email}</span>
        </div>
      ),
    },
    {
      key: 'opportunity_title',
      label: 'Role & Placement',
      render: (val, row) => (
        <div>
          <span className="font-medium text-slate-800">{val}</span>
          <span className="text-xs text-brand-600 block">{row.company_name}</span>
        </div>
      ),
    },
    {
      key: 'mentor_name',
      label: 'Corporate Mentor',
      render: (val) => <span className="text-xs text-slate-700">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'start_date',
      label: 'Term Dates',
      render: (val, row) => <span className="text-xs text-slate-500">{val} to {row.end_date || 'Ongoing'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Confirmed Internships & Corporate Placements"
        subtitle="Live registry of students hired through application selection pipelines"
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search placed student or employer..." />
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} />
    </div>
  );
};
