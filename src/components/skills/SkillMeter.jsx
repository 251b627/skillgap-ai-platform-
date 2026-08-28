import React from 'react';
import { PROFICIENCY_LEVELS } from '../../constants/appConstants';
import { cn } from '../../utils/cn';

export const SkillMeter = ({
  skillName,
  currentLevel = 0,
  requiredLevel = 0,
  priority,
  requirementType = 'Mandatory',
}) => {
  const gap = Math.max(0, requiredLevel - currentLevel);
  const currentLabel = PROFICIENCY_LEVELS.find((p) => p.level === currentLevel)?.label || 'None';
  const reqLabel = PROFICIENCY_LEVELS.find((p) => p.level === requiredLevel)?.label || 'None';

  return (
    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-semibold text-sm text-slate-800">{skillName}</span>
          <span className={`text-[10px] ml-2 font-medium px-2 py-0.5 rounded-full ${
            requirementType === 'Mandatory' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
          }`}>
            {requirementType}
          </span>
        </div>
        {gap > 0 ? (
          <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
            Gap: -{gap} Level{gap > 1 ? 's' : ''}
          </span>
        ) : (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            Requirements Met ✓
          </span>
        )}
      </div>

      {/* Visual Levels Bar */}
      <div className="grid grid-cols-5 gap-1.5">
        {[1, 2, 3, 4, 5].map((lvl) => {
          const isStudent = lvl <= currentLevel;
          const isRequired = lvl <= requiredLevel;
          const isMissing = isRequired && !isStudent;

          return (
            <div
              key={lvl}
              className={cn(
                'h-2.5 rounded transition-all',
                isStudent && 'bg-emerald-500',
                isMissing && 'bg-rose-400 animate-pulse',
                !isStudent && !isRequired && 'bg-slate-200'
              )}
              title={`Level ${lvl}`}
            />
          );
        })}
      </div>

      {/* Levels summary */}
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>Current: <strong className="text-slate-700">L{currentLevel} ({currentLabel})</strong></span>
        <span>Target: <strong className="text-slate-700">L{requiredLevel} ({reqLabel})</strong></span>
      </div>
    </div>
  );
};
