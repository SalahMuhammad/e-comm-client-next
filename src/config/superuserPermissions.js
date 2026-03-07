/**
 * Superuser Permission Utilities
 * 
 * These utilities help identify which permissions require SUPERUSER status.
 * The data comes from the backend API, which automatically detects views
 * using SuperUserRequiredMixin and marks their permissions accordingly.
 * 
 * No manual configuration needed - the backend scans URL patterns automatically!
 */

/**
 * Check if a permission requires superuser status
 * @param {Object} permission - Permission object from API with requires_superuser field
 * @returns {boolean}
 */
export function isPermissionSuperuserRequired(permission) {
    // The API now provides this field directly via automatic introspection
    return permission?.requires_superuser === true;
}
