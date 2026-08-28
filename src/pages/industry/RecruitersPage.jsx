import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { recruiterService } from '../../services/recruiterService';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchBar } from '../../components/tables/SearchBar';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { RecruiterModal } from './RecruiterModal';
import { filterBySearchTerm } from '../../utils/searchUtils';

export const RecruitersPage = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const modal = useModal();
  const deleteDialog = useModal();
  const { success, error: toastError } = useToast();

  const loadRecruiters = async () => {
    setLoading(true);
    try {
      const data = await recruiterService.getRecruiters();
      setRecruiters(data);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecruiters();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.modalData) return;
    try {
      await recruiterService.deleteRecruiter(deleteDialog.modalData.recruiter_id);
      success('Recruiter removed');
      deleteDialog.close();
      loadRecruiters();
    } catch (err) {
      toastError(err.message);
    }
  };

  const filtered = filterBySearchTerm(recruiters, search, ['name', 'email', 'company_name', 'designation']);

  const columns = [
    {
      key: 'name',
      label: 'Recruiter',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">{val}</span>
          <span className="text-xs text-slate-400 block">{row.email}</span>
        </div>
      ),
    },
    {
      key: 'company_name',
      label: 'Company',
      render: (val) => <span className="font-medium text-xs text-slate-800">{val}</span>,
    },
    {
      key: 'designation',
      label: 'Designation',
      render: (val) => <span className="text-xs text-slate-600">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} size="sm" />,
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
        title="Industry Recruiters"
        subtitle="Manage verified talent acquisition leads from registered partner employers"
        action={
          <Button variant="primary" size="sm" onClick={() => modal.open(null)} icon={Plus}>
            Add Recruiter
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by recruiter name or company..." />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyTitle="No recruiters found"
      />

      <RecruiterModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        initialData={modal.modalData}
        onSuccess={loadRecruiters}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Delete Recruiter"
        message={`Are you sure you want to remove recruiter ${deleteDialog.modalData?.name}?`}
      />
    </div>
  );
};
