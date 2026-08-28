import React from 'react';
import { Mail, Phone, Building2, Calendar, Award, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/common/Card';

export const ProfileOverviewTab = ({ student }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader title="Contact & Personal Information" />
        <CardBody className="space-y-4 text-sm">
          <div className="flex items-center gap-3 text-slate-600">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{student.email}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{student.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{student.institution_name}</span>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Academic Standing" />
        <CardBody className="space-y-4 text-sm">
          <div className="flex justify-between items-center py-1 border-b border-slate-100">
            <span className="text-slate-500">Department</span>
            <span className="font-semibold text-slate-800">{student.department_name} ({student.department_code})</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-100">
            <span className="text-slate-500">Current Year & Semester</span>
            <span className="font-semibold text-slate-800">Year {student.year}, Semester {student.semester}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-100">
            <span className="text-slate-500">Expected Graduation</span>
            <span className="font-semibold text-slate-800">{student.graduation_year}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-500">Cumulative GPA</span>
            <span className="font-bold text-emerald-600 text-base">{student.cgpa} / 10.0</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
