import React from 'react';
import { Star } from 'lucide-react';
import { PROFICIENCY_LEVELS } from '../../constants/appConstants';
import { cn } from '../../utils/cn';

export const ProficiencySelector = ({ value = 1, onChange, disabled = false }) => {
  const currentProf = PROFICIENCY_LEVELS.find((p) => p.level === Number(value)) || PROFICIENCY_LEVELS[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        {PROFICIENCY_LEVELS.map((item) => {
          const isSelected = item.level <= Number(value);
          return (
            <button
              key={item.level}
              type="button"
              disabled={disabled}
              onClick={() => onChange(item.level)}
              className={cn(
                'p-1.5 rounded-lg border transition-all text-xs font-semibold flex items-center gap-1',
                isSelected
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
              )}
              title={`${item.level} - ${item.label}: ${item.description}`}
            >
              <Star className={cn('w-3.5 h-3.5', isSelected ? 'fill-white' : 'text-slate-300')} />
              <span>{item.level}</span>
            </button>
          );
        })}
      </div>
      <div className="text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Level {currentProf.level} ({currentProf.label}): </span>
        <span>{currentProf.description}</span>
      </div>
    </div>
  );
};
