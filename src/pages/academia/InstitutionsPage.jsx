import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Globe, Building2, Users, Award } from 'lucide-react';
import { institutionService } from '../../services/institutionService';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchBar } from '../../components/tables/SearchBar';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { InstitutionModal } from './InstitutionModal';
import { filterBySearchTerm } from '../../utils/searchUtils';

export const InstitutionsPage = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const modal = useModal();
  const deleteDialog = useModal();
  const { success, error: toastError } = useToast();

  const loadInstitutions = async () => {
    setLoading(true);
    try {
      const data = await institutionService.getInstitutions();
      setInstitutions(data);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstitutions();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.modalData) return;
    try {
      await institutionService.deleteInstitution(deleteDialog.modalData.institution_id);
      success('Institution deleted successfully');
      deleteDialog.close();
      loadInstitutions();
    } catch (err) {
      toastError(err.message);
    }
  };

  const filtered = filterBySearchTerm(institutions, search, ['institution_name', 'institution_code', 'city', 'state']);

  const columns = [
    {
      key: 'institution_name',
      label: 'Institution',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">{val}</span>
          <span className="text-xs text-slate-400 block">{row.city}, {row.state}</span>
        </div>
      ),
    },
    {
      key: 'institution_code',
      label: 'Code',
      render: (val) => <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">{val}</span>,
    },
    {
      key: 'department_count',
      label: 'Departments',
      render: (val) => <span className="font-semibold text-slate-700">{val} depts</span>,
    },
    {
      key: 'student_count',
      label: 'Students',
      render: (val) => <span className="text-slate-700">{val}</span>,
    },
    {
      key: 'faculty_count',
      label: 'Faculty',
      render: (val) => <span className="text-slate-700">{val}</span>,
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
        title="Institutions Directory"
        subtitle="Manage recognized universities, technical institutes, and affiliated campus nodes"
        action={
          <Button variant="primary" size="sm" onClick={() => modal.open(null)} icon={Plus}>
            Add Institution
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, code, or city..." />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyTitle="No institutions found"
        emptyDescription="Get started by adding your first academic institution."
      />

      <InstitutionModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        initialData={modal.modalData}
        onSuccess={loadInstitutions}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Delete Institution"
        message={`Are you sure you want to remove ${deleteDialog.modalData?.institution_name}? This will affect related department records.`}
      />
    </div>
  );
};
