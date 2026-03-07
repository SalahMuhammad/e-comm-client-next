import { routePermissions } from '@/config/route-permissions.config';

/**
 * Normalize pathname by removing locale prefix
 * @param {string} pathname - Full pathname (e.g., "/en/items/list")
 * @param {string[]} locales - Array of supported locales
 * @returns {string} Normalized pathname without locale (e.g., "/items/list")
 */
export function normalizePathname(pathname, locales = ['en', 'ar']) {
    // Remove trailing slash
    const cleanPath = pathname.endsWith('/') && pathname.length > 1
        ? pathname.slice(0, -1)
        : pathname;

    // Check if path starts with a locale
    for (const locale of locales) {
        const prefix = `/${locale}`;
        if (cleanPath.startsWith(prefix)) {
            const withoutLocale = cleanPath.slice(prefix.length);
            return withoutLocale || '/';
        }
    }

    return cleanPath;
}

/**
 * Match a pathname against a route pattern
 * Supports:
 * - Exact matches: "/items/list"
 * - Wildcards: "/items/*" matches "/items/anything"
 * - Parameters: "/items/:id" matches "/items/123"
 * 
 * @param {string} pathname - The pathname to match
 * @param {string} pattern - The route pattern
 * @returns {boolean} True if pathname matches pattern
 */
export function matchRoute(pathname, pattern) {
    // Exact match
    if (pathname === pattern) {
        return true;
    }

    // Wildcard match: /items/* matches /items/anything
    if (pattern.includes('*')) {
        const patternPrefix = pattern.split('*')[0];
        return pathname.startsWith(patternPrefix);
    }

    // Parameter match: /items/:id matches /items/123
    if (pattern.includes(':')) {
        const patternParts = pattern.split('/');
        const pathnameParts = pathname.split('/');

        // Must have same number of parts
        if (patternParts.length !== pathnameParts.length) {
            return false;
        }

        // Check each part
        return patternParts.every((part, index) => {
            // Parameter placeholders match anything
            if (part.startsWith(':')) {
                return true;
            }
            // Otherwise must be exact match
            return part === pathnameParts[index];
        });
    }

    return false;
}

/**
 * Get required permissions for a route
 * @param {string} pathname - The pathname to check (should be normalized, without locale)
 * @returns {string[] | "public" | null} Array of permissions, "public", or null if not found
 */
export function getRequiredPermissions(pathname) {
    // First try exact match
    if (routePermissions[pathname]) {
        return routePermissions[pathname];
    }

    // Then try pattern matching
    for (const [pattern, permissions] of Object.entries(routePermissions)) {
        if (matchRoute(pathname, pattern)) {
            return permissions;
        }
    }

    // No match found - route doesn't have specific permissions
    // (will be treated as "authenticated only")
    return null;
}

/**
 * Check if user has access to a route
 * @param {string} pathname - The pathname to check (should be normalized, without locale)
 * @param {Set<string> | string[]} userPermissions - User's permissions (Set or Array)
 * @param {boolean} isSuperuser - Whether the user is a superuser
 * @returns {boolean} True if user has access
 */
export function hasRouteAccess(pathname, userPermissions, isSuperuser = false) {
    if (isSuperuser) return true;

    const requiredPermissions = getRequiredPermissions(pathname);

    // Public route - everyone has access
    if (requiredPermissions === "public") {
        return true;
    }

    // No specific permissions required - authenticated users have access
    if (requiredPermissions === null) {
        return true;
    }

    // Superuser only route, and we already know they are not a superuser from above
    if (Array.isArray(requiredPermissions) && requiredPermissions.includes('superuser_only')) {
        return false;
    }

    // Convert to Set for fast lookup if it's an array
    const permSet = userPermissions instanceof Set
        ? userPermissions
        : new Set(userPermissions || []);

    // User needs at least ONE of the required permissions (OR logic)
    return requiredPermissions.some(perm => permSet.has(perm));
}

/**
 * Get a list of all routes the user can access
 * @param {Set<string> | string[]} userPermissions - User's permissions
 * @param {boolean} isSuperuser - Whether the user is a superuser
 * @returns {string[]} Array of accessible route patterns
 */
export function getAccessibleRoutes(userPermissions, isSuperuser = false) {
    const accessibleRoutes = [];

    for (const [route, permissions] of Object.entries(routePermissions)) {
        if (permissions === "public" || hasRouteAccess(route, userPermissions, isSuperuser)) {
            accessibleRoutes.push(route);
        }
    }

    return accessibleRoutes;
}

/**
 * Debug helper: Get permission check details
 * @param {string} pathname - The pathname to check
 * @param {Set<string> | string[]} userPermissions - User's permissions
 * @returns {object} Detailed permission check info
 */
export function getPermissionCheckDetails(pathname, userPermissions) {
    const normalizedPath = normalizePathname(pathname);
    const requiredPermissions = getRequiredPermissions(normalizedPath);
    const hasAccess = hasRouteAccess(normalizedPath, userPermissions);

    return {
        pathname,
        normalizedPath,
        requiredPermissions,
        userPermissions: Array.from(userPermissions || []),
        hasAccess,
        reason: requiredPermissions === "public"
            ? "Public route"
            : requiredPermissions === null
                ? "No specific permissions required"
                : hasAccess
                    ? "User has required permission"
                    : "User lacks required permission"
    };
}
