import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/api/client';
import { useAppSelector } from '@/hooks/redux';

const STATUS_LABELS: Record<string, string> = { TODO: 'A fazer', IN_PROGRESS: 'Em progresso', REVIEW: 'Em revisão', DONE: 'Concluído' };
const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
};

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard');
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  const stats = data?.taskStats;
  const statCards = [
    { label: 'Total', value: stats?.total ?? 0, color: 'bg-gray-50 border-gray-200' },
    { label: 'A fazer', value: stats?.todo ?? 0, color: 'bg-blue-50 border-blue-200' },
    { label: 'Em progresso', value: stats?.inProgress ?? 0, color: 'bg-yellow-50 border-yellow-200' },
    { label: 'Concluído', value: stats?.done ?? 0, color: 'bg-green-50 border-green-200' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {user?.name?.split(' ')[0] ?? 'usuário'} 👋
        </h1>
        <p className="mt-1 text-gray-500">Aqui está um resumo do seu trabalho hoje.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className={`rounded-xl border p-6 ${s.color}`}>
            <p className="text-sm font-medium text-gray-600">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Tasks */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Tarefas recentes</h2>
            <Link to="/tasks" className="text-sm text-brand-600 hover:text-brand-700">Ver todas →</Link>
          </div>
          <div className="space-y-3">
            {(data?.recentTasks ?? []).length === 0 && (
              <p className="text-sm text-gray-400">Nenhuma tarefa ainda.</p>
            )}
            {(data?.recentTasks ?? []).map((task: { id: string; title: string; priority: string; status: string }) => (
              <Link key={task.id} to={`/tasks/${task.id}`} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition hover:bg-gray-50">
                <span className="text-sm font-medium text-gray-800 truncate">{task.title}</span>
                <div className="ml-3 flex shrink-0 items-center gap-2">
                  <span className={`badge ${PRIORITY_COLORS[task.priority] ?? ''}`}>{task.priority}</span>
                  <span className="text-xs text-gray-400">{STATUS_LABELS[task.status]}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Notifications preview */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Notificações não lidas</h2>
            <Link to="/notifications" className="text-sm text-brand-600 hover:text-brand-700">Ver todas →</Link>
          </div>
          {data?.unreadNotifications > 0 ? (
            <div className="flex items-center gap-3 rounded-lg bg-brand-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100">
                <span className="text-lg font-bold text-brand-600">{data.unreadNotifications}</span>
              </div>
              <p className="text-sm text-brand-800">
                Você tem <strong>{data.unreadNotifications}</strong> notificação{data.unreadNotifications > 1 ? 'ões' : ''} não lida{data.unreadNotifications > 1 ? 's' : ''}.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Nenhuma notificação pendente. 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}
