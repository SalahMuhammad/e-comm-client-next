import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
    const url = request.nextUrl.clone();
    const originalUrl = url.pathname + url.search;
    request.headers.set('x-original-url', originalUrl);


    const response = intlMiddleware(request);

    const { pathname } = request.nextUrl;

    const username = request.cookies.get('username')?.value;
    const auth0 = request.cookies.get('auth_0')?.value;
    const auth1 = request.cookies.get('auth_1')?.value;
    const passwordChangeRequired = request.cookies.get('password_change_required')?.value === 'true';

    const isLogout = pathname.includes('/logout');
    const isAuthPage = pathname.includes('/auth');
    const isChangePasswordPage = pathname.includes('/auth/change-password');

    // If user needs to change password, redirect to change-password page
    // (except if already on change-password or logout page)
    if (username && auth0 && auth1 && passwordChangeRequired && !isChangePasswordPage && !isLogout) {
        return NextResponse.redirect(new URL(`/auth/change-password?required=true`, request.url));
    }

    // If Logged in and on auth page (but not change-password), redirect to dashboard
    if (username && auth0 && auth1 && !isLogout && isAuthPage && !isChangePasswordPage && !passwordChangeRequired) {
        return NextResponse.redirect(new URL(`/dashboard`, request.url));
    }

    return response;
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};