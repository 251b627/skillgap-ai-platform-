import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Boxes } from 'lucide-react';
import { skillService } from '../../services/skillService';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchBar } from '../../components/tables/SearchBar';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/forms/FormInput';
import { FormTextarea } from '../../components/forms/FormTextarea';
import { filterBySearchTerm } from '../../utils/searchUtils';

export const SkillCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const modal = useModal();
  const deleteDialog = useModal();
  const { success, error: toastError } = useToast();

  const loadCategories = async () => {
    setLoading(true);
    const data = await skillService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setName(cat.category_name);
      setDesc(cat.description || '');
    } else {
      setName('');
      setDesc('');
    }
    modal.open(cat);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (modal.modalData) {
        await skillService.updateCategory(modal.modalData.category_id, { category_name: name, description: desc });
        success('Category updated');
      } else {
        await skillService.createCategory({ category_name: name, description: desc });
        success('Category created');
      }
      modal.close();
      loadCategories();
    } catch (err) {
      toastError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.modalData) return;
    await skillService.deleteCategory(deleteDialog.modalData.category_id);
    success('Category deleted');
    deleteDialog.close();
    loadCategories();
  };

  const filtered = filterBySearchTerm(categories, search, ['category_name', 'description']);

  const columns = [
    {
      key: 'category_name',
      label: 'Category Name',
      render: (val) => <span className="font-semibold text-slate-900">{val}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (val) => <span className="text-xs text-slate-500 max-w-xs truncate block">{val}</span>,
    },
    {
      key: 'skill_count',
      label: 'Skills Count',
      render: (val) => <span className="font-medium text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{val} skills</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button variant="ghost" size="xs" onClick={() => handleOpenModal(row)} icon={Edit2}>Edit</Button>
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
        title="Skill Categories"
        subtitle="Organize technical disciplines and competency domain taxonomies"
        action={
          <Button variant="primary" size="sm" onClick={() => handleOpenModal(null)} icon={Plus}>
            Add Category
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search categories..." />
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} />

      <Modal isOpen={modal.isOpen} onClose={modal.close} title={modal.modalData ? 'Edit Category' : 'Add Skill Category'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormInput label="Category Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cloud & DevOps" />
          <FormTextarea label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Overview of covered technologies..." />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={modal.close}>Cancel</Button>
            <Button type="submit" variant="primary">Save Category</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to remove ${deleteDialog.modalData?.category_name}?`}
      />
    </div>
  );
};
