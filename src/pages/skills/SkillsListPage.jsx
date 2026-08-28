import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Cpu } from 'lucide-react';
import { skillService } from '../../services/skillService';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchBar } from '../../components/tables/SearchBar';
import { FilterPanel } from '../../components/tables/FilterPanel';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { FormTextarea } from '../../components/forms/FormTextarea';
import { filterBySearchTerm } from '../../utils/searchUtils';

export const SkillsListPage = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [desc, setDesc] = useState('');

  const modal = useModal();
  const deleteDialog = useModal();
  const { success, error: toastError } = useToast();

  const loadSkills = async () => {
    setLoading(true);
    const [sData, cData] = await Promise.all([
      skillService.getSkills(),
      skillService.getCategories(),
    ]);
    setSkills(sData);
    setCategories(cData);
    setLoading(false);
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleOpenModal = (sk = null) => {
    if (sk) {
      setName(sk.skill_name);
      setCategoryId(sk.category_id || '');
      setDesc(sk.description || '');
    } else {
      setName('');
      setCategoryId(categories[0]?.category_id || '');
      setDesc('');
    }
    modal.open(sk);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    try {
      if (modal.modalData) {
        await skillService.updateSkill(modal.modalData.skill_id, {
          skill_name: name,
          category_id: categoryId,
          description: desc,
        });
        success('Skill updated');
      } else {
        await skillService.createSkill({
          skill_name: name,
          category_id: categoryId,
          description: desc,
        });
        success('Skill added to library');
      }
      modal.close();
      loadSkills();
    } catch (err) {
      toastError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.modalData) return;
    await skillService.deleteSkill(deleteDialog.modalData.skill_id);
    success('Skill removed');
    deleteDialog.close();
    loadSkills();
  };

  const filtered = useMemo(() => {
    let result = filterBySearchTerm(skills, search, ['skill_name', 'description', 'category_name']);
    if (catFilter !== 'all') {
      result = result.filter((s) => s.category_id === catFilter);
    }
    return result;
  }, [skills, search, catFilter]);

  const columns = [
    {
      key: 'skill_name',
      label: 'Skill Name',
      render: (val) => <span className="font-semibold text-slate-900">{val}</span>,
    },
    {
      key: 'category_name',
      label: 'Category',
      render: (val) => <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">{val}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (val) => <span className="text-xs text-slate-500 max-w-sm truncate block">{val}</span>,
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
        title="Skills Library"
        subtitle="Global directory of technical and professional skills assessed across the platform"
        action={
          <Button variant="primary" size="sm" onClick={() => handleOpenModal(null)} icon={Plus}>
            Add Skill
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search skills library..." />
        <FilterPanel
          filters={[{ key: 'cat', label: 'Category', options: categories.map((c) => ({ value: c.category_id, label: c.category_name })) }]}
          activeFilters={{ cat: catFilter }}
          onFilterChange={(_, v) => setCatFilter(v)}
          onReset={() => setCatFilter('all')}
        />
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} />

      <Modal isOpen={modal.isOpen} onClose={modal.close} title={modal.modalData ? 'Edit Skill' : 'Add New Skill'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormInput label="Skill Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. PyTorch" />
          <FormSelect
            label="Category"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categories.map((c) => ({ value: c.category_id, label: c.category_name }))}
          />
          <FormTextarea label="Skill Scope & Overview" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description of topics and techniques..." />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={modal.close}>Cancel</Button>
            <Button type="submit" variant="primary">Save Skill</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Delete Skill"
        message={`Are you sure you want to remove ${deleteDialog.modalData?.skill_name}?`}
      />
    </div>
  );
};
