import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Network } from 'lucide-react';
import { departmentService } from '../../services/departmentService';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchBar } from '../../components/tables/SearchBar';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { DepartmentModal } from './DepartmentModal';
import { filterBySearchTerm } from '../../utils/searchUtils';

export const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const modal = useModal();
  const deleteDialog = useModal();
  const { success, error: toastError } = useToast();

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.modalData) return;
    try {
      await departmentService.deleteDepartment(deleteDialog.modalData.department_id);
      success('Department removed successfully');
      deleteDialog.close();
      loadDepartments();
    } catch (err) {
      toastError(err.message);
    }
  };

  const filtered = filterBySearchTerm(departments, search, ['department_name', 'department_code', 'institution_name']);

  const columns = [
    {
      key: 'department_name',
      label: 'Department',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">{val}</span>
          <span className="text-xs text-brand-600 block">{row.institution_name}</span>
        </div>
      ),
    },
    {
      key: 'department_code',
      label: 'Code',
      render: (val) => <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{val}</span>,
    },
    {
      key: 'student_count',
      label: 'Students Enrolled',
      render: (val) => <span className="font-medium text-slate-700">{val} students</span>,
    },
    {
      key: 'faculty_count',
      label: 'Faculty Assigned',
      render: (val) => <span className="font-medium text-slate-700">{val} faculty</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button variant="ghost" size="xs" onClick={() => modal.open(row)} icon={Edit2}>
            Edit
          </Button>
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
        title="Academic Departments"
        subtitle="Manage academic faculties, curriculum branches, and departmental student rosters"
        action={
          <Button variant="primary" size="sm" onClick={() => modal.open(null)} icon={Plus}>
            Add Department
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by department name or code..." />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyTitle="No departments found"
        emptyDescription="Create your first academic department to group courses and student cohorts."
      />

      <DepartmentModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        initialData={modal.modalData}
        onSuccess={loadDepartments}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Delete Department"
        message={`Are you sure you want to delete ${deleteDialog.modalData?.department_name}?`}
      />
    </div>
  );
};
