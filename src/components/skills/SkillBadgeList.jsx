import React from 'react';
import { Badge } from '../common/Badge';

export const SkillBadgeList = ({ skills = [], maxDisplay = 4 }) => {
  if (!skills || skills.length === 0) {
    return <span className="text-xs text-slate-400">No skills listed</span>;
  }

  const displayed = skills.slice(0, maxDisplay);
  const remaining = skills.length - maxDisplay;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {displayed.map((s, idx) => {
        const name = typeof s === 'string' ? s : s.skill_name;
        const level = typeof s === 'object' && s.proficiency_level ? `L${s.proficiency_level}` : null;
        return (
          <Badge key={idx} variant="slate" size="sm">
            <span>{name}</span>
            {level && <span className="ml-1 font-bold text-brand-600">({level})</span>}
          </Badge>
        );
      })}
      {remaining > 0 && (
        <span className="text-xs text-slate-400 font-medium">+{remaining} more</span>
      )}
    </div>
  );
};
