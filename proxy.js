import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(req) {
  let res = NextResponse.next({ request: req });
  const path = req.nextUrl.pathname;
  const isProtected = path.startsWith('/formulario') || path.startsWith('/dashboard');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);

  if (!hasSupabaseEnv && isProtected) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  let session = null;

  if (hasSupabaseEnv) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
            res = NextResponse.next({ request: req });
            cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();
      session = user ? { user } : null;
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
