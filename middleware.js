import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req) { // Alterado para middleware
  let res = NextResponse.next({ request: req });
  const path = req.nextUrl.pathname;
  const isProtected = path.startsWith('/formulario') || path.startsWith('/dashboard');

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
  const { data: { session } } = await supabase.auth.getSession();

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