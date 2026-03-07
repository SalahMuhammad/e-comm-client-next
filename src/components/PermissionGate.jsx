'use client';

import { usePermissions } from '@/hooks/usePermissions';

/**
 * PermissionGate Component
 * 
 * Conditionally renders children based on user permissions.
 * Automatically handles superuser bypass.
 * 
 * @param {Object} props
 * @param {string} props.permission - Single permission to check
 * @param {string[]} props.permissions - Multiple permissions to check
 * @param {boolean} props.requireAll - If true, requires ALL permissions (AND logic). Default: false (OR logic)
 * @param {React.ReactNode} props.fallback - Component to show if no permission. Default: null
 * @param {React.ReactNode} props.children - Content to show if user has permission
 * 
 * @example
 * // Single permission
 * <PermissionGate permission="users.add_user">
 *   <button>Add User</button>
 * </PermissionGate>
 * 
 * @example
 * // Multiple permissions (OR logic - user needs ANY)
 * <PermissionGate permissions={['users.view_user', 'users.change_user']}>
 *   <UserManagement />
 * </PermissionGate>
 * 
 * @example
 * // Multiple permissions (AND logic - user needs ALL)
 * <PermissionGate permissions={['users.change_user', 'users.delete_user']} requireAll>
 *   <DangerZone />
 * </PermissionGate>
 * 
 * @example
 * // With fallback
 * <PermissionGate 
 *   permission="admin.access"
 *   fallback={<div>You don't have permission to view this.</div>}
 * >
 *   <AdminPanel />
 * </PermissionGate>
 */
export function PermissionGate({
    permission,
    permissions,
    requireAll = false,
    fallback = null,
    children
}) {
    const { can, canAll, canAny } = usePermissions();

    let hasAccess = false;

    if (permission) {
        // Single permission check
        hasAccess = can(permission);
    } else if (permissions) {
        // Multiple permissions check
        hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
    } else {
        // No permissions specified = always allow
        hasAccess = true;
    }

    return hasAccess ? children : fallback;
}

/**
 * FeatureGate Component
 * 
 * Like PermissionGate but uses FEATURE_PERMISSIONS config.
 * Useful for checking access to routes and features.
 * 
 * @param {Object} props
 * @param {string} props.feature - Feature key from FEATURE_PERMISSIONS config
 * @param {React.ReactNode} props.fallback - Component to show if no permission
 * @param {React.ReactNode} props.children - Content to show if user has permission
 * 
 * @example
 * <FeatureGate feature="/user-management">
 *   <UserManagementPage />
 * </FeatureGate>
 * 
 * @example
 * <FeatureGate feature="add-user">
 *   <button>Add User</button>
 * </FeatureGate>
 */
export function FeatureGate({ feature, fallback = null, children }) {
    const { canAccessFeature } = usePermissions();

    const hasAccess = canAccessFeature(feature);

    return hasAccess ? children : fallback;
}
