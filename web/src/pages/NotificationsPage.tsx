import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchNotifications, markRead, markAllRead } from '@/store/slices/notificationSlice';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, unreadCount } = useAppSelector((s) => s.notifications);

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  const handleMarkAll = async () => {
    await dispatch(markAllRead());
    toast.success('Todas marcadas como lidas!');
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
          {unreadCount > 0 && <p className="text-sm text-gray-500">{unreadCount} não lida{unreadCount > 1 ? 's' : ''}</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAll} className="btn-secondary text-sm">Marcar todas como lidas</button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.length === 0 && <div className="card text-center text-gray-400">Nenhuma notificação.</div>}
          {items.map((n) => (
            <div key={n.id} className={`card flex items-start gap-4 transition ${!n.read ? 'border-brand-200 bg-brand-50' : ''}`}>
              <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-gray-300' : 'bg-brand-500'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
                <p className="mt-1 text-xs text-gray-400">{new Date(n.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              {!n.read && (
                <button onClick={() => dispatch(markRead(n.id))} className="shrink-0 text-xs text-brand-600 hover:text-brand-700">
                  Marcar como lida
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
