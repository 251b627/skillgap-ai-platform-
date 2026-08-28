import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Layers } from 'lucide-react';
import { trainingService } from '../../services/trainingService';
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/layout/PageHeader';
import { SearchBar } from '../../components/tables/SearchBar';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { TrainingProgramModal } from './TrainingProgramModal';
import { filterBySearchTerm } from '../../utils/searchUtils';

export const TrainingProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user, role } = useAuth();
  const modal = useModal();
  const deleteDialog = useModal();
  const { success, error: toastError } = useToast();

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const data = await trainingService.getTrainingPrograms();
      setPrograms(data);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.modalData) return;
    try {
      await trainingService.deleteTrainingProgram(deleteDialog.modalData.training_id);
      success('Training program removed');
      deleteDialog.close();
      loadPrograms();
    } catch (err) {
      toastError(err.message);
    }
  };

  const handleEnroll = async (prog) => {
    try {
      await trainingService.enrollStudent(user?.student_id || 'stud-1', prog.training_id);
      success(`Enrolled in ${prog.training_name}!`);
      loadPrograms();
    } catch (err) {
      toastError(err.message);
    }
  };

  const filtered = filterBySearchTerm(programs, search, ['training_name', 'provider', 'description']);

  const columns = [
    {
      key: 'training_name',
      label: 'Training Program',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">{val}</span>
          <span className="text-xs text-slate-400 block">{row.provider} • {row.duration_hours} hrs ({row.mode})</span>
        </div>
      ),
    },
    {
      key: 'skills_covered',
      label: 'Target Skills',
      render: (val) => (
        <div className="flex flex-wrap gap-1">
          {val?.map((s, idx) => (
            <Badge key={idx} variant="slate" size="sm">{s}</Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'enrollments_count',
      label: 'Enrolled',
      render: (val) => <span className="text-xs font-semibold text-slate-700">{val} students</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          {role === 'STUDENT' ? (
            <Button variant="primary" size="xs" onClick={() => handleEnroll(row)}>Enroll</Button>
          ) : (
            <>
              <Button variant="ghost" size="xs" onClick={() => modal.open(row)} icon={Edit2}>Edit</Button>
              <Button variant="ghost" size="xs" className="text-rose-600 hover:bg-rose-50" onClick={() => deleteDialog.open(row)} icon={Trash2}>
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training & Upskilling Programs"
        subtitle="Explore specialized courses, industry certifications, and technical bootcamps"
        action={
          role !== 'STUDENT' && (
            <Button variant="primary" size="sm" onClick={() => modal.open(null)} icon={Plus}>
              Create Program
            </Button>
          )
        }
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search training programs or partner..." />
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} />

      <TrainingProgramModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        initialData={modal.modalData}
        onSuccess={loadPrograms}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Delete Training Program"
        message={`Are you sure you want to remove ${deleteDialog.modalData?.training_name}?`}
      />
    </div>
  );
};
