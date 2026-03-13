import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchTasks, createTask, updateTask, deleteTask, Task } from '@/store/slices/taskSlice';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const STATUS_LABELS: Record<string, string> = { TODO: 'A fazer', IN_PROGRESS: 'Em progresso', REVIEW: 'Em revisão', DONE: 'Concluído' };
const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-600 border-gray-200',
  MEDIUM: 'bg-blue-100 text-blue-700 border-blue-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  URGENT: 'bg-red-100 text-red-700 border-red-200',
};
const STATUS_COLORS: Record<string, string> = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  REVIEW: 'bg-purple-100 text-purple-800',
  DONE: 'bg-green-100 text-green-800',
};

interface CreateForm {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
}

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const { items, loading, total, totalPages, page } = useAppSelector((s) => s.tasks);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({ page: '1', limit: '10' });
  const { register, handleSubmit, reset } = useForm<CreateForm>();

  useEffect(() => { dispatch(fetchTasks(filters)); }, [dispatch, filters]);

  const onCreateSubmit = async (data: CreateForm) => {
    const result = await dispatch(createTask({ title: data.title, description: data.description, priority: data.priority as Task['priority'], dueDate: data.dueDate || undefined }));
    if (createTask.fulfilled.match(result)) {
      toast.success('Tarefa criada!');
      setShowModal(false);
      reset();
      dispatch(fetchTasks(filters));
    }
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    await dispatch(updateTask({ id, status }));
    toast.success('Status atualizado!');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta tarefa?')) return;
    await dispatch(deleteTask(id));
    toast.success('Tarefa excluída!');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-sm text-gray-500">{total} tarefa{total !== 1 ? 's' : ''} no total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Nova tarefa
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <select className="input w-auto" onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: '1' }))}>
          <option value="">Todos os status</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className="input w-auto" onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value, page: '1' }))}>
          <option value="">Todas as prioridades</option>
          {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input className="input w-64" placeholder="Buscar tarefas..." onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: '1' }))} />
      </div>

      {/* Task List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.length === 0 && <div className="card text-center text-gray-400">Nenhuma tarefa encontrada.</div>}
          {items.map((task) => (
            <div key={task.id} className="card flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link to={`/tasks/${task.id}`} className="font-medium text-gray-900 hover:text-brand-600 truncate">
                    {task.title}
                  </Link>
                  <span className={`badge border ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                </div>
                {task.description && <p className="mt-1 text-sm text-gray-500 truncate">{task.description}</p>}
                {task.dueDate && <p className="mt-1 text-xs text-gray-400">Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                  className={`rounded-full border-0 px-3 py-1 text-xs font-medium ${STATUS_COLORS[task.status]}`}
                >
                  {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <button onClick={() => handleDelete(task.id)} className="text-gray-400 hover:text-red-600 transition">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setFilters((f) => ({ ...f, page: String(p) }))}
              className={`h-8 w-8 rounded text-sm font-medium transition ${p === page ? 'bg-brand-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md card">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Nova Tarefa</h2>
            <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Título *</label>
                <input {...register('title', { required: true })} className="input" placeholder="O que precisa ser feito?" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
                <textarea {...register('description')} className="input" rows={3} placeholder="Detalhes da tarefa..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Prioridade</label>
                  <select {...register('priority')} className="input">
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                    <option value="URGENT">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Prazo</label>
                  <input {...register('dueDate')} type="date" className="input" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
