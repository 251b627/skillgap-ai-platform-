import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Building, User } from 'lucide-react';
import { internshipService } from '../../../services/internshipService';
import { Card, CardHeader, CardBody } from '../../../components/common/Card';
import { StatusBadge } from '../../../components/common/StatusBadge';

export const ProfileInternshipsTab = ({ studentId }) => {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    internshipService.getInternships().then((list) => {
      setInternships(list.filter((i) => i.student_id === studentId));
    });
  }, [studentId]);

  if (internships.length === 0) {
    return <p className="text-xs text-slate-400 text-center py-8">No placement or internship records on file.</p>;
  }

  return (
    <div className="space-y-4">
      {internships.map((item) => (
        <Card key={item.internship_id} className="p-5 space-y-4 border-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">{item.opportunity_title}</h4>
                <p className="text-xs text-slate-500">{item.company_name} • {item.opportunity_type}</p>
              </div>
            </div>
            <StatusBadge status={item.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl">
            <div>
              <span className="text-slate-400 block">Assigned Mentor:</span>
              <span className="font-semibold text-slate-800">{item.mentor_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Tenure:</span>
              <span className="font-semibold text-slate-800">{item.start_date} to {item.end_date || 'Ongoing'}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 italic">"{item.final_evaluation}"</p>
        </Card>
      ))}
    </div>
  );
};
