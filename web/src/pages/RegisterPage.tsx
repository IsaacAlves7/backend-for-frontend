import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { registerThunk } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector((s) => s.auth.loading);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(registerThunk({ name: data.name, email: data.email, password: data.password }));
    if (registerThunk.fulfilled.match(result)) {
      toast.success('Conta criada com sucesso!');
      navigate('/dashboard');
    } else {
      toast.error(result.payload as string ?? 'Erro ao criar conta');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
            <span className="text-lg font-bold text-white">TF</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
          <p className="mt-1 text-sm text-gray-500">Comece a gerenciar suas tarefas hoje</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              { name: 'name' as const, label: 'Nome completo', type: 'text', placeholder: 'João Silva' },
              { name: 'email' as const, label: 'E-mail', type: 'email', placeholder: 'seu@email.com' },
              { name: 'password' as const, label: 'Senha', type: 'password', placeholder: '••••••••' },
              { name: 'confirmPassword' as const, label: 'Confirmar senha', type: 'password', placeholder: '••••••••' },
            ].map((f) => (
              <div key={f.name}>
                <label className="mb-1 block text-sm font-medium text-gray-700">{f.label}</label>
                <input {...register(f.name)} type={f.type} className="input" placeholder={f.placeholder} />
                {errors[f.name] && <p className="mt-1 text-xs text-red-600">{errors[f.name]?.message}</p>}
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
