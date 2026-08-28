import React, { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Filter } from 'lucide-react';
import { skillGapService } from '../../services/skillGapService';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchBar } from '../../components/tables/SearchBar';
import { FilterPanel } from '../../components/tables/FilterPanel';
import { DataTable } from '../../components/tables/DataTable';
import { Badge } from '../../components/common/Badge';
import { filterBySearchTerm } from '../../utils/searchUtils';

export const SkillGapsPage = () => {
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    skillGapService.getAllGapsForActiveApplications().then((res) => {
      setGaps(res);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = filterBySearchTerm(gaps, search, ['student_name', 'opportunity_title', 'skill_name']);
    if (priorityFilter !== 'all') {
      result = result.filter((g) => g.priority.key === priorityFilter);
    }
    return result;
  }, [gaps, search, priorityFilter]);

  const columns = [
    {
      key: 'student_name',
      label: 'Student',
      render: (val) => <span className="font-semibold text-slate-900">{val}</span>,
    },
    {
      key: 'opportunity_title',
      label: 'Target Job',
      render: (val) => <span className="text-xs font-medium text-slate-700">{val}</span>,
    },
    {
      key: 'skill_name',
      label: 'Target Competency',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-800">{val}</span>
          <span className="text-[10px] text-slate-400 block">{row.requirement_type}</span>
        </div>
      ),
    },
    {
      key: 'student_level',
      label: 'Level Comparison',
      render: (_, row) => (
        <div className="text-xs">
          <span>Current: <strong>L{row.student_level}</strong></span> / Target: <strong>L{row.required_level}</strong>
        </div>
      ),
    },
    {
      key: 'gap',
      label: 'Calculated Gap',
      render: (val) => (
        val > 0 ? (
          <span className="font-bold text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded">-{val} Level{val > 1 ? 's' : ''}</span>
        ) : (
          <span className="font-bold text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Met ✓</span>
        )
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (val) => (
        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${val.color}`}>
          {val.label}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detected Skill Gaps Matrix"
        subtitle="Identified technical deficits across submitted candidate applications"
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search student, job, or skill..." />
        <FilterPanel
          filters={[
            {
              key: 'priority',
              label: 'Priority',
              options: [
                { value: 'HIGH', label: 'High Priority (3+ gap)' },
                { value: 'MEDIUM', label: 'Medium Priority (2 gap)' },
                { value: 'LOW', label: 'Low Priority (1 gap)' },
                { value: 'NONE', label: 'No Gap' },
              ],
            },
          ]}
          activeFilters={{ priority: priorityFilter }}
          onFilterChange={(_, v) => setPriorityFilter(v)}
          onReset={() => setPriorityFilter('all')}
        />
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} />
    </div>
  );
};
