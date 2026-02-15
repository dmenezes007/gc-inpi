import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function proxy(req) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;
  const isProtected = path.startsWith('/formulario') || path.startsWith('/dashboard');
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  if (!hasSupabaseEnv && isProtected) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  let session = null;

  if (hasSupabaseEnv) {
    try {
      const supabase = createMiddlewareClient({ req, res });
      const { data } = await supabase.auth.getSession();
      session = data.session;
    } catch {
      session = null;
    }
  }

  if (!session && isProtected) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  if (session && path.startsWith('/login')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/formulario';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/login', '/formulario/:path*', '/dashboard/:path*'],
};
