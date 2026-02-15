'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasValidSupabaseEnv } from '@/lib/supabaseClient';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const supabaseConfigured = hasValidSupabaseEnv() && Boolean(supabase);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/formulario');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/formulario');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase, supabaseConfigured]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (!supabaseConfigured || !supabase) {
        throw new Error('Supabase não configurado. Verifique as variáveis de ambiente no Vercel.');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push('/formulario');
    } catch (error) {
      setErrorMessage(error.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-slate-900">Acesso ao Sistema</h1>

        {!supabaseConfigured || !supabase ? (
          <p className="text-sm text-rose-600">
            Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para habilitar o login.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="seuemail@dominio.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            {errorMessage && <p className="text-sm text-rose-600">{errorMessage}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
