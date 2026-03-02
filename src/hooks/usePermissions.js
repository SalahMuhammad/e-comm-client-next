'use client';

import { useRoleContext } from '@/app/providers/role-provider.client';
import { FEATURE_PERMISSIONS } from '@/config/permissions.config';

/**
 * Custom hook for permission checking
 * 
 * Provides convenient methods to check user permissions throughout the app.
 * Automatically handles superuser bypass.
 * 
 * @returns {Object} Permission checking methods
 * 
 * @example
 * const { can, canAll, canAny, canAccessFeature } = usePermissions();
 * 
 * if (can('users.add_user')) {
 *   // Show add user button
 * }
 * 
 * if (canAccessFeature('/user-management')) {
 *   // Show navigation item
 * }
 */
export function usePermissions() {
    const { hasPermission, isSuperuser } = useRoleContext();

    return {
        /**
         * Check if user has a single permission
         * @param {string} permission - Permission string (e.g., 'users.view_user')
         * @returns {boolean}
         */
        can: (permission) => {
            if (!permission) return true;
            return isSuperuser || hasPermission(permission);
        },

        /**
         * Check if user has ALL of the specified permissions (AND logic)
         * @param {string[]} permissions - Array of permission strings
         * @returns {boolean}
         */
        canAll: (permissions) => {
            if (!permissions || permissions.length === 0) return true;
            return isSuperuser || permissions.every(p => hasPermission(p));
        },

        /**
         * Check if user has ANY of the specified permissions (OR logic)
         * @param {string[]} permissions - Array of permission strings
         * @returns {boolean}
         */
        canAny: (permissions) => {
            if (!permissions || permissions.length === 0) return true;
            return isSuperuser || permissions.some(p => hasPermission(p));
        },

        /**
         * Check if user can access a feature based on FEATURE_PERMISSIONS config
         * @param {string} featureKey - Feature key from FEATURE_PERMISSIONS
         * @returns {boolean}
         */
        canAccessFeature: (featureKey) => {
            const requiredPerms = FEATURE_PERMISSIONS[featureKey];
            if (!requiredPerms || requiredPerms.length === 0) return true;
            return isSuperuser || requiredPerms.some(p => hasPermission(p));
        },

        /**
         * Direct access to superuser status
         */
        isSuperuser,

        /**
         * Direct access to raw hasPermission from context
         * Use this for custom permission logic
         */
        hasPermission,
    };
}

// Re-export permission constants for convenience
export { PERMISSIONS, FEATURE_PERMISSIONS } from '@/config/permissions.config';
