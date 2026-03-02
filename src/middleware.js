import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { normalizePathname, hasRouteAccess } from './utils/auth/route-permissions.utils';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request) {
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
    const isUnauthorizedPage = pathname.includes('/unauthorized');

    const isAuthenticated = username && auth0 && auth1;

    // ── Unauthenticated guard ─────────────────────────────────────────────────
    // If the user has no session and is trying to access a protected page,
    // redirect to login. Auth pages, logout and unauthorized are always reachable.
    if (!isAuthenticated && !isAuthPage && !isLogout && !isUnauthorizedPage) {
        const locale = pathname.split('/')[1] || 'en';
        return NextResponse.redirect(new URL(`/${locale}/auth/`, request.nextUrl.origin));
    }

    // ── Authenticated guards ──────────────────────────────────────────────────

    // If user needs to change password, redirect to change-password page
    if (isAuthenticated && passwordChangeRequired && !isChangePasswordPage && !isLogout) {
        return NextResponse.redirect(new URL(`/auth/change-password?required=true`, request.url));
    }

    // If logged in and on auth page (but not change-password), redirect to dashboard
    if (isAuthenticated && !isLogout && isAuthPage && !isChangePasswordPage && !passwordChangeRequired) {
        return NextResponse.redirect(new URL(`/dashboard`, request.url));
    }

    // ── Permission-based route protection ─────────────────────────────────────
    if (isAuthenticated && !isAuthPage && !isLogout && !isUnauthorizedPage) {
        const { getUserPermissionsAndStatus } = await import('@/utils/auth/role');
        const { permissions: userPermissions, isSuperuser } = await getUserPermissionsAndStatus();

        // Superusers bypass all permission checks
        if (isSuperuser) {
            return response;
        }

        const normalizedPath = normalizePathname(pathname, routing.locales);
        const hasAccess = hasRouteAccess(normalizedPath, userPermissions);

        if (!hasAccess) {
            const locale = pathname.split('/')[1] || 'en';
            const unauthorizedUrl = new URL(`/${locale}/unauthorized`, request.nextUrl.origin);
            return NextResponse.redirect(unauthorizedUrl);
        }
    }

    return response;
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};