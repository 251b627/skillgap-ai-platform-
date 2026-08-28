import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { applicationService } from '../../../services/applicationService';
import { Card, CardHeader, CardBody } from '../../../components/common/Card';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';

export const ProfileApplicationsTab = ({ studentId }) => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    applicationService.getApplications().then((list) => {
      setApps(list.filter((a) => a.student_id === studentId));
    });
  }, [studentId]);

  if (apps.length === 0) {
    return <p className="text-xs text-slate-400 text-center py-8">No applications submitted yet.</p>;
  }

  return (
    <div className="space-y-4">
      {apps.map((app) => (
        <Card key={app.application_id} className="p-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-800">{app.opportunity_title}</h4>
            <p className="text-xs text-slate-500">{app.company_name} • Applied on {app.applied_at?.split('T')[0]}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={app.current_status} />
            <Link to={`/applications/${app.application_id}`}>
              <Button variant="ghost" size="xs" icon={ArrowRight}>View Timeline</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};
