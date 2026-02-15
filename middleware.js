import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isValidSupabaseUrl, normalizeSupabaseUrl } from '@/lib/supabaseEnv';

export async function middleware(req) { // Alterado para middleware
  let res = NextResponse.next({ request: req });
  const path = req.nextUrl.pathname;
  const isProtected = path.startsWith('/formulario') || path.startsWith('/dashboard');
  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasSupabaseEnv = Boolean(isValidSupabaseUrl(supabaseUrl) && supabaseAnonKey);

  if (!hasSupabaseEnv) {
    if (isProtected) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return res;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );

  // Use getSession para evitar o erro 400 de validação excessiva
  let session = null;

  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch {
    session = null;
  }

  // 1. Se não houver sessão e a rota for protegida -> Login
  if (!session && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Se houver sessão e tentar ir para o login -> Formulário
  if (session && path === '/login') {
    return NextResponse.redirect(new URL('/formulario', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/login', '/formulario/:path*', '/dashboard/:path*'],
};  