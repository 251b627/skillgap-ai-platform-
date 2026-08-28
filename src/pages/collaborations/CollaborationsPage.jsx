import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Handshake, Building, Landmark } from 'lucide-react';
import { collaborationService } from '../../services/collaborationService';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchBar } from '../../components/tables/SearchBar';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { CollaborationModal } from './CollaborationModal';
import { filterBySearchTerm } from '../../utils/searchUtils';

export const CollaborationsPage = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const modal = useModal();
  const deleteDialog = useModal();
  const { success, error: toastError } = useToast();

  const loadCollaborations = async () => {
    setLoading(true);
    try {
      const data = await collaborationService.getCollaborations();
      setCollaborations(data);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollaborations();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.modalData) return;
    try {
      await collaborationService.deleteCollaboration(deleteDialog.modalData.collaboration_id);
      success('Collaboration agreement deleted');
      deleteDialog.close();
      loadCollaborations();
    } catch (err) {
      toastError(err.message);
    }
  };

  const filtered = filterBySearchTerm(collaborations, search, ['collaboration_type', 'company_name', 'institution_name', 'description']);

  const columns = [
    {
      key: 'collaboration_type',
      label: 'Partnership Program',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">{val}</span>
          <span className="text-xs text-slate-400 block max-w-sm truncate">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'institution_name',
      label: 'Academic Institution',
      render: (val) => <span className="font-medium text-xs text-slate-800">{val}</span>,
    },
    {
      key: 'company_name',
      label: 'Industry Partner',
      render: (val) => <span className="font-medium text-xs text-brand-700">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'start_date',
      label: 'Tenure',
      render: (val, row) => <span className="text-xs text-slate-500">{val} - {row.end_date || 'Ongoing'}</span>,
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
        title="Academia–Industry Collaborations & MOUs"
        subtitle="Formal partnerships between academic institutes and global tech enterprises"
        action={
          <Button variant="primary" size="sm" onClick={() => modal.open(null)} icon={Plus}>
            Establish Partnership
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search MOUs, partners, or universities..." />
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} />

      <CollaborationModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        initialData={modal.modalData}
        onSuccess={loadCollaborations}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Delete Partnership Agreement"
        message={`Are you sure you want to remove the MOU with ${deleteDialog.modalData?.company_name}?`}
      />
    </div>
  );
};
