'use server';

import { getUserPermissionsAndStatus } from '@/utils/auth/role';

/**
 * Server-side PermissionGate component for Next.js Server Components
 * Use this in server components (async pages) for permission-based conditional rendering
 * 
 * @param {Object} props
 * @param {string|string[]} props.permission - Single permission or array of permissions required
 * @param {boolean} props.requireAll - If true, require all permissions. If false (default), require any one permission
 * @param {React.ReactNode} props.children - Content to render if permission check passes
 * @param {React.ReactNode} props.fallback - Optional content to render if permission check fails
 */
export async function PermissionGateServer({
    permission,
    requireAll = false,
    children,
    fallback = null
}) {
    // Get user permissions
    const { permissions, isSuperuser } = await getUserPermissionsAndStatus();

    // Superuser has all permissions
    if (isSuperuser) {
        return <>{children}</>;
    }

    // No permission specified = show to everyone
    if (!permission) {
        return <>{children}</>;
    }

    // Convert single permission to array
    const requiredPermissions = Array.isArray(permission) ? permission : [permission];

    // Check permissions
    const hasPermission = requireAll
        ? requiredPermissions.every(perm => permissions.includes(perm))
        : requiredPermissions.some(perm => permissions.includes(perm));

    if (hasPermission) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}

/**
 * Server-side FeatureGate component for Next.js Server Components
 * Use this in server components for feature-based conditional rendering
 * 
 * @param {Object} props
 * @param {string} props.feature - Feature key from FEATURE_PERMISSIONS config
 * @param {React.ReactNode} props.children - Content to render if permission check passes
 * @param {React.ReactNode} props.fallback - Optional content to render if permission check fails
 */
export async function FeatureGateServer({ feature, children, fallback = null }) {
    const { FEATURE_PERMISSIONS } = await import('@/config/permissions.config');

    const featurePerms = FEATURE_PERMISSIONS[feature];
    if (!featurePerms) {
        return <>{fallback}</>;
    }

    // FEATURE_PERMISSIONS values can be either:
    //   - a plain array:  ['/users.view_user', ...]
    //   - an object:      { permissions: [...], requireAll: bool }
    const permissions = Array.isArray(featurePerms) ? featurePerms : featurePerms.permissions;
    const requireAll = Array.isArray(featurePerms) ? false : (featurePerms.requireAll ?? false);

    return (
        <PermissionGateServer
            permission={permissions}
            requireAll={requireAll}
            fallback={fallback}
        >
            {children}
        </PermissionGateServer>
    );
}
