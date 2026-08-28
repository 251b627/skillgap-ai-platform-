import React from 'react';
import { Badge } from './Badge';

/**
 * Maps system statuses to distinctive, semantic color badges.
 */
export const StatusBadge = ({ status, size = 'md' }) => {
  const statusMap = {
    // Opportunities
    Open: { variant: 'emerald', label: 'Open' },
    Draft: { variant: 'slate', label: 'Draft' },
    Closed: { variant: 'rose', label: 'Closed' },
    Expired: { variant: 'amber', label: 'Expired' },

    // Applications
    Applied: { variant: 'slate', label: 'Applied' },
    Shortlisted: { variant: 'brand', label: 'Shortlisted' },
    Assessment: { variant: 'indigo', label: 'Assessment' },
    Interview: { variant: 'purple', label: 'Interview' },
    Selected: { variant: 'emerald', label: 'Selected' },
    Rejected: { variant: 'rose', label: 'Rejected' },

    // Training & Enrollments
    Upcoming: { variant: 'slate', label: 'Upcoming' },
    Ongoing: { variant: 'brand', label: 'Ongoing' },
    Enrolled: { variant: 'slate', label: 'Enrolled' },
    'In Progress': { variant: 'brand', label: 'In Progress' },
    Completed: { variant: 'emerald', label: 'Completed' },
    Dropped: { variant: 'rose', label: 'Dropped' },

    // General
    Active: { variant: 'emerald', label: 'Active' },
    Inactive: { variant: 'slate', label: 'Inactive' },
    Pending: { variant: 'amber', label: 'Pending' },
  };

  const config = statusMap[status] || { variant: 'slate', label: status || 'Unknown' };

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
};
