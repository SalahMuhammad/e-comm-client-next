import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  const response = intlMiddleware(request);

  const { pathname } = request.nextUrl;

  const username = request.cookies.get('username')?.value;
  const auth0 = request.cookies.get('auth_0')?.value;
  const auth1 = request.cookies.get('auth_1')?.value;

  const isLogout = pathname.includes('/logout');
  const isAuthPage = pathname.includes('/auth');
  
  // If Logged in redirect
  if (username && auth0 && auth1 && !isLogout && isAuthPage) {
    return NextResponse.redirect(new URL(`/dashboard`, request.url));
  }

  return response; 
}
1
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};