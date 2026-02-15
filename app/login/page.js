'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasValidSupabaseEnv } from '@/lib/supabaseClient';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const supabaseConfigured = hasValidSupabaseEnv() && Boolean(supabase);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="flex-1 bg-[#F3F4F6] py-6 px-4">
      <div className="container-lg mx-auto flex justify-center">
        <div className="w-full max-w-md">
          <h1 className="mb-4 text-center text-2xl font-bold text-slate-900">Portal da Gestão do Conhecimento</h1>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="m-0 text-lg text-center font-bold text-slate-900">Acesso ao Sistema</h2>

            {!supabaseConfigured || !supabase ? (
              <p className="text-sm text-rose-600">
                Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para habilitar o login.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="br-input">
                  <label htmlFor="email">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seuemail@dominio.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="br-input has-icon">
                  <label htmlFor="password">
                    Senha
                  </label>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    className="br-button circle small"
                    type="button"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
                  </button>
                </div>

                <button type="submit" disabled={loading} className="br-button primary w-full">
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>

                {errorMessage && <p className="text-sm text-rose-600">{errorMessage}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
