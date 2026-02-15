'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeMinimal } from '@supabase/auth-ui-shared';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { hasValidSupabaseEnv } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const supabaseConfigured = hasValidSupabaseEnv();
  const supabase = supabaseConfigured ? createClientComponentClient() : null;

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

  return (
    <main className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-slate-900">Acesso ao Sistema</h1>

        {!supabaseConfigured || !supabase ? (
          <p className="text-sm text-rose-600">
            Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para habilitar o login.
          </p>
        ) : (
          <Auth
            supabaseClient={supabase}
            providers={[]}
            appearance={{ theme: ThemeMinimal }}
            theme="minimal"
          />
        )}
      </div>
    </main>
  );
}
