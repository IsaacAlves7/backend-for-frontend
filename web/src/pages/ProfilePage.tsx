import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { loadProfileThunk } from '@/store/slices/authSlice';
import { api } from '@/api/client';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { name: '', bio: '', avatar: '' } });

  useEffect(() => {
    if (user) reset({ name: user.name ?? '', bio: '', avatar: user.avatar ?? '' });
  }, [user, reset]);

  const onSubmit = async (data: { name: string; bio: string; avatar: string }) => {
    try {
      await api.patch('/profile', data);
      await dispatch(loadProfileThunk());
      toast.success('Perfil atualizado!');
    } catch {
      toast.error('Erro ao atualizar perfil.');
    }
  };

  return (
    <div className="p-8 max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Meu Perfil</h1>

      <div className="card mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-600">
          {user?.name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold text-gray-900">Editar informações</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nome</label>
            <input {...register('name')} className="input" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Bio</label>
            <textarea {...register('bio')} className="input" rows={3} placeholder="Fale um pouco sobre você..." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">URL do Avatar</label>
            <input {...register('avatar')} className="input" placeholder="https://..." />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary">Salvar alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}
