import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, UserCheck } from 'lucide-react';
import { studentService } from '../../services/studentService';
import { departmentService } from '../../services/departmentService';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchBar } from '../../components/tables/SearchBar';
import { FilterPanel } from '../../components/tables/FilterPanel';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StudentModal } from './StudentModal';
import { filterBySearchTerm } from '../../utils/searchUtils';

export const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ department_id: 'all', year: 'all' });
  const modal = useModal();
  const deleteDialog = useModal();
  const { success, error: toastError } = useToast();

  const loadStudents = async () => {
    setLoading(true);
    try {
      const [sData, dData] = await Promise.all([
        studentService.getStudents(),
        departmentService.getDepartments(),
      ]);
      setStudents(sData);
      setDepartments(dData);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.modalData) return;
    try {
      await studentService.deleteStudent(deleteDialog.modalData.student_id);
      success('Student record deleted');
      deleteDialog.close();
      loadStudents();
    } catch (err) {
      toastError(err.message);
    }
  };

  const filtered = useMemo(() => {
    let result = filterBySearchTerm(students, search, ['name', 'email', 'enrollment_no', 'department_name']);
    if (filters.department_id !== 'all') {
      result = result.filter((s) => s.department_id === filters.department_id);
    }
    if (filters.year !== 'all') {
      result = result.filter((s) => String(s.year) === filters.year);
    }
    return result;
  }, [students, search, filters]);

  const filterOptions = [
    {
      key: 'department_id',
      label: 'Department',
      options: departments.map((d) => ({ value: d.department_id, label: d.department_code })),
    },
    {
      key: 'year',
      label: 'Academic Year',
      options: [
        { value: '1', label: '1st Year' },
        { value: '2', label: '2nd Year' },
        { value: '3', label: '3rd Year' },
        { value: '4', label: '4th Year' },
      ],
    },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Student',
      render: (val, row) => (
        <div>
          <Link to={`/academia/students/${row.student_id}`} className="font-semibold text-brand-600 hover:underline">
            {val}
          </Link>
          <span className="text-xs text-slate-400 block">{row.email}</span>
        </div>
      ),
    },
    {
      key: 'enrollment_no',
      label: 'Enrollment No',
      render: (val) => <span className="font-mono text-xs font-semibold text-slate-600">{val}</span>,
    },
    {
      key: 'department_name',
      label: 'Department',
      render: (_, row) => <span className="text-xs font-medium text-slate-700">{row.department_code}</span>,
    },
    {
      key: 'year',
      label: 'Year / Sem',
      render: (val, row) => <span className="text-xs text-slate-700">Yr {val}, Sem {row.semester}</span>,
    },
    {
      key: 'cgpa',
      label: 'CGPA',
      render: (val) => <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{val}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <Link to={`/academia/students/${row.student_id}`}>
            <Button variant="ghost" size="xs" icon={Eye}>Profile</Button>
          </Link>
          <Button variant="ghost" size="xs" onClick={() => modal.open(row)} icon={Edit2}>Edit</Button>
          <Button variant="ghost" size="xs" className="text-rose-600 hover:bg-rose-50" onClick={() => deleteDialog.open(row)} icon={Trash2}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrolled Students Roster"
        subtitle="Manage student profiles, performance records, and career readiness tracking"
        action={
          <Button variant="primary" size="sm" onClick={() => modal.open(null)} icon={Plus}>
            Add Student
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search student name, email, or enrollment #..." />
        <FilterPanel
          filters={filterOptions}
          activeFilters={filters}
          onFilterChange={(k, v) => setFilters((prev) => ({ ...prev, [k]: v }))}
          onReset={() => setFilters({ department_id: 'all', year: 'all' })}
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyTitle="No students found"
        emptyDescription="No registered students matched your filters."
      />

      <StudentModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        initialData={modal.modalData}
        onSuccess={loadStudents}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Delete Student Record"
        message={`Are you sure you want to remove ${deleteDialog.modalData?.name}? This will remove associated records.`}
      />
    </div>
  );
};
