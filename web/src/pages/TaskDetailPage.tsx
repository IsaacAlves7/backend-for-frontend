import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchTaskById, deleteTask } from '@/store/slices/taskSlice';
import toast from 'react-hot-toast';

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-700', MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700', URGENT: 'bg-red-100 text-red-700',
};
const STATUS_LABELS: Record<string, string> = {
  TODO: 'A fazer', IN_PROGRESS: 'Em progresso', REVIEW: 'Em revisão', DONE: 'Concluído',
};

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const task = useAppSelector((s) => s.tasks.selected);

  useEffect(() => { if (id) dispatch(fetchTaskById(id)); }, [id, dispatch]);

  const handleDelete = async () => {
    if (!task || !confirm('Excluir esta tarefa?')) return;
    await dispatch(deleteTask(task.id));
    toast.success('Tarefa excluída!');
    navigate('/tasks');
  };

  if (!task) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link to="/tasks" className="text-sm text-brand-600 hover:text-brand-700">← Voltar para tarefas</Link>
      </div>

      <div className="card">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-900">{task.title}</h1>
          <button onClick={handleDelete} className="btn-danger shrink-0 text-sm">Excluir</button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className={`badge ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
          <span className="badge bg-gray-100 text-gray-700">{STATUS_LABELS[task.status]}</span>
          {task.tags?.map((tag: string) => (
            <span key={tag} className="badge bg-brand-50 text-brand-700">{tag}</span>
          ))}
        </div>

        {task.description && (
          <p className="mb-4 text-sm text-gray-600 leading-relaxed">{task.description}</p>
        )}

        <div className="border-t border-gray-100 pt-4 text-sm text-gray-500 space-y-1">
          {task.dueDate && <p>Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</p>}
          <p>Criado em: {new Date(task.createdAt).toLocaleDateString('pt-BR')}</p>
          <p>Atualizado em: {new Date(task.updatedAt).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}
