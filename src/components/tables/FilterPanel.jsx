import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

export const FilterPanel = ({
  filters = [],
  activeFilters = {},
  onFilterChange,
  onReset,
}) => {
  const hasActiveFilters = Object.values(activeFilters).some((v) => v !== '' && v !== 'all');

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
        <Filter className="w-3.5 h-3.5 text-slate-400" /> Filters:
      </div>

      {filters.map((filter) => (
        <select
          key={filter.key}
          value={activeFilters[filter.key] || 'all'}
          onChange={(e) => onFilterChange(filter.key, e.target.value)}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
        >
          <option value="all">{filter.label}: All</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      {hasActiveFilters && (
        <Button variant="ghost" size="xs" onClick={onReset} icon={RotateCcw}>
          Reset
        </Button>
      )}
    </div>
  );
};
