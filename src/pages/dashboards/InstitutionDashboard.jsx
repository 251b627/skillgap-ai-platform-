import React, { useState, useEffect } from 'react';
import { Network, Users, Award, Handshake, Trophy, Briefcase } from 'lucide-react';
import { departmentService } from '../../services/departmentService';
import { studentService } from '../../services/studentService';
import { facultyService } from '../../services/facultyService';
import { collaborationService } from '../../services/collaborationService';
import { internshipService } from '../../services/internshipService';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { DepartmentDistributionChart } from '../../components/charts/DepartmentDistributionChart';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

export const InstitutionDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [depts, studs, fac, collabs, interns] = await Promise.all([
        departmentService.getDepartments(),
        studentService.getStudents(),
        facultyService.getFaculty(),
        collaborationService.getCollaborations(),
        internshipService.getInternships(),
      ]);

      const deptChart = depts.map((d) => ({
        name: d.department_code,
        students: studs.filter((s) => s.department_id === d.department_id).length,
      }));

      setData({
        deptCount: depts.length,
        studentCount: studs.length,
        facultyCount: fac.length,
        collabCount: collabs.length,
        internCount: interns.length,
        deptChart,
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading || !data) return <TableSkeleton rows={4} cols={3} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution Administrator Dashboard"
        subtitle="Departmental growth, faculty allocation, corporate collaborations, and overall placement outcomes"
      />

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-medium">Departments</p>
          <h4 className="text-2xl font-bold text-slate-900 mt-1">{data.deptCount}</h4>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-medium">Students</p>
          <h4 className="text-2xl font-bold text-brand-600 mt-1">{data.studentCount}</h4>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-medium">Faculty</p>
          <h4 className="text-2xl font-bold text-indigo-600 mt-1">{data.facultyCount}</h4>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-medium">Industry MOUs</p>
          <h4 className="text-2xl font-bold text-teal-600 mt-1">{data.collabCount}</h4>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 font-medium">Placed Candidates</p>
          <h4 className="text-2xl font-bold text-emerald-600 mt-1">{data.internCount}</h4>
        </Card>
      </div>

      <Card>
        <CardHeader title="Student Enrollment per Department" subtitle="Departmental distribution of registered students" />
        <CardBody>
          <DepartmentDistributionChart data={data.deptChart} />
        </CardBody>
      </Card>
    </div>
  );
};
