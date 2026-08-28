import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Award } from 'lucide-react';
import { facultyService } from '../../services/facultyService';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchBar } from '../../components/tables/SearchBar';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { FacultyModal } from './FacultyModal';
import { filterBySearchTerm } from '../../utils/searchUtils';

export const FacultyPage = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const modal = useModal();
  const deleteDialog = useModal();
  const { success, error: toastError } = useToast();

  const loadFaculty = async () => {
    setLoading(true);
    try {
      const data = await facultyService.getFaculty();
      setFaculty(data);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaculty();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.modalData) return;
    try {
      await facultyService.deleteFaculty(deleteDialog.modalData.faculty_id);
      success('Faculty record removed');
      deleteDialog.close();
      loadFaculty();
    } catch (err) {
      toastError(err.message);
    }
  };

  const filtered = filterBySearchTerm(faculty, search, ['name', 'email', 'designation', 'specialization', 'department_name']);

  const columns = [
    {
      key: 'name',
      label: 'Faculty Member',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">{val}</span>
          <span className="text-xs text-slate-400 block">{row.email}</span>
        </div>
      ),
    },
    {
      key: 'designation',
      label: 'Designation',
      render: (val) => <span className="font-medium text-xs text-slate-700">{val}</span>,
    },
    {
      key: 'department_name',
      label: 'Department',
      render: (val) => <span className="text-xs text-slate-700">{val}</span>,
    },
    {
      key: 'specialization',
      label: 'Specialization',
      render: (val) => <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded">{val}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
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
        title="Faculty Members"
        subtitle="Manage academic educators, course leads, and research mentors"
        action={
          <Button variant="primary" size="sm" onClick={() => modal.open(null)} icon={Plus}>
            Add Faculty
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search faculty name, domain, or department..." />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyTitle="No faculty members found"
      />

      <FacultyModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        initialData={modal.modalData}
        onSuccess={loadFaculty}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Delete Faculty Member"
        message={`Are you sure you want to delete ${deleteDialog.modalData?.name}?`}
      />
    </div>
  );
};
