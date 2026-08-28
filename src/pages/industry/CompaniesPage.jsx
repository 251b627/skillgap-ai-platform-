import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Globe, Building } from 'lucide-react';
import { companyService } from '../../services/companyService';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchBar } from '../../components/tables/SearchBar';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { CompanyModal } from './CompanyModal';
import { filterBySearchTerm } from '../../utils/searchUtils';

export const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const modal = useModal();
  const deleteDialog = useModal();
  const { success, error: toastError } = useToast();

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await companyService.getCompanies();
      setCompanies(data);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.modalData) return;
    try {
      await companyService.deleteCompany(deleteDialog.modalData.company_id);
      success('Company removed');
      deleteDialog.close();
      loadCompanies();
    } catch (err) {
      toastError(err.message);
    }
  };

  const filtered = filterBySearchTerm(companies, search, ['company_name', 'industry_type', 'location', 'email']);

  const columns = [
    {
      key: 'company_name',
      label: 'Company',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">{val}</span>
          <span className="text-xs text-slate-400 block">{row.location}</span>
        </div>
      ),
    },
    {
      key: 'industry_type',
      label: 'Industry Domain',
      render: (val) => <span className="text-xs font-medium text-slate-700">{val}</span>,
    },
    {
      key: 'active_opportunities_count',
      label: 'Open Roles',
      render: (val) => <span className="font-bold text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded">{val} open</span>,
    },
    {
      key: 'recruiters_count',
      label: 'Talent Leads',
      render: (val) => <span className="text-xs text-slate-600">{val} recruiters</span>,
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
        title="Corporate Partners & Companies"
        subtitle="Manage hiring partners, recruiting organizations, and enterprise employers"
        action={
          <Button variant="primary" size="sm" onClick={() => modal.open(null)} icon={Plus}>
            Add Company
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by company or industry..." />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyTitle="No companies found"
      />

      <CompanyModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        initialData={modal.modalData}
        onSuccess={loadCompanies}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Delete Company"
        message={`Are you sure you want to remove ${deleteDialog.modalData?.company_name}?`}
      />
    </div>
  );
};
